import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/aluno.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PapelUsuario } from '../auth/usuario.entity';
import { CurrentUsuario } from '../auth/current-usuario.decorator';
import { UsuarioAutenticado } from '../auth/jwt.strategy';

@ApiTags('Alunos')
@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'HU-01 — Matrícula online com trava LGPD' })
  @ApiResponse({ status: 201, description: 'Aluno matriculado ou adicionado à fila.' })
  @ApiResponse({ status: 400, description: 'Termo LGPD não aceito.' })
  @ApiResponse({ status: 409, description: 'CPF já cadastrado.' })
  matricular(@Body() dto: CreateAlunoDto) {
    return this.alunosService.matricular(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dados do aluno autenticado (portal do aluno)' })
  meuPerfil(@CurrentUsuario() usuario: UsuarioAutenticado) {
    if (!usuario.alunoId) {
      throw new NotFoundException('Esta conta não está vinculada a um aluno.');
    }
    return this.alunosService.findById(usuario.alunoId);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todos os alunos' })
  findAll() {
    return this.alunosService.findAll();
  }

  @Get('pendentes')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista matrículas pendentes de aprovação' })
  findPendentes() {
    return this.alunosService.findPendentes();
  }

  @Patch(':id/aprovar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Aprova uma matrícula pendente' })
  aprovar(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunosService.aprovar(id);
  }

  @Patch(':id/rejeitar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Rejeita uma matrícula pendente' })
  rejeitar(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunosService.rejeitar(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Busca aluno por ID' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunosService.findById(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Exclui um aluno, seu histórico de presença e conta de acesso' })
  excluir(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunosService.excluir(id);
  }
}
