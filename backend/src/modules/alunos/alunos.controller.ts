import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AlunosService } from './alunos.service';
import { CreateAlunoDto } from './dto/aluno.dto';

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

  @Get()
  @ApiOperation({ summary: 'Lista todos os alunos' })
  findAll() {
    return this.alunosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca aluno por ID' })
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.alunosService.findById(id);
  }
}
