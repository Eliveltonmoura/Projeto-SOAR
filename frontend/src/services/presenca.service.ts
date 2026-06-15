import api from './api';
import { RegistroPresenca } from '../types';

export interface LancarPresencaPayload {
  alunoId: string;
  data: string;
  presente: boolean;
  conteudoAula?: string;
  professor?: string;
  observacoes?: string;
}

export const presencaService = {
  lancar: (payload: LancarPresencaPayload) =>
    api.post<RegistroPresenca>('/presenca', payload).then((r) => r.data),

  porAluno: (alunoId: string) =>
    api.get<RegistroPresenca[]>(`/presenca/aluno?alunoId=${alunoId}`).then((r) => r.data),

  porData: (data: string) =>
    api.get<RegistroPresenca[]>(`/presenca/data?data=${data}`).then((r) => r.data),

  porTurma: (instrumento: string, horario: string, data: string) =>
    api
      .get<RegistroPresenca[]>('/presenca/turma', { params: { instrumento, horario, data } })
      .then((r) => r.data),
};
