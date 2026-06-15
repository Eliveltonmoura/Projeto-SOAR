import api from './api';
import { LoginPayload, LoginResponse, Usuario } from '../types';

export const authService = {
  login: (payload: LoginPayload) =>
    api.post<LoginResponse>('/auth/login', payload).then((r) => r.data),

  me: () => api.get<Usuario>('/auth/me').then((r) => r.data),
};
