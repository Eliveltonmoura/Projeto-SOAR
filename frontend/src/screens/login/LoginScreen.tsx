import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LoginPayload } from '../../types';
import logo from '../../assets/logo.png';

export function LoginScreen() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginPayload>();

  async function onSubmit(data: LoginPayload) {
    setErro('');
    setLoading(true);
    try {
      const usuarioLogado = await login(data);
      if (usuarioLogado.papel === 'aluno') {
        navigate('/meu-painel', { replace: true });
        return;
      }
      const destino = (location.state as { from?: Location })?.from?.pathname || '/';
      navigate(destino, { replace: true });
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0f0f1a', fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        display: 'flex', width: '100%', maxWidth: 900, minHeight: 520,
        background: '#fff', borderRadius: 12, overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
      }}>
        {/* Painel esquerdo */}
        <div style={{
          flex: 1, position: 'relative', display: 'none',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #2563eb 100%)',
        }} className="login-image-panel" />

        {/* Painel direito — formulário */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '3rem 2.5rem', gap: 24, minWidth: 360,
        }}>
          <img
            src={logo}
            alt="SOAR"
            style={{ height: 50, objectFit: 'contain' }}
          />

          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Seja bem-vindo</h1>
            <p style={{ fontSize: 13, color: '#6b7280' }}>Efetue seu login</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%', maxWidth: 320, display: 'grid', gap: 18 }}>
            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                placeholder="seuemail@exemplo.com"
                {...register('email', { required: 'Informe o e-mail' })}
                style={inputStyle}
              />
            </Field>
            <Field label="Senha" error={errors.senha?.message}>
              <input
                type="password"
                placeholder="••••••••"
                {...register('senha', { required: 'Informe a senha' })}
                style={inputStyle}
              />
            </Field>

            {erro && (
              <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.6rem 0.75rem',
                color: '#dc2626', fontSize: 13 }}>
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '0.75rem', borderRadius: 24, border: 'none',
                background: loading ? '#9ca3af' : '#1a1a2e', color: '#fff',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                marginTop: 8,
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <Link
            to="/matricula"
            style={{
              textAlign: 'center', fontSize: 13, color: '#2563eb',
              textDecoration: 'none', fontWeight: 600,
            }}
          >
            Quero me matricular
          </Link>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .login-image-panel { display: block !important; }
        }
      `}</style>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.9rem', border: '1px solid #d1d5db',
  borderRadius: 8, fontSize: 14, boxSizing: 'border-box',
};

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <p style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{error}</p>}
    </div>
  );
}
