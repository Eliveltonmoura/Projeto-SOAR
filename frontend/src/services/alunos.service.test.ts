import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { alunosService } from './alunos.service';

vi.mock('./api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

describe('alunosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listarPendentes chama GET /alunos/pendentes', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    await alunosService.listarPendentes();
    expect(api.get).toHaveBeenCalledWith('/alunos/pendentes');
  });

  it('aprovar chama PATCH na rota de aprovar', async () => {
    (api.patch as any).mockResolvedValue({ data: {} });
    await alunosService.aprovar('aluno-1');
    expect(api.patch).toHaveBeenCalledWith('/alunos/aluno-1/aprovar');
  });

  it('rejeitar chama PATCH na rota de rejeitar', async () => {
    (api.patch as any).mockResolvedValue({ data: {} });
    await alunosService.rejeitar('aluno-1');
    expect(api.patch).toHaveBeenCalledWith('/alunos/aluno-1/rejeitar');
  });

  it('excluir chama DELETE na rota do aluno', async () => {
    (api.delete as any).mockResolvedValue({});
    await alunosService.excluir('aluno-1');
    expect(api.delete).toHaveBeenCalledWith('/alunos/aluno-1');
  });
});
