import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class SalvarPlanoAulaDto {
  @IsString()
  instrumento: string;

  @IsString()
  horario: string;

  @IsDateString()
  data: string; // 'YYYY-MM-DD'

  @IsString()
  @MaxLength(150)
  tema: string;

  @IsString()
  objetivo: string;

  @IsString()
  conteudo: string;

  @IsOptional()
  @IsString()
  materiais?: string;
}
