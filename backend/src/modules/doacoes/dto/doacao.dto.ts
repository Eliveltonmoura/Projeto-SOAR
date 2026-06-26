import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  Min,
} from 'class-validator';

// Dados chegam via multipart/form-data (upload do comprovante PIX junto)
export class CreateDoacaoDto {
  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @IsNotEmpty()
  nomeDoador: string;

  @ApiPropertyOptional({ example: '123.456.789-00', description: 'Opcional — LGPD' })
  @IsString()
  @IsOptional()
  cpfDoador?: string;

  @ApiPropertyOptional({ example: 'maria@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  valor: number;

  @ApiPropertyOptional({ example: 'Apoio ao Instituto Carrascal!' })
  @IsString()
  @IsOptional()
  mensagem?: string;
}
