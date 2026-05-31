import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { alunosService } from '../../services/alunos.service';
import { presencaService } from '../../services/presenca.service';
import { Aluno, RegistroPresenca } from '../../types';

export function PresencaScreen() {
  const [data, setData] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [registros, setRegistros] = useState<Record<string, boolean>>({});
  const [conteudo, setConteudo] = useState('');
  const [professor, setProfessor] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    alunosService.listar().then((lista) => {
      // Mostra apenas alunos ativos
      setAlunos(lista.filter((a) => a.status === 'ativo'));
    });
  }, []);

  // Carrega presenças já lançadas para a data selecionada
  useEffect(() => {
    if (!data) return;
    presencaService.porData(data).then((lista) => {
      const map: Record<string, boolean> = {};
      lista.forEach((r: RegistroPresenca) => { map[r.aluno.id] = r.presente; });
      setRegistros(map);
    });
  }, [data]);

  function togglePresenca(id: string) {
    setRegistros((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  async function salvar() {
    setErro('');
    setLoading(true);
    try {
      await Promise.all(
        alunos.map((a) =>
          presencaService.lancar({
            alunoId: a.id,
            data,
            presente: !!registros[a.id],
            conteudoAula: conteudo,
            professor,
          }),
        ),
      );
      setSucesso(true);
      setTimeout(() => setSucesso(false), 3000);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  const presentes = alunos.filter((a) => registros[a.id]).length;

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Diário de Presença</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Lançamento mobile. Retroativo permitido apenas até 1 dia atrás.
      </p>

      {/* Controles */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Data da Aula</label>
          <input type="date" value={data}
            onChange={(e) => setData(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Professor</label>
          <input value={professor} onChange={(e) => setProfessor(e.target.value)}
            placeholder="Nome do professor" style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Conteúdo da Aula (diário)</label>
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Descreva o conteúdo trabalhado na aula..."
          rows={3}
          style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
        />
      </div>

      {/* Contador */}
      <div style={{ background: '#eff6ff', borderRadius: 8, padding: '0.75rem 1rem',
        marginBottom: 16, fontSize: 14, color: '#1d4ed8' }}>
        <strong>{presentes}</strong> de <strong>{alunos.length}</strong> alunos presentes
      </div>

      {/* Lista de alunos — botões grandes para uso mobile */}
      <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        {alunos.map((aluno) => {
          const presente = !!registros[aluno.id];
          return (
            <button
              key={aluno.id}
              onClick={() => togglePresenca(aluno.id)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.875rem 1rem', borderRadius: 8, border: '2px solid',
                borderColor: presente ? '#6ee7b7' : '#e5e7eb',
                background: presente ? '#d1fae5' : '#fff',
                cursor: 'pointer', fontSize: 14, fontWeight: 500,
                transition: 'all 0.15s',
              }}
            >
              <span>{aluno.nomeCompleto}</span>
              <span style={{
                padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: 12, fontWeight: 700,
                background: presente ? '#059669' : '#9ca3af', color: '#fff',
              }}>
                {presente ? 'PRESENTE' : 'FALTA'}
              </span>
            </button>
          );
        })}
        {alunos.length === 0 && (
          <p style={{ color: '#9ca3af', fontSize: 14 }}>Nenhum aluno ativo cadastrado.</p>
        )}
      </div>

      {erro && (
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
          color: '#dc2626', fontSize: 14, marginBottom: 12 }}>
          {erro}
        </div>
      )}
      {sucesso && (
        <div style={{ background: '#d1fae5', borderRadius: 6, padding: '0.75rem',
          color: '#065f46', fontSize: 14, marginBottom: 12 }}>
          ✅ Presenças salvas com sucesso!
        </div>
      )}

      <button
        onClick={salvar}
        disabled={loading || alunos.length === 0}
        style={{
          width: '100%', padding: '0.875rem',
          background: loading ? '#9ca3af' : '#1a1a2e',
          color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'Salvando...' : 'Salvar Presenças'}
      </button>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4, fontWeight: 600,
};
const inputStyle: React.CSSProperties = {
  padding: '0.5rem 0.75rem', border: '1px solid #d1d5db',
  borderRadius: 6, fontSize: 14,
};
