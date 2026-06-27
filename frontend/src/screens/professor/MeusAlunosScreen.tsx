import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { turmasService } from '../../services/turmas.service';
import { AlunoDaTurma } from '../../types';

export function MeusAlunosScreen() {
  const { instrumento = '', horario = '' } = useParams();
  const navigate = useNavigate();
  const [alunos, setAlunos] = useState<AlunoDaTurma[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    turmasService
      .alunosDaTurma(instrumento, horario)
      .then(setAlunos)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [instrumento, horario]);

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: '#6b7280', cursor: 'pointer', fontSize: 13, marginBottom: 12, padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Voltar
      </button>

      <h1 style={{ fontSize: 22, marginBottom: 4 }}>
        Turma {instrumento} {horario.toUpperCase()}
      </h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>Alunos ativos nesta turma.</p>

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
                <th style={thStyle}>Aluno</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{aluno.nomeCompleto}</td>
                </tr>
              ))}
              {alunos.length === 0 && (
                <tr>
                  <td style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhum aluno nesta turma.
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
