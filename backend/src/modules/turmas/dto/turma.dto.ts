export class TurmaResumoDto {
  instrumento: string;
  horario: string;
  nome: string; // ex: "Turma Violão 15H"
  professor: string | null;
  professorId: string | null;
  alunos: number;
  vagas: number;
}

export class AlunoDaTurmaDto {
  id: string;
  nomeCompleto: string;
}
