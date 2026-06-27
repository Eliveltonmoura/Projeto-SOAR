import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { planosAulaService } from './planos-aula.service';

vi.mock('./api', () => ({
  default: { get: vi.fn(), post: vi.fn() },
}));

describe('planosAulaService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('salvar chama POST /planos-aula com o payload', async () => {
    (api.post as any).mockResolvedValue({ data: {} });
    const payload = { instrumento: 'violão', horario: '16h', data: '2026-06-27', tema: 'X', objetivo: 'Y', conteudo: 'Z' };
    await planosAulaService.salvar(payload);
    expect(api.post).toHaveBeenCalledWith('/planos-aula', payload);
  });

  it('listarPorTurma chama GET /planos-aula/turma com instrumento e horário', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    await planosAulaService.listarPorTurma('violão', '16h');
    expect(api.get).toHaveBeenCalledWith('/planos-aula/turma', { params: { instrumento: 'violão', horario: '16h' } });
  });
});
