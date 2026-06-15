import { useState, useEffect } from 'react';
import { turmasService } from '../../services/turmas.service';
import { Turma } from '../../types';

export function TurmasScreen() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [instrumento, setInstrumento] = useState('');
  const [professor, setProfessor] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    setLoading(true);
    turmasService
      .listar({ instrumento: instrumento || undefined, professor: professor || undefined })
      .then(setTurmas)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [instrumento, professor]);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Turmas</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Turmas formadas a partir dos alunos ativos, agrupadas por instrumento e horário.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Instrumento</label>
          <input
            value={instrumento}
            onChange={(e) => setInstrumento(e.target.value)}
            placeholder="Filtrar por instrumento"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Professor</label>
          <input
            value={professor}
            onChange={(e) => setProfessor(e.target.value)}
            placeholder="Filtrar por professor"
            style={inputStyle}
          />
        </div>
      </div>

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
                <th style={thStyle}>Turma</th>
                <th style={thStyle}>Professor</th>
                <th style={thStyle}>Horário</th>
                <th style={thStyle}>Alunos</th>
                <th style={thStyle}>Vagas</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => (
                <tr key={`${turma.instrumento}-${turma.horario}`} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{turma.nome}</td>
                  <td style={tdStyle}>{turma.professor ?? '—'}</td>
                  <td style={{ ...tdStyle, textTransform: 'uppercase' }}>{turma.horario}</td>
                  <td style={tdStyle}>{turma.alunos}</td>
                  <td style={tdStyle}>{turma.vagas}</td>
                </tr>
              ))}
              {turmas.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhuma turma encontrada.
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
const labelStyle: React.CSSProperties = {
  fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4, fontWeight: 600,
};
const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
  borderRadius: 6, fontSize: 14,
};
