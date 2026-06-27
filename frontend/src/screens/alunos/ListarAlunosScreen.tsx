import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { alunosService } from '../../services/alunos.service';
import { Aluno } from '../../types';

export function ListarAlunosScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [excluindo, setExcluindo] = useState<string | null>(null);

  useEffect(() => {
    alunosService
      .listar()
      .then((lista) => setAlunos(lista.filter((a) => a.status === 'ativo')))
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function excluir(aluno: Aluno) {
    if (!window.confirm(`Excluir ${aluno.nomeCompleto}? Essa ação não pode ser desfeita.`)) return;
    setErro('');
    setExcluindo(aluno.id);
    try {
      await alunosService.excluir(aluno.id);
      setAlunos((prev) => prev.filter((a) => a.id !== aluno.id));
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Listar Alunos</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Alunos ativos matriculados no projeto.
      </p>

      {erro && (
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
          color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
          {erro}
        </div>
      )}

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Carregando...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>Quantidade de Faltas</th>
                <th style={thStyle}>Instrumento</th>
                <th style={thStyle}>Horário</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{aluno.nomeCompleto}</td>
                  <td style={tdStyle}>{aluno.faltas ?? 0}</td>
                  <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{aluno.instrumentoDesejado}</td>
                  <td style={{ ...tdStyle, textTransform: 'uppercase' }}>{aluno.horarioPreferencial}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => excluir(aluno)}
                      disabled={excluindo === aluno.id}
                      title="Excluir aluno"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        padding: '0.35rem 0.7rem', borderRadius: 6, border: '1px solid #dc2626',
                        background: '#fff', color: '#dc2626', fontSize: 13, fontWeight: 600,
                        cursor: excluindo === aluno.id ? 'not-allowed' : 'pointer',
                      }}
                    >
                      <Trash2 size={14} /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
              {alunos.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhum aluno ativo encontrado.
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
