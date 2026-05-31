import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PresencaService, LancarPresencaDto } from './presenca.service';

@ApiTags('Presença')
@Controller('presenca')
export class PresencaController {
  constructor(private readonly presencaService: PresencaService) {}

  @Post()
  @ApiOperation({ summary: 'HU-03 — Lançar presença (mobile-friendly)' })
  lancar(@Body() dto: LancarPresencaDto) {
    return this.presencaService.lancar(dto);
  }

  @Get('aluno')
  @ApiOperation({ summary: 'Histórico de presença de um aluno' })
  findByAluno(@Query('alunoId') alunoId: string) {
    return this.presencaService.findByAluno(alunoId);
  }

  @Get('data')
  @ApiOperation({ summary: 'Presenças de uma data (YYYY-MM-DD)' })
  findByData(@Query('data') data: string) {
    return this.presencaService.findByData(data);
  }
}
