import api from './api';
import { AlunoDaTurma, Turma } from '../types';

export interface FiltrosTurma {
  instrumento?: string;
  professor?: string;
}

export interface CriarTurmaPayload {
  instrumento: string;
  horario: string;
  professorId?: string;
}

export const turmasService = {
  listar: (filtros: FiltrosTurma = {}) =>
    api.get<Turma[]>('/turmas', { params: filtros }).then((r) => r.data),

  criar: (payload: CriarTurmaPayload) =>
    api.post<Turma>('/turmas', payload).then((r) => r.data),

  excluir: (instrumento: string, horario: string) =>
    api.delete(`/turmas/${instrumento}/${horario}`).then(() => undefined),

  minhas: () =>
    api.get<Turma[]>('/turmas/minhas').then((r) => r.data),

  atribuirProfessor: (instrumento: string, horario: string, professorId: string) =>
    api
      .patch<Turma>(`/turmas/${instrumento}/${horario}/professor`, { professorId })
      .then((r) => r.data),

  alunosDaTurma: (instrumento: string, horario: string) =>
    api.get<AlunoDaTurma[]>(`/turmas/${instrumento}/${horario}/alunos`).then((r) => r.data),
};
