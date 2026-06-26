import api from './api';
import { Doacao, RelatorioImpacto, StatusDoacao } from '../types';

export const doacoesService = {
  // Upload multipart (comprovante PIX)
  registrar: (formData: FormData) =>
    api
      .post<Doacao>('/doacoes', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  listar: () => api.get<Doacao[]>('/doacoes').then((r) => r.data),

  auditar: (id: string, status: StatusDoacao, conferidoPor: string) =>
    api
      .patch<Doacao>(`/doacoes/${id}/auditar`, { status, conferidoPor })
      .then((r) => r.data),

  // Abre o comprovante PIX em nova aba para visualização (requer autenticação)
  verComprovante: async (id: string) => {
    const resposta = await api.get(`/doacoes/${id}/comprovante`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(resposta.data);
    window.open(url, '_blank', 'noopener');
    setTimeout(() => window.URL.revokeObjectURL(url), 60_000);
  },
};

export const relatoriosService = {
  impactoSocial: () =>
    api.get<RelatorioImpacto>('/relatorios/impacto-social').then((r) => r.data),
};
