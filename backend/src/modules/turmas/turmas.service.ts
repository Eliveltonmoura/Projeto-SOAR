import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno, StatusAluno } from '../alunos/aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { Turma } from './turma.entity';
import { Usuario } from '../auth/usuario.entity';
import { VAGAS_POR_HORARIO } from '../alunos/constants';
import { AlunoDaTurmaDto, TurmaResumoDto } from './dto/turma.dto';
import { CriarTurmaDto } from './dto/criar-turma.dto';

export interface FiltrosTurma {
  instrumento?: string;
  professor?: string;
}

@Injectable()
export class TurmasService {
  constructor(
    @InjectRepository(Aluno)
    private readonly alunoRepo: Repository<Aluno>,
    @InjectRepository(RegistroPresenca)
    private readonly presencaRepo: Repository<RegistroPresenca>,
    @InjectRepository(Turma)
    private readonly turmaRepo: Repository<Turma>,
  ) {}

  // Turmas vêm da união de duas fontes: as criadas formalmente pelo admin (Turma,
  // mesmo sem aluno ainda) e as derivadas do agrupamento instrumento + horário dos
  // alunos ativos (turmas "históricas" criadas antes de existir esse cadastro formal)
  async listar(filtros: FiltrosTurma = {}): Promise<TurmaResumoDto[]> {
    const grupos = await this.alunoRepo
      .createQueryBuilder('a')
      .select('a.instrumentoDesejado', 'instrumento')
      .addSelect('a.horarioPreferencial', 'horario')
      .addSelect('COUNT(*)', 'alunos')
      .where('a.status = :status', { status: StatusAluno.ATIVO })
      .andWhere('a.instrumentoDesejado IS NOT NULL')
      .andWhere('a.horarioPreferencial IS NOT NULL')
      .groupBy('a.instrumentoDesejado')
      .addGroupBy('a.horarioPreferencial')
      .getRawMany<{ instrumento: string; horario: string; alunos: string }>();

    const alunosPorGrupo = new Map<string, { instrumento: string; horario: string; total: number }>();
    grupos.forEach((g) =>
      alunosPorGrupo.set(this.chave(g.instrumento, g.horario), {
        instrumento: g.instrumento,
        horario: g.horario,
        total: Number(g.alunos),
      }),
    );

    const turmasFormais = await this.turmaRepo.find();
    const formalPorGrupo = new Map<string, Turma>();
    turmasFormais.forEach((t) => formalPorGrupo.set(this.chave(t.instrumento, t.horario), t));

    const professorDerivadoPorGrupo = await this.professorMaisRecentePorGrupo();

    const todasChaves = new Set([...alunosPorGrupo.keys(), ...formalPorGrupo.keys()]);

    return Array.from(todasChaves)
      .map((chave) => {
        const grupo = alunosPorGrupo.get(chave);
        const formal = formalPorGrupo.get(chave);
        const instrumento = grupo?.instrumento ?? formal!.instrumento;
        const horario = grupo?.horario ?? formal!.horario;
        const totalAlunos = grupo?.total ?? 0;
        return {
          instrumento,
          horario,
          nome: `Turma ${this.capitalize(instrumento)} ${horario.toUpperCase()}`,
          professor: formal?.professor?.nome ?? professorDerivadoPorGrupo.get(chave) ?? null,
          professorId: formal?.professor?.id ?? null,
          alunos: totalAlunos,
          vagas: Math.max(0, VAGAS_POR_HORARIO - totalAlunos),
        };
      })
      .filter((turma) => !filtros.instrumento || turma.instrumento === filtros.instrumento)
      .filter((turma) => !filtros.professor || turma.professor === filtros.professor)
      .sort((a, b) => a.instrumento.localeCompare(b.instrumento) || a.horario.localeCompare(b.horario));
  }

  // Admin cria formalmente uma turma (instrumento + horário), antes mesmo de ter aluno matriculado
  async criar(dto: CriarTurmaDto): Promise<TurmaResumoDto> {
    const existente = await this.turmaRepo.findOne({ where: { instrumento: dto.instrumento, horario: dto.horario } });
    if (existente) {
      throw new ConflictException('Já existe uma turma com esse instrumento e horário.');
    }

    const turma = this.turmaRepo.create({
      instrumento: dto.instrumento,
      horario: dto.horario,
      professor: dto.professorId ? ({ id: dto.professorId } as Usuario) : null,
    });
    await this.turmaRepo.save(turma);

    const todas = await this.listar({ instrumento: dto.instrumento });
    return todas.find((t) => t.horario === dto.horario)!;
  }

  // Só permite excluir turmas sem aluno ativo — turmas com alunos precisam
  // ser esvaziadas antes (transferir/excluir os alunos)
  async excluirTurma(instrumento: string, horario: string): Promise<void> {
    const totalAtivos = await this.alunoRepo.count({
      where: { status: StatusAluno.ATIVO, instrumentoDesejado: instrumento, horarioPreferencial: horario },
    });
    if (totalAtivos > 0) {
      throw new ConflictException('Não é possível excluir uma turma com alunos ativos.');
    }
    await this.turmaRepo.delete({ instrumento, horario });
  }

  // Turmas formalmente atribuídas a um professor
  async minhasTurmas(professorId: string): Promise<TurmaResumoDto[]> {
    const todas = await this.listar();
    return todas.filter((turma) => turma.professorId === professorId);
  }

  // Admin atribui (ou troca) o professor responsável por uma turma
  async atribuirProfessor(instrumento: string, horario: string, professorId: string): Promise<TurmaResumoDto> {
    let turma = await this.turmaRepo.findOne({ where: { instrumento, horario } });
    if (!turma) {
      turma = this.turmaRepo.create({ instrumento, horario });
    }
    turma.professor = { id: professorId } as Usuario;
    await this.turmaRepo.save(turma);

    const todas = await this.listar({ instrumento });
    return todas.find((t) => t.horario === horario)!;
  }

  async alunosDaTurma(instrumento: string, horario: string): Promise<AlunoDaTurmaDto[]> {
    const alunos = await this.alunoRepo.find({
      where: { status: StatusAluno.ATIVO, instrumentoDesejado: instrumento, horarioPreferencial: horario },
      order: { nomeCompleto: 'ASC' },
    });
    return alunos.map((a) => ({ id: a.id, nomeCompleto: a.nomeCompleto }));
  }

  // Para cada turma, considera o professor do lançamento de presença mais recente
  private async professorMaisRecentePorGrupo(): Promise<Map<string, string>> {
    const registros = await this.presencaRepo
      .createQueryBuilder('p')
      .innerJoin('p.aluno', 'a')
      .select('a.instrumentoDesejado', 'instrumento')
      .addSelect('a.horarioPreferencial', 'horario')
      .addSelect('p.professor', 'professor')
      .where('p.professor IS NOT NULL')
      .orderBy('p.lancadoEm', 'DESC')
      .getRawMany<{ instrumento: string; horario: string; professor: string }>();

    const mapa = new Map<string, string>();
    for (const registro of registros) {
      const chave = this.chave(registro.instrumento, registro.horario);
      if (!mapa.has(chave)) {
        mapa.set(chave, registro.professor);
      }
    }
    return mapa;
  }

  private chave(instrumento: string, horario: string): string {
    return `${instrumento}|${horario}`;
  }

  private capitalize(texto: string): string {
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }
}
