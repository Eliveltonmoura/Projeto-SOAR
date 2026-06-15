import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { turmasService } from '../../services/turmas.service';
import { presencaService } from '../../services/presenca.service';
import { AlunoDaTurma, RegistroPresenca, Turma } from '../../types';

export function ChamadaScreen() {
  const { instrumento = '', horario = '' } = useParams();
  const navigate = useNavigate();

  const [turma, setTurma] = useState<Turma | null>(null);
  const [alunos, setAlunos] = useState<AlunoDaTurma[]>([]);
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [registros, setRegistros] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    Promise.all([
      turmasService.listar({ instrumento }),
      turmasService.alunosDaTurma(instrumento, horario),
    ])
      .then(([turmas, alunosDaTurma]) => {
        setTurma(turmas.find((t) => t.horario === horario) ?? null);
        setAlunos(alunosDaTurma);
      })
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [instrumento, horario]);

  useEffect(() => {
    if (!data) return;
    presencaService.porTurma(instrumento, horario, data).then((lista) => {
      const map: Record<string, boolean> = {};
      lista.forEach((r: RegistroPresenca) => { map[r.aluno.id] = r.presente; });
      setRegistros(map);
    });
  }, [instrumento, horario, data]);

  function marcar(alunoId: string, presente: boolean) {
    setRegistros((prev) => ({ ...prev, [alunoId]: presente }));
  }

  async function salvar() {
    setErro('');
    setSalvando(true);
    try {
      await Promise.all(
        alunos.map((aluno) =>
          presencaService.lancar({
            alunoId: aluno.id,
            data,
            presente: !!registros[aluno.id],
            professor: turma?.professor ?? undefined,
          }),
        ),
      );
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate('/frequencia')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none',
          color: '#6b7280', cursor: 'pointer', fontSize: 13, marginBottom: 12, padding: 0,
        }}
      >
        <ArrowLeft size={14} /> Voltar para turmas
      </button>

      <h1 style={{ fontSize: 22, marginBottom: 4 }}>
        {turma?.nome ?? `Turma ${instrumento} ${horario.toUpperCase()}`}
      </h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 20 }}>
        Professor: {turma?.professor ?? '—'}
      </p>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Data da Aula</label>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={inputStyle} />
      </div>

      {erro && (
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
          color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
          {erro}
        </div>
      )}
      {sucesso && (
        <div style={{ background: '#d1fae5', borderRadius: 6, padding: '0.75rem',
          color: '#065f46', fontSize: 14, marginBottom: 16 }}>
          ✅ Presenças salvas com sucesso!
        </div>
      )}

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Carregando...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: 20 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={thStyle}>Aluno</th>
                <th style={{ ...thStyle, textAlign: 'center', width: 80 }}>F</th>
                <th style={{ ...thStyle, textAlign: 'center', width: 80 }}>P</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => {
                const presente = registros[aluno.id];
                return (
                  <tr key={aluno.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{aluno.nomeCompleto}</td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <input
                        type="radio"
                        name={`presenca-${aluno.id}`}
                        checked={presente === false}
                        onChange={() => marcar(aluno.id, false)}
                      />
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'center' }}>
                      <input
                        type="radio"
                        name={`presenca-${aluno.id}`}
                        checked={presente === true}
                        onChange={() => marcar(aluno.id, true)}
                      />
                    </td>
                  </tr>
                );
              })}
              {alunos.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhum aluno nesta turma.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={salvar}
        disabled={salvando || alunos.length === 0}
        style={{
          padding: '0.75rem 1.5rem',
          background: salvando ? '#9ca3af' : '#1a1a2e',
          color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 15, fontWeight: 600, cursor: salvando ? 'not-allowed' : 'pointer',
        }}
      >
        {salvando ? 'Salvando...' : 'Salvar Presenças'}
      </button>
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
