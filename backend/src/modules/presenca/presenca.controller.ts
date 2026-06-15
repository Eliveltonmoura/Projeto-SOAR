import { Controller, Post, Get, Body, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PresencaService, LancarPresencaDto } from './presenca.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PapelUsuario } from '../auth/usuario.entity';
import { CurrentUsuario } from '../auth/current-usuario.decorator';
import { UsuarioAutenticado } from '../auth/jwt.strategy';

@ApiTags('Presença')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('presenca')
export class PresencaController {
  constructor(private readonly presencaService: PresencaService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiOperation({ summary: 'HU-03 — Lançar presença (mobile-friendly)' })
  lancar(@Body() dto: LancarPresencaDto) {
    return this.presencaService.lancar(dto);
  }

  @Get('aluno')
  @ApiOperation({ summary: 'Histórico de presença de um aluno' })
  findByAluno(@Query('alunoId') alunoId: string, @CurrentUsuario() usuario: UsuarioAutenticado) {
    if (usuario.papel === PapelUsuario.ALUNO && usuario.alunoId !== alunoId) {
      throw new ForbiddenException('Você não tem permissão para acessar este recurso.');
    }
    return this.presencaService.findByAluno(alunoId);
  }

  @Get('data')
  @UseGuards(RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiOperation({ summary: 'Presenças de uma data (YYYY-MM-DD)' })
  findByData(@Query('data') data: string) {
    return this.presencaService.findByData(data);
  }

  @Get('turma')
  @UseGuards(RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiOperation({ summary: 'Presenças de uma turma (instrumento + horário) em uma data' })
  findByTurma(
    @Query('instrumento') instrumento: string,
    @Query('horario') horario: string,
    @Query('data') data: string,
  ) {
    return this.presencaService.findByTurmaEData(instrumento, horario, data);
  }
}
