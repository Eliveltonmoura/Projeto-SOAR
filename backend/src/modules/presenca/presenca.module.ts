import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistroPresenca } from './presenca.entity';
import { PresencaService } from './presenca.service';
import { PresencaController } from './presenca.controller';
import { Aluno } from '../alunos/aluno.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegistroPresenca, Aluno])],
  controllers: [PresencaController],
  providers: [PresencaService],
  exports: [PresencaService],
})
export class PresencaModule {}
