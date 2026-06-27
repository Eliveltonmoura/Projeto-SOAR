import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { authService, CriarProfessorPayload } from '../../services/auth.service';
import { Usuario } from '../../types';

export function ProfessoresScreen() {
  const [professores, setProfessores] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [salvando, setSalvando] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CriarProfessorPayload>();

  useEffect(() => {
    carregar();
  }, []);

  function carregar() {
    setLoading(true);
    authService
      .listarProfessores()
      .then(setProfessores)
      .catch((e: any) => setErro(e.message))
      .finally(() => setLoading(false));
  }

  async function onSubmit(data: CriarProfessorPayload) {
    setErro('');
    setMensagem('');
    setSalvando(true);
    try {
      const professor = await authService.criarProfessor(data);
      setProfessores((prev) => [...prev, professor].sort((a, b) => a.nome.localeCompare(b.nome)));
      setMensagem(`Conta criada para ${professor.nome}.`);
      reset();
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Professores</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 24 }}>
        Crie contas de acesso para professores e atribua turmas na tela de Turmas.
      </p>

      {erro && (
        <div style={{ background: '#fee2e2', borderRadius: 6, padding: '0.75rem',
          color: '#dc2626', fontSize: 14, marginBottom: 16 }}>
          {erro}
        </div>
      )}
      {mensagem && (
        <div style={{ background: '#d1fae5', borderRadius: 6, padding: '0.75rem',
          color: '#065f46', fontSize: 14, marginBottom: 16 }}>
          {mensagem}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{
          background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb',
          padding: '1.25rem', marginBottom: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'flex-end',
        }}
      >
        <div>
          <label style={labelStyle}>Nome</label>
          <input {...register('nome', { required: 'Obrigatório' })} style={inputStyle} />
          {errors.nome && <p style={errorStyle}>{errors.nome.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>E-mail</label>
          <input type="email" {...register('email', { required: 'Obrigatório' })} style={inputStyle} />
          {errors.email && <p style={errorStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label style={labelStyle}>Senha</label>
          <input
            type="password"
            {...register('senha', { required: 'Obrigatório', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
            style={inputStyle}
          />
          {errors.senha && <p style={errorStyle}>{errors.senha.message}</p>}
        </div>
        <button
          type="submit"
          disabled={salvando}
          style={{
            padding: '0.55rem 1.25rem', borderRadius: 8, border: 'none',
            background: salvando ? '#9ca3af' : '#1a1a2e', color: '#fff',
            fontSize: 14, fontWeight: 600, cursor: salvando ? 'not-allowed' : 'pointer',
          }}
        >
          {salvando ? 'Criando...' : 'Criar professor'}
        </button>
      </form>

      {loading ? (
        <p style={{ color: '#9ca3af', fontSize: 14 }}>Carregando...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                <th style={thStyle}>Nome</th>
                <th style={thStyle}>E-mail</th>
              </tr>
            </thead>
            <tbody>
              {professores.map((professor) => (
                <tr key={professor.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                  <td style={tdStyle}>{professor.nome}</td>
                  <td style={tdStyle}>{professor.email}</td>
                </tr>
              ))}
              {professores.length === 0 && (
                <tr>
                  <td colSpan={2} style={{ ...tdStyle, textAlign: 'center', color: '#9ca3af' }}>
                    Nenhum professor cadastrado.
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
const errorStyle: React.CSSProperties = {
  color: '#dc2626', fontSize: 12, marginTop: 4,
};
