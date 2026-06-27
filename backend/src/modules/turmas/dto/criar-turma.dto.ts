import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CriarTurmaDto {
  @IsString()
  instrumento: string;

  @IsString()
  horario: string;

  @IsOptional()
  @IsUUID()
  professorId?: string;
}
