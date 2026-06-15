import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { DoacoesService, CreateDoacaoDto } from './doacoes.service';
import { StatusDoacao } from './doacao.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { PapelUsuario } from '../auth/usuario.entity';
import * as path from 'path';

@ApiTags('Doações')
@Controller('doacoes')
export class DoacoesController {
  constructor(private readonly doacoesService: DoacoesService) {}

  @Post()
  @ApiOperation({ summary: 'HU-04 — Registrar doação com comprovante PIX' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('comprovante', {
      storage: diskStorage({
        destination: './uploads/comprovantes',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `pix-${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        // Aceita apenas imagens e PDF
        const allowed = /\.(jpg|jpeg|png|pdf)$/i;
        cb(null, allowed.test(file.originalname));
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
    }),
  )
  registrar(
    @Body() dto: CreateDoacaoDto,
    @UploadedFile() arquivo?: Express.Multer.File,
  ) {
    return this.doacoesService.registrar(dto, arquivo);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Lista todas as doações (painel de auditoria)' })
  findAll() {
    return this.doacoesService.findAll();
  }

  @Patch(':id/auditar')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(PapelUsuario.ADMIN, PapelUsuario.PROFESSOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Confirma ou rejeita um comprovante PIX' })
  auditar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: StatusDoacao; conferidoPor: string },
  ) {
    return this.doacoesService.auditar(id, body.status, body.conferidoPor);
  }
}
