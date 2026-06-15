import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno, StatusAluno } from '../alunos/aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { VAGAS_POR_HORARIO } from '../alunos/constants';
import { AlunoDaTurmaDto, TurmaResumoDto } from './dto/turma.dto';

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
  ) {}

  // Turmas são derivadas do agrupamento instrumento + horário dos alunos ativos
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

    const professorPorGrupo = await this.professorMaisRecentePorGrupo();

    return grupos
      .map((grupo) => {
        const totalAlunos = Number(grupo.alunos);
        return {
          instrumento: grupo.instrumento,
          horario: grupo.horario,
          nome: `Turma ${this.capitalize(grupo.instrumento)} ${grupo.horario.toUpperCase()}`,
          professor: professorPorGrupo.get(this.chave(grupo.instrumento, grupo.horario)) ?? null,
          alunos: totalAlunos,
          vagas: Math.max(0, VAGAS_POR_HORARIO - totalAlunos),
        };
      })
      .filter((turma) => !filtros.instrumento || turma.instrumento === filtros.instrumento)
      .filter((turma) => !filtros.professor || turma.professor === filtros.professor);
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
