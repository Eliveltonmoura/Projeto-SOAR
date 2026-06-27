import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { UserCircle, LayoutGrid, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SoarLogo } from '../SoarLogo';

export function ProfessorLayout() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside className="no-print" style={{
        width: 240,
        background: '#1a1a2e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.25rem 0',
      }}>
        {/* Usuário logado */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 1.25rem 1.25rem', borderBottom: '1px solid #2a2a4a',
        }}>
          <UserCircle size={28} color="#ccc" />
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {usuario?.nome ?? 'Usuário'}
            </div>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'capitalize' }}>{usuario?.papel}</div>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 4 }}
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Navegação */}
        <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
          <NavLink
            to="/professor"
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.65rem 0.75rem', borderRadius: 8, marginBottom: 4,
              color: isActive ? '#f59e0b' : '#ccc',
              background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
              textDecoration: 'none', fontSize: 14,
              fontWeight: isActive ? 600 : 400, transition: 'all 0.15s',
            })}
          >
            <LayoutGrid size={16} />
            Minhas Turmas
          </NavLink>
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main style={{ flex: 1, background: '#f8fafc', padding: '2rem' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <SoarLogo size={24} />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
