import { useState, useRef } from 'react';
import { doacoesService } from '../../services/doacoes.service';

export function DoacoesScreen() {
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro('');
    const fd = new FormData(e.currentTarget);
    if (arquivo) fd.append('comprovante', arquivo);

    setLoading(true);
    try {
      await doacoesService.registrar(fd);
      setSucesso(true);
      formRef.current?.reset();
      setArquivo(null);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Módulo de Doações</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Registre uma doação via PIX e faça o upload do comprovante para auditoria.
      </p>

      {sucesso && (
        <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7',
          borderRadius: 8, padding: '1rem', marginBottom: 20, color: '#065f46' }}>
          ✅ Doação registrada! Aguarda confirmação pela equipe.
          <button onClick={() => setSucesso(false)}
            style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer',
              color: '#065f46', fontWeight: 700 }}>
            + Nova doação
          </button>
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
        <div style={{ display: 'grid', gap: 14 }}>
          <Field label="Nome do doador *">
            <input name="nomeDoador" required style={inputStyle} placeholder="Seu nome completo" />
          </Field>
          <Field label="Valor da doação (R$) *">
            <input name="valor" type="number" step="0.01" min="1" required
              style={inputStyle} placeholder="0,00" />
          </Field>
          <Field label="CPF (opcional — LGPD)">
            <input name="cpfDoador" style={inputStyle} placeholder="000.000.000-00" />
          </Field>
          <Field label="E-mail (opcional)">
            <input name="email" type="email" style={inputStyle} />
          </Field>
          <Field label="Mensagem (opcional)">
            <textarea name="mensagem" rows={3} style={{ ...inputStyle, width: '100%', resize: 'vertical' }}
              placeholder="Uma mensagem de apoio ao Instituto Carrascal..." />
          </Field>

          {/* Upload do comprovante */}
          <div>
            <label style={labelStyle}>Comprovante PIX (JPG, PNG ou PDF — máx. 5MB)</label>
            <div
              onClick={() => document.getElementById('file-input')?.click()}
              style={{
                border: `2px dashed ${arquivo ? '#6ee7b7' : '#d1d5db'}`,
                borderRadius: 8, padding: '1.5rem', textAlign: 'center',
                cursor: 'pointer', background: arquivo ? '#f0fdf4' : '#fafafa',
                transition: 'all 0.15s',
              }}
            >
              {arquivo ? (
                <span style={{ color: '#059669', fontSize: 14 }}>
                  📎 {arquivo.name}
                </span>
              ) : (
                <span style={{ color: '#9ca3af', fontSize: 14 }}>
                  Clique para selecionar o comprovante
                </span>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: 'none' }}
              onChange={(e) => setArquivo(e.target.files?.[0] ?? null)}
            />
          </div>
        </div>

        {erro && (
          <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
            color: '#dc2626', fontSize: 13, margin: '16px 0' }}>
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', marginTop: 20, padding: '0.875rem',
            background: loading ? '#9ca3af' : '#059669',
            color: '#fff', border: 'none', borderRadius: 8,
            fontSize: 15, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Enviando...' : '💚 Registrar Doação'}
        </button>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4, fontWeight: 600,
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem',
  border: '1px solid #d1d5db', borderRadius: 6, fontSize: 14,
  boxSizing: 'border-box',
};
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}
