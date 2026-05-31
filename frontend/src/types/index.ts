// Espelha as entidades do back — mesma linguagem, mesmos tipos

export type StatusAluno = 'ativo' | 'aguardando' | 'inativo';
export type StatusDoacao = 'pendente' | 'confirmado' | 'rejeitado';

export interface Aluno {
  id: string;
  nomeCompleto: string;
  nomeResponsavel: string;
  telefoneResponsavel: string;
  email: string;
  dataNascimento: string;
  status: StatusAluno;
  posicaoFila: number | null;
  instrumentoDesejado: string;
  horarioPreferencial: string;
  criadoEm: string;
}

export interface CreateAlunoPayload {
  nomeCompleto: string;
  cpfResponsavel: string;
  nomeResponsavel: string;
  telefoneResponsavel: string;
  email?: string;
  dataNascimento: string;
  termoLgpdAssinado: boolean;
  instrumentoDesejado?: string;
  horarioPreferencial?: string;
}

export interface RegistroPresenca {
  id: string;
  aluno: Aluno;
  data: string;
  presente: boolean;
  conteudoAula?: string;
  professor?: string;
  observacoes?: string;
  lancadoEm: string;
}

export interface Doacao {
  id: string;
  nomeDoador: string;
  valor: number;
  mensagem?: string;
  status: StatusDoacao;
  comprovantePixOriginalName?: string;
  criadoEm: string;
}

export interface RelatorioImpacto {
  geradoEm: string;
  alunos: {
    total: number;
    ativos: number;
    naFila: number;
  };
  frequencia: {
    taxaMediaUltimos30Dias: string;
    totalRegistros: number;
  };
  financeiro: {
    totalDoacoesConfirmadas: number;
  };
}
