import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Check, X } from 'lucide-react';
import { alunosService } from '../../services/alunos.service';
import { Aluno } from '../../types';

export function MatriculasPendentesScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [processando, setProcessando] = useState<string | null>(null);

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    setLoading(true);
    alunosService
      .listarPendentes()
      .then(setAlunos)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }

  async function aprovar(id: string) {
    setErro('');
    setMensagem('');
    setProcessando(id);
    try {
      const resultado = await alunosService.aprovar(id);
      setAlunos((prev) => prev.filter((a) => a.id !== id));
      if (resultado.status === 'aguardando') {
        setMensagem(
          `${resultado.nomeCompleto} foi aprovado, mas as vagas para ${resultado.horarioPreferencial} estão cheias — ` +
          `entrou na fila de espera na posição ${resultado.posicaoFila}º.`,
        );
      } else {
        setMensagem(`${resultado.nomeCompleto} foi aprovado e matriculado (ativo).`);
      }
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setProcessando(null);
    }
  }

  async function rejeitar(id: string) {
    setErro('');
    setMensagem('');
    setProcessando(id);
    try {
      const resultado = await alunosService.rejeitar(id);
      setAlunos((prev) => prev.filter((a) => a.id !== id));
      setMensagem(`A matrícula de ${resultado.nomeCompleto} foi rejeitada.`);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setProcessando(null);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Matrículas Pendentes</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Avalie as novas matrículas recebidas pelo formulário de cadastro.
      </p>

      {erro && (
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
          color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
          {erro}
        </div>
      )}

      {mensagem && (
        <div style={{ background: '#d1fae5', borderRadius: 6, padding: '0.75rem',
          color: '#065f46', fontSize: 14, marginBottom: 16 }}>
          {mensagem}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Carregando...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={thStyle}>Aluno</th>
                <th style={thStyle}>Responsável</th>
                <th style={thStyle}>Telefone</th>
                <th style={thStyle}>Instrumento</th>
                <th style={thStyle}>Horário</th>
                <th style={thStyle}>Recebido em</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{aluno.nomeCompleto}</td>
                  <td style={tdStyle}>{aluno.nomeResponsavel}</td>
                  <td style={tdStyle}>{aluno.telefoneResponsavel}</td>
                  <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{aluno.instrumentoDesejado ?? '—'}</td>
                  <td style={{ ...tdStyle, textTransform: 'uppercase' }}>{aluno.horarioPreferencial ?? '—'}</td>
                  <td style={tdStyle}>{format(new Date(aluno.criadoEm), 'dd/MM/yyyy')}</td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => aprovar(aluno.id)}
                        disabled={processando === aluno.id}
                        title="Aceitar"
                        style={{ ...btnStyle, color: '#059669', borderColor: '#059669' }}
                      >
                        <Check size={14} /> Aceitar
                      </button>
                      <button
                        onClick={() => rejeitar(aluno.id)}
                        disabled={processando === aluno.id}
                        title="Rejeitar"
                        style={{ ...btnStyle, color: '#dc2626', borderColor: '#dc2626' }}
                      >
                        <X size={14} /> Rejeitar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {alunos.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhuma matrícula pendente.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
};
const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
};
const btnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 4,
  padding: '0.35rem 0.7rem', borderRadius: 6, border: '1px solid',
  background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
};
