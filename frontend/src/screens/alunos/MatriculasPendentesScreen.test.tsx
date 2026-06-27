import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MatriculasPendentesScreen } from './MatriculasPendentesScreen';
import { alunosService } from '../../services/alunos.service';

vi.mock('../../services/alunos.service', () => ({
  alunosService: {
    listarPendentes: vi.fn(),
    aprovar: vi.fn(),
    rejeitar: vi.fn(),
  },
}));

const ALUNO_PENDENTE = {
  id: 'aluno-1',
  nomeCompleto: 'Criança Teste',
  nomeResponsavel: 'Responsável Teste',
  telefoneResponsavel: '(88) 99999-0000',
  email: 'familia@teste.com',
  dataNascimento: '2015-03-20',
  status: 'pendente' as const,
  posicaoFila: null,
  instrumentoDesejado: 'violão',
  horarioPreferencial: '16h',
  criadoEm: '2026-06-20T10:00:00.000Z',
};

describe('MatriculasPendentesScreen', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('lista as matrículas pendentes vindas da API', async () => {
    (alunosService.listarPendentes as any).mockResolvedValue([ALUNO_PENDENTE]);

    render(<MatriculasPendentesScreen />);

    expect(await screen.findByText('Criança Teste')).toBeInTheDocument();
    expect(screen.getByText('Responsável Teste')).toBeInTheDocument();
  });

  it('mostra "Nenhuma matrícula pendente" quando a lista está vazia', async () => {
    (alunosService.listarPendentes as any).mockResolvedValue([]);

    render(<MatriculasPendentesScreen />);

    expect(await screen.findByText('Nenhuma matrícula pendente.')).toBeInTheDocument();
  });

  it('abre o modal de detalhes com os dados da matrícula e fecha ao clicar em Fechar', async () => {
    (alunosService.listarPendentes as any).mockResolvedValue([ALUNO_PENDENTE]);

    render(<MatriculasPendentesScreen />);
    await screen.findByText('Criança Teste');

    fireEvent.click(screen.getByTitle('Ver detalhes'));

    // e-mail só aparece no modal (a tabela não tem essa coluna)
    expect(screen.getByText('familia@teste.com')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Fechar'));
    await waitFor(() => expect(screen.queryByText('familia@teste.com')).not.toBeInTheDocument());
  });
});
