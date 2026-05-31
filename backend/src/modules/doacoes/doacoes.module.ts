import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doacao } from './doacao.entity';
import { DoacoesService } from './doacoes.service';
import { DoacoesController } from './doacoes.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Doacao])],
  controllers: [DoacoesController],
  providers: [DoacoesService],
  exports: [DoacoesService],
})
export class DoacoesModule {}
