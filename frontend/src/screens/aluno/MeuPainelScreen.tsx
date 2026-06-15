import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { CheckCircle2, XCircle } from 'lucide-react';
import { alunosService } from '../../services/alunos.service';
import { presencaService } from '../../services/presenca.service';
import { Aluno, RegistroPresenca } from '../../types';

const STATUS_LABELS: Record<string, string> = {
  ativo: 'Ativo',
  aguardando: 'Na fila de espera',
  pendente: 'Em análise',
  rejeitado: 'Rejeitado',
  inativo: 'Inativo',
};

export function MeuPainelScreen() {
  const [aluno, setAluno] = useState<Aluno | null>(null);
  const [presencas, setPresencas] = useState<RegistroPresenca[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    alunosService
      .meuPerfil()
      .then((dados) => {
        setAluno(dados);
        return presencaService.porAluno(dados.id);
      })
      .then(setPresencas)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: '#9ca3af', fontSize: 14 }}>Carregando...</p>;
  }

  if (erro) {
    return (
      <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
        color: '#dc2626', fontSize: 14 }}>
        {erro}
      </div>
    );
  }

  if (!aluno) return null;

  const totalFaltas = presencas.filter((p) => !p.presente).length;

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Meu Painel</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Olá, {aluno.nomeCompleto}! Confira abaixo seus dados e sua frequência.
      </p>

      <div style={{
        background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
        padding: '1.25rem 1.5rem', marginBottom: 24,
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16,
      }}>
        <Info label="Status" value={STATUS_LABELS[aluno.status] ?? aluno.status} />
        <Info label="Instrumento" value={aluno.instrumentoDesejado || '—'} capitalize />
        <Info label="Horário" value={aluno.horarioPreferencial || '—'} uppercase />
        {aluno.status === 'aguardando' && aluno.posicaoFila != null && (
          <Info label="Posição na fila" value={`${aluno.posicaoFila}º`} />
        )}
        <Info label="Total de faltas" value={String(totalFaltas)} />
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 12 }}>Histórico de Frequência</h2>

      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Presença</th>
              <th style={thStyle}>Conteúdo da Aula</th>
            </tr>
          </thead>
          <tbody>
            {presencas
              .slice()
              .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
              .map((p) => (
                <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{format(new Date(p.data), 'dd/MM/yyyy')}</td>
                  <td style={tdStyle}>
                    {p.presente ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#059669', fontWeight: 600 }}>
                        <CheckCircle2 size={14} /> Presente
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#dc2626', fontWeight: 600 }}>
                        <XCircle size={14} /> Falta
                      </span>
                    )}
                  </td>
                  <td style={tdStyle}>{p.conteudoAula || '—'}</td>
                </tr>
              ))}
            {presencas.length === 0 && (
              <tr>
                <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                  Nenhum registro de frequência ainda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Info({ label, value, capitalize, uppercase }: { label: string; value: string; capitalize?: boolean; uppercase?: boolean }) {
  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 15, fontWeight: 600, textTransform: capitalize ? 'capitalize' : uppercase ? 'uppercase' : 'none' }}>
        {value}
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.75rem 1rem', fontSize: 12, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase',
};
const tdStyle: React.CSSProperties = {
  padding: '0.75rem 1rem',
};
