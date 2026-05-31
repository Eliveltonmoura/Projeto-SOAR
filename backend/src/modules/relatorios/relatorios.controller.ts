import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { RelatoriosService } from './relatorios.service';

@ApiTags('Relatórios')
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('impacto-social')
  @ApiOperation({ summary: 'HU-05 — Dados de impacto social consolidados' })
  impactoSocial() {
    return this.relatoriosService.impactoSocial();
  }
}
