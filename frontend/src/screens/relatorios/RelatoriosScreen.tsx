import { useState, useEffect } from 'react';
import { relatoriosService } from '../../services/doacoes.service';
import { RelatorioImpacto } from '../../types';
import { Users, TrendingUp, Heart, Calendar } from 'lucide-react';

export function RelatoriosScreen() {
  const [dados, setDados] = useState<RelatorioImpacto | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    relatoriosService
      .impactoSocial()
      .then(setDados)
      .catch((e) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p style={{ color: '#9ca3af' }}>Carregando dados de impacto...</p>;
  }
  if (erro) {
    return <p style={{ color: '#dc2626' }}>Erro: {erro}</p>;
  }
  if (!dados) return null;

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Relatório de Impacto Social</h1>
      <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
        Gerado em {new Date(dados.geradoEm).toLocaleString('pt-BR')}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <Card
          icon={<Users size={20} />}
          cor="#3b82f6"
          titulo="Total de Alunos"
          valor={dados.alunos.total}
          descricao={`${dados.alunos.ativos} ativos · ${dados.alunos.naFila} na fila`}
        />
        <Card
          icon={<TrendingUp size={20} />}
          cor="#8b5cf6"
          titulo="Taxa de Presença"
          valor={dados.frequencia.taxaMediaUltimos30Dias}
          descricao={`${dados.frequencia.totalRegistros} registros (30 dias)`}
        />
        <Card
          icon={<Heart size={20} />}
          cor="#059669"
          titulo="Doações Confirmadas"
          valor={`R$ ${Number(dados.financeiro.totalDoacoesConfirmadas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
          descricao="Total arrecadado e auditado"
        />
        <Card
          icon={<Calendar size={20} />}
          cor="#f59e0b"
          titulo="Horários"
          valor="16h – 19h"
          descricao="Oficinas gratuitas diárias"
        />
      </div>

      <div style={{ marginTop: 32, background: '#fff', borderRadius: 10,
        border: '1px solid #e5e7eb', padding: '1.5rem' }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, color: '#374151' }}>
          Resumo Executivo
        </h3>
        <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>
          O Instituto Carrascal atende <strong>{dados.alunos.ativos} alunos ativos</strong> com
          oficinas gratuitas de música em Quixadá. A taxa de frequência nos últimos 30 dias é
          de <strong>{dados.frequencia.taxaMediaUltimos30Dias}</strong>, com {' '}
          <strong>{dados.alunos.naFila} pessoas</strong> aguardando na fila de espera.
          As doações confirmadas até o momento somam{' '}
          <strong>
            R$ {Number(dados.financeiro.totalDoacoesConfirmadas).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </strong>, contribuindo para a sustentabilidade do projeto social.
        </p>
      </div>
    </div>
  );
}

function Card({ icon, cor, titulo, valor, descricao }: {
  icon: React.ReactNode; cor: string;
  titulo: string; valor: string | number; descricao: string;
}) {
  return (
    <div style={{
      background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb',
      padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div style={{ color: cor, display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
          letterSpacing: '0.04em', color: '#9ca3af' }}>
          {titulo}
        </span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>{valor}</div>
      <div style={{ fontSize: 12, color: '#9ca3af' }}>{descricao}</div>
    </div>
  );
}
