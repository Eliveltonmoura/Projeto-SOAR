import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IsBoolean, IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';
import { RegistroPresenca } from './presenca.entity';
import { Aluno } from '../alunos/aluno.entity';

export class LancarPresencaDto {
  @IsUUID()
  alunoId: string;

  @IsDateString()
  data: string; // 'YYYY-MM-DD'

  @IsBoolean()
  presente: boolean;

  @IsOptional()
  @IsString()
  conteudoAula?: string;

  @IsOptional()
  @IsString()
  professor?: string;

  @IsOptional()
  @IsString()
  observacoes?: string;
}

@Injectable()
export class PresencaService {
  // HU-03: só permite lançamento no dia atual ou até 1 dia atrás
  private readonly DIAS_RETROATIVO_PERMITIDO = 1;

  constructor(
    @InjectRepository(RegistroPresenca)
    private readonly presencaRepo: Repository<RegistroPresenca>,
    @InjectRepository(Aluno)
    private readonly alunoRepo: Repository<Aluno>,
  ) {}

  async lancar(dto: LancarPresencaDto): Promise<RegistroPresenca> {
    const dataAula = new Date(dto.data);
    const hoje = new Date();

    // Bloqueia retroativos além do limite permitido
    const diffDias = Math.floor(
      (hoje.getTime() - dataAula.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDias > this.DIAS_RETROATIVO_PERMITIDO) {
      throw new BadRequestException(
        `Lançamento retroativo permitido apenas até ${this.DIAS_RETROATIVO_PERMITIDO} dia(s) atrás.`,
      );
    }

    const aluno = await this.alunoRepo.findOne({ where: { id: dto.alunoId } });
    if (!aluno) throw new NotFoundException('Aluno não encontrado.');

    // Verifica se já existe registro para este aluno nesta data
    const existente = await this.presencaRepo.findOne({
      where: { aluno: { id: dto.alunoId }, data: dataAula },
    });
    if (existente) {
      // Atualiza em vez de duplicar
      Object.assign(existente, { ...dto, data: dataAula });
      return this.presencaRepo.save(existente);
    }

    const registro = this.presencaRepo.create({
      aluno,
      data: dataAula,
      presente: dto.presente,
      conteudoAula: dto.conteudoAula,
      professor: dto.professor,
      observacoes: dto.observacoes,
    });

    return this.presencaRepo.save(registro);
  }

  async findByAluno(alunoId: string): Promise<RegistroPresenca[]> {
    return this.presencaRepo.find({
      where: { aluno: { id: alunoId } },
      order: { data: 'DESC' },
    });
  }

  async findByData(data: string): Promise<RegistroPresenca[]> {
    return this.presencaRepo.find({
      where: { data: new Date(data) },
      order: { lancadoEm: 'ASC' },
    });
  }

  // HU-03: presenças já lançadas para uma turma (instrumento + horário) em uma data
  async findByTurmaEData(instrumento: string, horario: string, data: string): Promise<RegistroPresenca[]> {
    return this.presencaRepo.find({
      where: {
        data: new Date(data),
        aluno: { instrumentoDesejado: instrumento, horarioPreferencial: horario },
      },
      order: { lancadoEm: 'ASC' },
    });
  }
}
