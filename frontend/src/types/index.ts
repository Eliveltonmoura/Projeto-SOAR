// Espelha as entidades do back — mesma linguagem, mesmos tipos

export type StatusAluno = 'pendente' | 'ativo' | 'aguardando' | 'rejeitado' | 'inativo';
export type StatusDoacao = 'pendente' | 'confirmado' | 'rejeitado';
export type PapelUsuario = 'admin' | 'professor' | 'aluno';

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
  faltas?: number;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  papel: PapelUsuario;
  alunoId?: string | null;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface LoginResponse {
  accessToken: string;
  usuario: Usuario;
}

export interface Turma {
  instrumento: string;
  horario: string;
  nome: string;
  professor: string | null;
  professorId: string | null;
  alunos: number;
  vagas: number;
}

export interface AlunoDaTurma {
  id: string;
  nomeCompleto: string;
}

export interface CreateAlunoPayload {
  nomeCompleto: string;
  cpfResponsavel: string;
  nomeResponsavel?: string;
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

export interface PlanoAula {
  id: string;
  instrumento: string;
  horario: string;
  data: string;
  tema: string;
  objetivo: string;
  conteudo: string;
  materiais?: string | null;
  professor?: string | null;
  criadoEm: string;
  atualizadoEm: string;
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
