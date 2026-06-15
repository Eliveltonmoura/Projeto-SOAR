import api from './api';
import { Aluno, CreateAlunoPayload } from '../types';

export const alunosService = {
  matricular: (payload: CreateAlunoPayload) =>
    api.post<Aluno>('/alunos', payload).then((r) => r.data),

  listar: () =>
    api.get<Aluno[]>('/alunos').then((r) => r.data),

  listarPendentes: () =>
    api.get<Aluno[]>('/alunos/pendentes').then((r) => r.data),

  aprovar: (id: string) =>
    api.patch<Aluno>(`/alunos/${id}/aprovar`).then((r) => r.data),

  rejeitar: (id: string) =>
    api.patch<Aluno>(`/alunos/${id}/rejeitar`).then((r) => r.data),

  buscarPorId: (id: string) =>
    api.get<Aluno>(`/alunos/${id}`).then((r) => r.data),

  meuPerfil: () =>
    api.get<Aluno>('/alunos/me').then((r) => r.data),
};
