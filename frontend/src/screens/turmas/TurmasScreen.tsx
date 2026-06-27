import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { turmasService } from '../../services/turmas.service';
import { authService } from '../../services/auth.service';
import { Turma, Usuario } from '../../types';

export function TurmasScreen() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [professores, setProfessores] = useState<Usuario[]>([]);
  const [instrumento, setInstrumento] = useState('');
  const [professor, setProfessor] = useState('');
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [atribuindo, setAtribuindo] = useState<string | null>(null);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  const [novoInstrumento, setNovoInstrumento] = useState('');
  const [novoHorario, setNovoHorario] = useState('');
  const [novoProfessorId, setNovoProfessorId] = useState('');
  const [criando, setCriando] = useState(false);

  useEffect(() => {
    authService.listarProfessores().then(setProfessores).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    turmasService
      .listar({ instrumento: instrumento || undefined, professor: professor || undefined })
      .then(setTurmas)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, [instrumento, professor]);

  async function atribuirProfessor(turma: Turma, professorId: string) {
    setErro('');
    const chave = `${turma.instrumento}-${turma.horario}`;
    setAtribuindo(chave);
    try {
      const atualizada = await turmasService.atribuirProfessor(turma.instrumento, turma.horario, professorId);
      setTurmas((prev) => prev.map((t) => (t.instrumento === turma.instrumento && t.horario === turma.horario ? atualizada : t)));
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setAtribuindo(null);
    }
  }

  async function excluirTurma(turma: Turma) {
    if (!window.confirm(`Excluir a turma "${turma.nome}"?`)) return;
    setErro('');
    const chave = `${turma.instrumento}-${turma.horario}`;
    setExcluindo(chave);
    try {
      await turmasService.excluir(turma.instrumento, turma.horario);
      setTurmas((prev) => prev.filter((t) => !(t.instrumento === turma.instrumento && t.horario === turma.horario)));
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setExcluindo(null);
    }
  }

  async function criarTurma() {
    setErro('');
    setCriando(true);
    try {
      const nova = await turmasService.criar({
        instrumento: novoInstrumento,
        horario: novoHorario,
        professorId: novoProfessorId || undefined,
      });
      setTurmas((prev) => [...prev, nova].sort((a, b) => a.instrumento.localeCompare(b.instrumento) || a.horario.localeCompare(b.horario)));
      setNovoInstrumento('');
      setNovoHorario('');
      setNovoProfessorId('');
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCriando(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Turmas</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Turmas formadas a partir dos alunos ativos, agrupadas por instrumento e horário.
      </p>

      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
        padding: '1.25rem', marginBottom: 20, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
      }}>
        <div>
          <label style={labelStyle}>Instrumento</label>
          <select value={novoInstrumento} onChange={(e) => setNovoInstrumento(e.target.value)} style={inputStyle}>
            <option value="">Selecione...</option>
            <option value="violão">Violão</option>
            <option value="percussão">Percussão</option>
            <option value="acordeon">Acordeon</option>
            <option value="canto">Canto</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Horário</label>
          <select value={novoHorario} onChange={(e) => setNovoHorario(e.target.value)} style={inputStyle}>
            <option value="">Selecione...</option>
            <option value="16h">16h</option>
            <option value="17h">17h</option>
            <option value="18h">18h</option>
            <option value="19h">19h</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Professor (opcional)</label>
          <select value={novoProfessorId} onChange={(e) => setNovoProfessorId(e.target.value)} style={inputStyle}>
            <option value="">Selecione...</option>
            {professores.map((p) => (
              <option key={p.id} value={p.id}>{p.nome}</option>
            ))}
          </select>
        </div>
        <button
          onClick={criarTurma}
          disabled={criando || !novoInstrumento || !novoHorario}
          style={{
            padding: '0.55rem 1.25rem', borderRadius: 8, border: 'none',
            background: criando || !novoInstrumento || !novoHorario ? '#9ca3af' : '#1a1a2e', color: '#fff',
            fontSize: 14, fontWeight: 600,
            cursor: criando || !novoInstrumento || !novoHorario ? 'not-allowed' : 'pointer',
          }}
        >
          {criando ? 'Criando...' : 'Nova Turma'}
        </button>
      </div>

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
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.map((turma) => {
                const chave = `${turma.instrumento}-${turma.horario}`;
                return (
                  <tr key={chave} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{turma.nome}</td>
                    <td style={tdStyle}>
                      <select
                        value={turma.professorId ?? ''}
                        disabled={atribuindo === chave}
                        onChange={(e) => e.target.value && atribuirProfessor(turma, e.target.value)}
                        style={inputStyle}
                      >
                        <option value="">{turma.professor ?? 'Selecionar...'}</option>
                        {professores.map((p) => (
                          <option key={p.id} value={p.id}>{p.nome}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ ...tdStyle, textTransform: 'uppercase' }}>{turma.horario}</td>
                    <td style={tdStyle}>{turma.alunos}</td>
                    <td style={tdStyle}>{turma.vagas}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => excluirTurma(turma)}
                        disabled={excluindo === chave || turma.alunos > 0}
                        title={turma.alunos > 0 ? 'Só é possível excluir turmas sem alunos ativos' : 'Excluir turma'}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '0.35rem 0.7rem', borderRadius: 6, border: '1px solid #dc2626',
                          background: '#fff', color: turma.alunos > 0 ? '#fca5a5' : '#dc2626',
                          fontSize: 13, fontWeight: 600,
                          cursor: excluindo === chave || turma.alunos > 0 ? 'not-allowed' : 'pointer',
                          borderColor: turma.alunos > 0 ? '#fca5a5' : '#dc2626',
                        }}
                      >
                        <Trash2 size={14} /> Excluir
                      </button>
                    </td>
                  </tr>
                );
              })}
              {turmas.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
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
