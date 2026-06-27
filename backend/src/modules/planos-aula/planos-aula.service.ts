import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanoAula } from './plano-aula.entity';
import { SalvarPlanoAulaDto } from './dto/plano-aula.dto';

@Injectable()
export class PlanosAulaService {
  constructor(
    @InjectRepository(PlanoAula)
    private readonly planoRepo: Repository<PlanoAula>,
  ) {}

  // Um plano por turma+data — se já existir, atualiza em vez de duplicar
  async salvar(dto: SalvarPlanoAulaDto, professor?: string): Promise<PlanoAula> {
    const data = new Date(dto.data);

    const existente = await this.planoRepo.findOne({
      where: { instrumento: dto.instrumento, horario: dto.horario, data },
    });

    if (existente) {
      Object.assign(existente, { ...dto, data, professor: professor ?? existente.professor });
      return this.planoRepo.save(existente);
    }

    const plano = this.planoRepo.create({ ...dto, data, professor });
    return this.planoRepo.save(plano);
  }

  async listarPorTurma(instrumento: string, horario: string): Promise<PlanoAula[]> {
    return this.planoRepo.find({
      where: { instrumento, horario },
      order: { data: 'DESC' },
    });
  }
}
