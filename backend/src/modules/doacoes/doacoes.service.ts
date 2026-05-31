import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doacao, StatusDoacao } from './doacao.entity';
import * as path from 'path';
import * as fs from 'fs';

export class CreateDoacaoDto {
  nomeDoador: string;
  cpfDoador?: string;
  email?: string;
  valor: number;
  mensagem?: string;
}

@Injectable()
export class DoacoesService {
  private readonly UPLOAD_DIR = './uploads/comprovantes';

  constructor(
    @InjectRepository(Doacao)
    private readonly doacaoRepo: Repository<Doacao>,
  ) {
    // Garante que o diretório de uploads existe
    if (!fs.existsSync(this.UPLOAD_DIR)) {
      fs.mkdirSync(this.UPLOAD_DIR, { recursive: true });
    }
  }

  // HU-04: Registrar doação com upload de comprovante PIX
  async registrar(
    dto: CreateDoacaoDto,
    arquivo?: Express.Multer.File,
  ): Promise<Doacao> {
    const doacao = this.doacaoRepo.create({
      ...dto,
      comprovantePixPath: arquivo?.path ?? null,
      comprovantePixOriginalName: arquivo?.originalname ?? null,
    });
    return this.doacaoRepo.save(doacao);
  }

  async findAll(): Promise<Doacao[]> {
    return this.doacaoRepo.find({ order: { criadoEm: 'DESC' } });
  }

  // Auditoria: confirmar ou rejeitar uma doação
  async auditar(
    id: string,
    status: StatusDoacao,
    conferidoPor: string,
  ): Promise<Doacao> {
    const doacao = await this.doacaoRepo.findOne({ where: { id } });
    if (!doacao) throw new NotFoundException('Doação não encontrada.');

    doacao.status = status;
    doacao.conferidoPor = conferidoPor;
    doacao.conferidoEm = new Date();
    return this.doacaoRepo.save(doacao);
  }

  // Totalizador para relatório de impacto social (HU-05)
  async totalConfirmado(): Promise<number> {
    const result = await this.doacaoRepo
      .createQueryBuilder('d')
      .select('SUM(d.valor)', 'total')
      .where('d.status = :status', { status: StatusDoacao.CONFIRMADO })
      .getRawOne();
    return Number(result.total) || 0;
  }
}
