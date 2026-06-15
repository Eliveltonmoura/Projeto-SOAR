import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from '../alunos/aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { TurmasService } from './turmas.service';
import { TurmasController } from './turmas.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Aluno, RegistroPresenca])],
  controllers: [TurmasController],
  providers: [TurmasService],
})
export class TurmasModule {}
