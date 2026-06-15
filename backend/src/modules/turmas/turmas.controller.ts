import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TurmasService } from './turmas.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PapelUsuario } from '../auth/usuario.entity';

@ApiTags('Turmas')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Get()
  @ApiOperation({ summary: 'Lista turmas (agrupadas por instrumento + horário)' })
  listar(@Query('instrumento') instrumento?: string, @Query('professor') professor?: string) {
    return this.turmasService.listar({ instrumento, professor });
  }

  @Get(':instrumento/:horario/alunos')
  @ApiOperation({ summary: 'Lista os alunos ativos de uma turma' })
  alunosDaTurma(@Param('instrumento') instrumento: string, @Param('horario') horario: string) {
    return this.turmasService.alunosDaTurma(instrumento, horario);
  }
}
