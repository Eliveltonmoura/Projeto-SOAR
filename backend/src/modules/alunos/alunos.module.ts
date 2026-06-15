import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aluno } from './aluno.entity';
import { RegistroPresenca } from '../presenca/presenca.entity';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Aluno, RegistroPresenca]), AuthModule],
  controllers: [AlunosController],
  providers: [AlunosService],
  exports: [AlunosService], // outros módulos podem usar o service
})
export class AlunosModule {}
