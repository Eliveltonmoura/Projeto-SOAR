import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanoAula } from './plano-aula.entity';
import { PlanosAulaService } from './planos-aula.service';
import { PlanosAulaController } from './planos-aula.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PlanoAula])],
  controllers: [PlanosAulaController],
  providers: [PlanosAulaService],
})
export class PlanosAulaModule {}
