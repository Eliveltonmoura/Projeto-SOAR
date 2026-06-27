import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { authService } from './auth.service';

vi.mock('./api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login chama POST /auth/login com e-mail e senha', async () => {
    (api.post as any).mockResolvedValue({ data: { accessToken: 'tok', usuario: {} } });
    await authService.login({ email: 'a@a.com', senha: '123456' });
    expect(api.post).toHaveBeenCalledWith('/auth/login', { email: 'a@a.com', senha: '123456' });
  });

  it('listarProfessores chama GET /auth/professores', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    await authService.listarProfessores();
    expect(api.get).toHaveBeenCalledWith('/auth/professores');
  });

  it('criarProfessor chama POST /auth/professores com o payload', async () => {
    (api.post as any).mockResolvedValue({ data: {} });
    const payload = { nome: 'Prof', email: 'prof@x.com', senha: 'senha123' };
    await authService.criarProfessor(payload);
    expect(api.post).toHaveBeenCalledWith('/auth/professores', payload);
  });
});
