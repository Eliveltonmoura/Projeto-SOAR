import { useState, useEffect } from 'react';
import { alunosService } from '../../services/alunos.service';
import { Aluno } from '../../types';

export function FilaEsperaScreen() {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    alunosService
      .listar()
      .then((lista) => setAlunos(
        lista
          .filter((a) => a.status === 'aguardando')
          .sort((a, b) => (a.posicaoFila ?? 0) - (b.posicaoFila ?? 0)),
      ))
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Fila de Espera</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Alunos aguardando vaga, em ordem de posição.
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
                <th style={thStyle}>Instrumento</th>
                <th style={thStyle}>Horário</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{aluno.nomeCompleto}</td>
                  <td style={{ ...tdStyle, textTransform: 'capitalize' }}>{aluno.instrumentoDesejado}</td>
                  <td style={{ ...tdStyle, textTransform: 'uppercase' }}>{aluno.horarioPreferencial}</td>
                </tr>
              ))}
              {alunos.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhum aluno na fila de espera.
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
