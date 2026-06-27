import { IsUUID } from 'class-validator';

export class AtribuirProfessorDto {
  @IsUUID()
  professorId: string;
}
