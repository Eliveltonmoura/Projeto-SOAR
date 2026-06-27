import api from './api';
import { LoginPayload, LoginResponse, Usuario } from '../types';

export interface CriarProfessorPayload {
  nome: string;
  email: string;
  senha: string;
}

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  me: () => api.get<Usuario>('/auth/me').then((r) => r.data),

  listarProfessores: () =>
    api.get<Usuario[]>('/auth/professores').then((r) => r.data),

  criarProfessor: (payload: CriarProfessorPayload) =>
    api.post<Usuario>('/auth/professores', payload).then((r) => r.data),
};
