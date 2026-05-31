import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';

// DTO de criação — valida os dados que chegam da requisição
export class CreateAlunoDto {
  @ApiProperty({ example: 'João da Silva' })
  @IsString()
  @IsNotEmpty()
  nomeCompleto: string;

  @ApiProperty({ example: '123.456.789-00' })
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'CPF inválido' })
  cpfResponsavel: string;

  @ApiProperty({ example: 'Maria da Silva' })
  @IsString()
  @IsNotEmpty()
  nomeResponsavel: string;

  @ApiProperty({ example: '(88) 99999-9999' })
  @IsString()
  @IsNotEmpty()
  telefoneResponsavel: string;

  @ApiPropertyOptional({ example: 'joao@email.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: '2015-03-20' })
  @IsDateString()
  dataNascimento: string;

  @ApiProperty({ description: 'Aceite do termo LGPD pelo responsável' })
  @IsBoolean()
  termoLgpdAssinado: boolean;

  @ApiPropertyOptional({ example: 'violão' })
  @IsString()
  @IsOptional()
  instrumentoDesejado?: string;

  @ApiPropertyOptional({ example: '16h' })
  @IsString()
  @IsOptional()
  horarioPreferencial?: string;
}

// DTO de resposta — o que a API retorna (nunca expõe dados sensíveis crus)
export class AlunoResponseDto {
  id: string;
  nomeCompleto: string;
  nomeResponsavel: string;
  telefoneResponsavel: string;
  email: string;
  dataNascimento: Date;
  status: string;
  posicaoFila: number;
  instrumentoDesejado: string;
  horarioPreferencial: string;
  criadoEm: Date;
  // cpfResponsavel NÃO é exposto aqui — proteção LGPD
}
