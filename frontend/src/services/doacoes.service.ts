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
};

export const relatoriosService = {
  impactoSocial: () =>
    api.get<RelatorioImpacto>('/relatorios/impacto-social').then((r) => r.data),
};
