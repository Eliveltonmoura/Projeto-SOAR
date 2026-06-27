import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft } from 'lucide-react';
import { turmasService } from '../../services/turmas.service';
import { planosAulaService } from '../../services/planos-aula.service';
import { PlanoAula, Turma } from '../../types';

const FORM_VAZIO = { tema: '', objetivo: '', conteudo: '', materiais: '' };

export function PlanoAulaScreen() {
  const { instrumento = '', horario = '' } = useParams();
  const navigate = useNavigate();

  const [turma, setTurma] = useState<Turma | null>(null);
  const [historico, setHistorico] = useState<PlanoAula[]>([]);
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [form, setForm] = useState(FORM_VAZIO);
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    Promise.all([
      turmasService.listar({ instrumento }),
      planosAulaService.listarPorTurma(instrumento, horario),
    ])
      .then(([turmas, planos]) => {
        setTurma(turmas.find((t) => t.horario === horario) ?? null);
        setHistorico(planos);
      })
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [instrumento, horario]);

  // Se já existe plano para a data escolhida, carrega pra edição em vez de criar duplicado
  useEffect(() => {
    const existente = historico.find((p) => p.data === data);
    setForm(
      existente
        ? {
            tema: existente.tema,
            objetivo: existente.objetivo,
            conteudo: existente.conteudo,
            materiais: existente.materiais ?? '',
          }
        : FORM_VAZIO,
    );
  }, [data, historico]);

  async function salvar() {
    setErro('');
    setSalvando(true);
    try {
      const salvo = await planosAulaService.salvar({
        instrumento,
        horario,
        data,
        tema: form.tema,
        objetivo: form.objetivo,
        conteudo: form.conteudo,
        materiais: form.materiais || undefined,
      });
      setHistorico((prev) => [salvo, ...prev.filter((p) => p.data !== salvo.data)]);
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
        onClick={() => navigate(-1)}
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

      {erro && (
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
          color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
          {erro}
        </div>
      )}
      {sucesso && (
        <div style={{ background: '#d1fae5', borderRadius: 6, padding: '0.75rem',
          color: '#065f46', fontSize: 14, marginBottom: 16 }}>
          ✅ Plano de aula salvo com sucesso!
        </div>
      )}

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Carregando...</p>
      ) : (
        <>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: 24 }}>
            <div style={{ marginBottom: 16, maxWidth: 220 }}>
              <label style={labelStyle}>Data da Aula</label>
              <input type="date" value={data} onChange={(e) => setData(e.target.value)} style={inputStyle} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Tema</label>
              <input
                value={form.tema}
                onChange={(e) => setForm((f) => ({ ...f, tema: e.target.value }))}
                placeholder="Ex: Escalas maiores e ritmo binário"
                style={{ ...inputStyle, width: '100%' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Objetivo</label>
              <textarea
                value={form.objetivo}
                onChange={(e) => setForm((f) => ({ ...f, objetivo: e.target.value }))}
                placeholder="O que os alunos devem aprender nesta aula"
                style={{ ...inputStyle, width: '100%', minHeight: 70, resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Conteúdo / Desenvolvimento</label>
              <textarea
                value={form.conteudo}
                onChange={(e) => setForm((f) => ({ ...f, conteudo: e.target.value }))}
                placeholder="Como a aula será conduzida"
                style={{ ...inputStyle, width: '100%', minHeight: 100, resize: 'vertical' }}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Materiais (opcional)</label>
              <input
                value={form.materiais}
                onChange={(e) => setForm((f) => ({ ...f, materiais: e.target.value }))}
                placeholder="Ex: Partituras, metrônomo, instrumento próprio"
                style={{ ...inputStyle, width: '100%' }}
              />
            </div>

            <button
              onClick={salvar}
              disabled={salvando || !form.tema || !form.objetivo || !form.conteudo}
              style={{
                padding: '0.75rem 1.5rem',
                background: salvando ? '#9ca3af' : '#1a1a2e',
                color: '#fff', border: 'none', borderRadius: 8,
                fontSize: 15, fontWeight: 600,
                cursor: salvando ? 'not-allowed' : 'pointer',
              }}
            >
              {salvando ? 'Salvando...' : 'Salvar Plano de Aula'}
            </button>
          </div>

          <h2 style={{ fontSize: 16, marginBottom: 12 }}>Histórico</h2>
          <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Tema</th>
                  <th style={thStyle}>Professor</th>
                </tr>
              </thead>
              <tbody>
                {historico.map((plano) => (
                  <tr key={plano.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{format(new Date(plano.data), 'dd/MM/yyyy')}</td>
                    <td style={tdStyle}>{plano.tema}</td>
                    <td style={tdStyle}>{plano.professor ?? '—'}</td>
                  </tr>
                ))}
                {historico.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                      Nenhum plano de aula registrado ainda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
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
  borderRadius: 6, fontSize: 14, fontFamily: 'inherit',
};
