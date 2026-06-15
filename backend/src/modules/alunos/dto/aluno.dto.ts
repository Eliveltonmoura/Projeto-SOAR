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
  ValidateIf,
} from 'class-validator';
import { isMenorDeIdade } from '../idade.util';

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

  @ApiPropertyOptional({
    example: 'Maria da Silva',
    description: 'Obrigatório apenas se o aluno for menor de 18 anos. Para alunos maiores, o próprio aluno é o responsável.',
  })
  @ValidateIf((o: CreateAlunoDto) => isMenorDeIdade(o.dataNascimento))
  @IsNotEmpty({ message: 'Nome do responsável é obrigatório para alunos menores de 18 anos.' })
  nomeResponsavel?: string;

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
  faltas?: number; // total de presenças lançadas como ausente
  // cpfResponsavel NÃO é exposto aqui — proteção LGPD
}
