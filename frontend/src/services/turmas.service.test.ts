import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';
import { turmasService } from './turmas.service';

vi.mock('./api', () => ({
  default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() },
}));

describe('turmasService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('listar chama GET /turmas com os filtros como params', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    await turmasService.listar({ instrumento: 'violão' });
    expect(api.get).toHaveBeenCalledWith('/turmas', { params: { instrumento: 'violão' } });
  });

  it('criar chama POST /turmas com o payload', async () => {
    (api.post as any).mockResolvedValue({ data: {} });
    await turmasService.criar({ instrumento: 'canto', horario: '19h', professorId: 'p1' });
    expect(api.post).toHaveBeenCalledWith('/turmas', { instrumento: 'canto', horario: '19h', professorId: 'p1' });
  });

  it('minhas chama GET /turmas/minhas', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    await turmasService.minhas();
    expect(api.get).toHaveBeenCalledWith('/turmas/minhas');
  });

  it('atribuirProfessor chama PATCH na rota da turma com o professorId', async () => {
    (api.patch as any).mockResolvedValue({ data: {} });
    await turmasService.atribuirProfessor('violão', '16h', 'prof-1');
    expect(api.patch).toHaveBeenCalledWith('/turmas/violão/16h/professor', { professorId: 'prof-1' });
  });

  it('alunosDaTurma chama GET na rota de alunos da turma', async () => {
    (api.get as any).mockResolvedValue({ data: [] });
    await turmasService.alunosDaTurma('violão', '16h');
    expect(api.get).toHaveBeenCalledWith('/turmas/violão/16h/alunos');
  });

  it('excluir chama DELETE na rota da turma', async () => {
    (api.delete as any).mockResolvedValue({});
    await turmasService.excluir('violão', '16h');
    expect(api.delete).toHaveBeenCalledWith('/turmas/violão/16h');
  });
});
