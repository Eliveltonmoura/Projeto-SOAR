import { Controller, Get, Post, Patch, Delete, Param, Query, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TurmasService } from './turmas.service';
import { AtribuirProfessorDto } from './dto/atribuir-professor.dto';
import { CriarTurmaDto } from './dto/criar-turma.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PapelUsuario } from '../auth/usuario.entity';
import { CurrentUsuario } from '../auth/current-usuario.decorator';
import { UsuarioAutenticado } from '../auth/jwt.strategy';

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

  @Get('minhas')
  @ApiOperation({ summary: 'Turmas formalmente atribuídas ao professor autenticado' })
  minhasTurmas(@CurrentUsuario() usuario: UsuarioAutenticado) {
    return this.turmasService.minhasTurmas(usuario.id);
  }

  @Post()
  @Roles(PapelUsuario.ADMIN)
  @ApiOperation({ summary: 'Cria uma turma (instrumento + horário), com professor opcional' })
  criar(@Body() dto: CriarTurmaDto) {
    return this.turmasService.criar(dto);
  }

  @Patch(':instrumento/:horario/professor')
  @Roles(PapelUsuario.ADMIN)
  @ApiOperation({ summary: 'Atribui o professor responsável por uma turma' })
  atribuirProfessor(
    @Param('instrumento') instrumento: string,
    @Param('horario') horario: string,
    @Body() dto: AtribuirProfessorDto,
  ) {
    return this.turmasService.atribuirProfessor(instrumento, horario, dto.professorId);
  }

  @Delete(':instrumento/:horario')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(PapelUsuario.ADMIN)
  @ApiOperation({ summary: 'Exclui uma turma (apenas se não houver aluno ativo nela)' })
  excluir(@Param('instrumento') instrumento: string, @Param('horario') horario: string) {
    return this.turmasService.excluirTurma(instrumento, horario);
  }

  @Get(':instrumento/:horario/alunos')
  @ApiOperation({ summary: 'Lista os alunos ativos de uma turma' })
  alunosDaTurma(@Param('instrumento') instrumento: string, @Param('horario') horario: string) {
    return this.turmasService.alunosDaTurma(instrumento, horario);
  }
}
