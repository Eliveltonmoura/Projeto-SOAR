import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { turmasService } from '../../services/turmas.service';
import { Turma } from '../../types';

export function TurmasFrequenciaScreen() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    turmasService
      .listar()
      .then(setTurmas)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Frequência</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Selecione uma turma para fazer a chamada.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {turmas.map((turma) => (
            <button
              key={`${turma.instrumento}-${turma.horario}`}
              onClick={() => navigate(`/frequencia/${encodeURIComponent(turma.instrumento)}/${encodeURIComponent(turma.horario)}`)}
              style={{
                textAlign: 'left', padding: '1.25rem', borderRadius: 12,
                border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                {turma.nome}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                Professor: {turma.professor ?? '—'}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>
                {turma.alunos} aluno(s)
              </div>
            </button>
          ))}
          {turmas.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>Nenhuma turma encontrada.</p>
          )}
        </div>
      )}
    </div>
  );
}
