import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SoarLogo } from '../SoarLogo';

export function AlunoLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 2rem', background: '#1a1a2e', color: '#fff',
      }}>
        <SoarLogo size={24} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserCircle size={24} color="#ccc" />
          <span style={{ fontSize: 14, fontWeight: 600 }}>{usuario?.nome ?? 'Aluno'}</span>
          <button
            onClick={handleLogout}
            title="Sair"
            style={{ background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', padding: 4, display: 'flex' }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
