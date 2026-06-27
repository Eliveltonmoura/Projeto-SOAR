import api from './api';
import { PlanoAula } from '../types';

export interface SalvarPlanoAulaPayload {
  instrumento: string;
  horario: string;
  data: string;
  tema: string;
  objetivo: string;
  conteudo: string;
  materiais?: string;
}

export const planosAulaService = {
  salvar: (payload: SalvarPlanoAulaPayload) =>
    api.post<PlanoAula>('/planos-aula', payload).then((r) => r.data),

  listarPorTurma: (instrumento: string, horario: string) =>
    api
      .get<PlanoAula[]>('/planos-aula/turma', { params: { instrumento, horario } })
      .then((r) => r.data),
};
