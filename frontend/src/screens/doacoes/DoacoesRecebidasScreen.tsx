import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { doacoesService } from '../../services/doacoes.service';
import { useAuth } from '../../context/AuthContext';
import { Doacao, StatusDoacao } from '../../types';

const STATUS_OPTIONS: StatusDoacao[] = ['pendente', 'confirmado', 'rejeitado'];

const STATUS_LABEL: Record<StatusDoacao, string> = {
  pendente: 'Pendente',
  confirmado: 'Validada',
  rejeitado: 'Rejeitada',
};

const STATUS_COLOR: Record<StatusDoacao, string> = {
  pendente: '#f59e0b',
  confirmado: '#059669',
  rejeitado: '#dc2626',
};

export function DoacoesRecebidasScreen() {
  const { usuario } = useAuth();
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    doacoesService
      .listar()
      .then(setDoacoes)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }, []);

  async function alterarStatus(id: string, status: StatusDoacao) {
    setErro('');
    try {
      const atualizado = await doacoesService.auditar(id, status, usuario?.nome ?? '');
      setDoacoes((prev) => prev.map((d) => (d.id === id ? atualizado : d)));
    } catch (e: any) {
      setErro(e.message);
    }
  }

  async function verComprovante(id: string) {
    setErro('');
    try {
      await doacoesService.verComprovante(id);
    } catch (e: any) {
      setErro(e.message);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Doações Recebidas</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Audite as doações registradas via PIX.
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
                <th style={thStyle}>Doador</th>
                <th style={thStyle}>Valor</th>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Comprovante</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {doacoes.map((doacao) => (
                <tr key={doacao.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{doacao.nomeDoador}</td>
                  <td style={tdStyle}>
                    {Number(doacao.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td style={tdStyle}>{format(new Date(doacao.criadoEm), 'dd/MM/yyyy')}</td>
                  <td style={tdStyle}>
                    {doacao.comprovantePixOriginalName ? (
                      <button
                        onClick={() => verComprovante(doacao.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          color: '#2563eb', fontSize: 13, fontWeight: 600, padding: 0,
                          textDecoration: 'underline',
                        }}
                      >
                        Ver comprovante
                      </button>
                    ) : (
                      <span style={{ color: '#9ca3af', fontSize: 13 }}>—</span>
                    )}
                  </td>
                  <td style={tdStyle}>
                    <select
                      value={doacao.status}
                      onChange={(e) => alterarStatus(doacao.id, e.target.value as StatusDoacao)}
                      style={{
                        ...inputStyle, color: STATUS_COLOR[doacao.status], fontWeight: 700,
                        borderColor: STATUS_COLOR[doacao.status],
                      }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{STATUS_LABEL[status]}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {doacoes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhuma doação registrada.
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
const inputStyle: React.CSSProperties = {
  padding: '0.4rem 0.6rem', border: '1px solid #d1d5db',
  borderRadius: 6, fontSize: 13, background: '#fff',
};
