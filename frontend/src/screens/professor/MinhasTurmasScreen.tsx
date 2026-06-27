import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ClipboardSignature, ClipboardCheck } from 'lucide-react';
import { turmasService } from '../../services/turmas.service';
import { Turma } from '../../types';

export function MinhasTurmasScreen() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    turmasService
      .minhas()
      .then(setTurmas)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Minhas Turmas</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Turmas atribuídas a você pelo administrador.
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {turmas.map((turma) => (
            <div
              key={`${turma.instrumento}-${turma.horario}`}
              style={{
                padding: '1.25rem', borderRadius: 12,
                border: '1px solid #e5e7eb', background: '#fff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                {turma.nome}
              </div>
              <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
                {turma.alunos} aluno(s) · {turma.vagas} vaga(s)
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => navigate(`/professor/${encodeURIComponent(turma.instrumento)}/${encodeURIComponent(turma.horario)}`)}
                  style={btnStyle}
                >
                  <Users size={14} /> Meus Alunos
                </button>
                <button
                  onClick={() => navigate(`/professor/${encodeURIComponent(turma.instrumento)}/${encodeURIComponent(turma.horario)}/frequencia`)}
                  style={btnStyle}
                >
                  <ClipboardCheck size={14} /> Fazer Chamada
                </button>
                <button
                  onClick={() => navigate(`/professor/${encodeURIComponent(turma.instrumento)}/${encodeURIComponent(turma.horario)}/plano-aula`)}
                  style={btnStyle}
                >
                  <ClipboardSignature size={14} /> Plano de Aula
                </button>
              </div>
            </div>
          ))}
          {turmas.length === 0 && (
            <p style={{ color: '#9ca3af', fontSize: 14 }}>
              Nenhuma turma atribuída a você ainda. Fale com o administrador.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '0.45rem 0.8rem', borderRadius: 6, border: '1px solid #d1d5db',
  background: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#1a1a2e',
};
