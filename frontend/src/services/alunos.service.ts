import api from './api';
import { Aluno, CreateAlunoPayload } from '../types';

export const alunosService = {
  matricular: (payload: CreateAlunoPayload) =>
    api.post<Aluno>('/alunos', payload).then((r) => r.data),

  listar: () =>
    api.get<Aluno[]>('/alunos').then((r) => r.data),

  buscarPorId: (id: string) =>
    api.get<Aluno>(`/alunos/${id}`).then((r) => r.data),
};
