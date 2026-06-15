import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno, StatusAluno } from './aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { CreateAlunoDto, AlunoResponseDto } from './dto/aluno.dto';
import { VAGAS_POR_HORARIO } from './constants';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AlunosService {
  // Vagas por turma/horário — pode virar configuração no banco futuramente
  private readonly VAGAS_POR_HORARIO = VAGAS_POR_HORARIO;

  constructor(
    @InjectRepository(Aluno)
    private readonly alunoRepo: Repository<Aluno>,
    @InjectRepository(RegistroPresenca)
    private readonly presencaRepo: Repository<RegistroPresenca>,
    private readonly authService: AuthService,
  ) {}

  // HU-01: Matrícula com validação LGPD
  async matricular(dto: CreateAlunoDto): Promise<AlunoResponseDto> {
    // Trava LGPD obrigatória
    if (!dto.termoLgpdAssinado) {
      throw new BadRequestException(
        'O aceite do Termo LGPD pelo responsável é obrigatório para realizar a matrícula.',
      );
    }

    // Verifica duplicidade de CPF
    const existente = await this.alunoRepo.findOne({
      where: { cpfResponsavel: dto.cpfResponsavel },
    });
    if (existente) {
      throw new ConflictException(
        'Já existe um cadastro com este CPF do responsável.',
      );
    }

    const aluno = this.alunoRepo.create({
      ...dto,
      // Alunos maiores de idade são seu próprio responsável
      nomeResponsavel: dto.nomeResponsavel || dto.nomeCompleto,
      dataNascimento: new Date(dto.dataNascimento),
      status: StatusAluno.PENDENTE,
      posicaoFila: null,
      termoLgpdAssinadoEm: new Date(),
    });

    const salvo = await this.alunoRepo.save(aluno);
    return this.toResponseDto(salvo);
  }

  // Matrículas aguardando aprovação do administrador
  async findPendentes(): Promise<AlunoResponseDto[]> {
    const alunos = await this.alunoRepo.find({
      where: { status: StatusAluno.PENDENTE },
      order: { criadoEm: 'ASC' },
    });
    return alunos.map((aluno) => this.toResponseDto(aluno));
  }

  // Admin aceita a matrícula: vira aluno ativo ou entra na fila de espera, conforme vagas
  async aprovar(id: string): Promise<AlunoResponseDto> {
    const aluno = await this.alunoRepo.findOne({ where: { id } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado.');
    if (aluno.status !== StatusAluno.PENDENTE) {
      throw new BadRequestException('Esta matrícula já foi avaliada.');
    }

    const vagas = await this.contarVagasDisponiveis(aluno.horarioPreferencial);
    aluno.status = vagas > 0 ? StatusAluno.ATIVO : StatusAluno.AGUARDANDO;
    aluno.posicaoFila = aluno.status === StatusAluno.AGUARDANDO
      ? await this.proximaPosicaoFila(aluno.horarioPreferencial)
      : null;

    const salvo = await this.alunoRepo.save(aluno);
    await this.authService.criarContaParaAluno(salvo);
    return this.toResponseDto(salvo);
  }

  // Admin rejeita a matrícula
  async rejeitar(id: string): Promise<AlunoResponseDto> {
    const aluno = await this.alunoRepo.findOne({ where: { id } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado.');
    if (aluno.status !== StatusAluno.PENDENTE) {
      throw new BadRequestException('Esta matrícula já foi avaliada.');
    }

    aluno.status = StatusAluno.REJEITADO;
    const salvo = await this.alunoRepo.save(aluno);
    return this.toResponseDto(salvo);
  }

  async findAll(): Promise<AlunoResponseDto[]> {
    const alunos = await this.alunoRepo.find({
      order: { criadoEm: 'DESC' },
    });

    const faltas = await this.presencaRepo
      .createQueryBuilder('p')
      .select('p.aluno_id', 'alunoId')
      .addSelect('COUNT(*)', 'total')
      .where('p.presente = false')
      .groupBy('p.aluno_id')
      .getRawMany();
    const faltasMap = new Map(faltas.map((f) => [f.alunoId, Number(f.total)]));

    return alunos.map((aluno) => ({
      ...this.toResponseDto(aluno),
      faltas: faltasMap.get(aluno.id) ?? 0,
    }));
  }

  async findById(id: string): Promise<AlunoResponseDto> {
    const aluno = await this.alunoRepo.findOne({ where: { id } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado.');
    return this.toResponseDto(aluno);
  }

  // HU-02: Fila de espera — promove o próximo quando uma vaga abre
  async promoverFilaDeEspera(horario: string): Promise<void> {
    const proximo = await this.alunoRepo.findOne({
      where: { status: StatusAluno.AGUARDANDO, horarioPreferencial: horario },
      order: { posicaoFila: 'ASC' },
    });
    if (!proximo) return;

    proximo.status = StatusAluno.ATIVO;
    proximo.posicaoFila = null;
    await this.alunoRepo.save(proximo);

    // Reordena as posições restantes na fila
    await this.reordenarFila(horario);
  }

  // ── Métodos internos (privados) ──────────────────────────────────────────

  private async contarVagasDisponiveis(horario: string): Promise<number> {
    const ativos = await this.alunoRepo.count({
      where: { status: StatusAluno.ATIVO, horarioPreferencial: horario },
    });
    return Math.max(0, this.VAGAS_POR_HORARIO - ativos);
  }

  private async proximaPosicaoFila(horario: string): Promise<number> {
    const ultimo = await this.alunoRepo.findOne({
      where: { status: StatusAluno.AGUARDANDO, horarioPreferencial: horario },
      order: { posicaoFila: 'DESC' },
    });
    return (ultimo?.posicaoFila ?? 0) + 1;
  }

  private async reordenarFila(horario: string): Promise<void> {
    const fila = await this.alunoRepo.find({
      where: { status: StatusAluno.AGUARDANDO, horarioPreferencial: horario },
      order: { criadoEm: 'ASC' }, // ordenação por timestamp de cadastro
    });
    for (let i = 0; i < fila.length; i++) {
      fila[i].posicaoFila = i + 1;
    }
    await this.alunoRepo.save(fila);
  }

  // Mapper: Entity → DTO de resposta (sem expor CPF)
  private toResponseDto(aluno: Aluno): AlunoResponseDto {
    return {
      id: aluno.id,
      nomeCompleto: aluno.nomeCompleto,
      nomeResponsavel: aluno.nomeResponsavel,
      telefoneResponsavel: aluno.telefoneResponsavel,
      email: aluno.email,
      dataNascimento: aluno.dataNascimento,
      status: aluno.status,
      posicaoFila: aluno.posicaoFila,
      instrumentoDesejado: aluno.instrumentoDesejado,
      horarioPreferencial: aluno.horarioPreferencial,
      criadoEm: aluno.criadoEm,
    };
  }
}
