import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PlanosAulaService } from './planos-aula.service';
import { SalvarPlanoAulaDto } from './dto/plano-aula.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PapelUsuario } from '../auth/usuario.entity';
import { CurrentUsuario } from '../auth/current-usuario.decorator';
import { UsuarioAutenticado } from '../auth/jwt.strategy';

@ApiTags('Plano de Aula')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(PapelUsuario.PROFESSOR)
@Controller('planos-aula')
export class PlanosAulaController {
  constructor(private readonly planosAulaService: PlanosAulaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria ou atualiza o plano de aula de uma turma numa data' })
  salvar(@Body() dto: SalvarPlanoAulaDto, @CurrentUsuario() usuario: UsuarioAutenticado) {
    return this.planosAulaService.salvar(dto, usuario.nome);
  }

  @Get('turma')
  @ApiOperation({ summary: 'Histórico de planos de aula de uma turma' })
  listarPorTurma(@Query('instrumento') instrumento: string, @Query('horario') horario: string) {
    return this.planosAulaService.listarPorTurma(instrumento, horario);
  }
}
