import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aluno, StatusAluno } from '../alunos/aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { DoacoesService } from '../doacoes/doacoes.service';

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectRepository(Aluno)
    private readonly alunoRepo: Repository<Aluno>,
    @InjectRepository(RegistroPresenca)
    private readonly presencaRepo: Repository<RegistroPresenca>,
    private readonly doacoesService: DoacoesService,
  ) {}

  // HU-05: Dados consolidados de impacto social
  async impactoSocial() {
    const [totalAlunos, alunosAtivos, alunosNaFila] = await Promise.all([
      this.alunoRepo.count(),
      this.alunoRepo.count({ where: { status: StatusAluno.ATIVO } }),
      this.alunoRepo.count({ where: { status: StatusAluno.AGUARDANDO } }),
    ]);

    const totalDoacoes = await this.doacoesService.totalConfirmado();

    // Presença média dos últimos 30 dias
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);

    const registros = await this.presencaRepo
      .createQueryBuilder('p')
      .where('p.data >= :inicio', { inicio: trintaDiasAtras })
      .getCount();

    const presentes = await this.presencaRepo
      .createQueryBuilder('p')
      .where('p.data >= :inicio AND p.presente = true', { inicio: trintaDiasAtras })
      .getCount();

    const taxaPresenca = registros > 0
      ? Math.round((presentes / registros) * 100)
      : 0;

    return {
      geradoEm: new Date().toISOString(),
      alunos: {
        total: totalAlunos,
        ativos: alunosAtivos,
        naFila: alunosNaFila,
      },
      frequencia: {
        taxaMediaUltimos30Dias: `${taxaPresenca}%`,
        totalRegistros: registros,
      },
      financeiro: {
        totalDoacoesConfirmadas: totalDoacoes,
      },
    };
  }
}
