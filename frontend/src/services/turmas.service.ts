import api from './api';
import { AlunoDaTurma, Turma } from '../types';

export interface FiltrosTurma {
  instrumento?: string;
  professor?: string;
}

export const turmasService = {
  listar: (filtros: FiltrosTurma = {}) =>
    api.get<Turma[]>('/turmas', { params: filtros }).then((r) => r.data),

  alunosDaTurma: (instrumento: string, horario: string) =>
    api.get<AlunoDaTurma[]>(`/turmas/${instrumento}/${horario}/alunos`).then((r) => r.data),
};
