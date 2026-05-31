import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatoriosService } from './relatorios.service';
import { RelatoriosController } from './relatorios.controller';
import { Aluno } from '../alunos/aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { Doacao } from '../doacoes/doacao.entity';
import { DoacoesModule } from '../doacoes/doacoes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Aluno, RegistroPresenca, Doacao]),
    DoacoesModule,
  ],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
