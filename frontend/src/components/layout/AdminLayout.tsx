import { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  UserCircle,
  Users,
  ClipboardCheck,
  Heart,
  LayoutGrid,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SoarLogo } from '../SoarLogo';

interface NavItem {
  label: string;
  icon: typeof Users;
  to?: string;
  children?: { to: string; label: string }[];
}

const navItems: NavItem[] = [
  {
    label: 'Alunos',
    icon: Users,
    children: [
      { to: '/alunos/pendentes', label: 'Matrículas Pendentes' },
      { to: '/alunos/listar', label: 'Listar Alunos' },
      { to: '/alunos/fila-espera', label: 'Fila de Espera' },
    ],
  },
  { label: 'Frequência', icon: ClipboardCheck, to: '/frequencia' },
  { label: 'Turmas', icon: LayoutGrid, to: '/turmas' },
  {
    label: 'Doações',
    icon: Heart,
    children: [
      { to: '/doacoes-recebidas', label: 'Doações recebidas' },
      { to: '/relatorios', label: 'Relatório de Impacto' },
    ],
  },
];

export function AdminLayout() {
  const { usuario, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const item of navItems) {
      if (item.children?.some((child) => location.pathname.startsWith(child.to))) {
        initial[item.label] = true;
      }
    }
    return initial;
  });

  function toggleSection(label: string) {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }

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
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.children) {
              const isOpen = !!openSections[item.label];
              const isActive = item.children.some((c) => location.pathname.startsWith(c.to));
              return (
                <div key={item.label} style={{ marginBottom: 4 }}>
                  <button
                    onClick={() => toggleSection(item.label)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                      padding: '0.65rem 0.75rem', borderRadius: 8, border: 'none',
                      background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                      color: isActive ? '#f59e0b' : '#ccc',
                      fontSize: 14, fontWeight: isActive ? 600 : 400,
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <Icon size={16} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>
                  {isOpen && (
                    <div style={{ marginLeft: 28, marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {item.children.map((child) => (
                        <NavLink
                          key={child.to}
                          to={child.to}
                          style={({ isActive }) => ({
                            padding: '0.5rem 0.75rem', borderRadius: 6,
                            color: isActive ? '#f59e0b' : '#aaa',
                            background: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                            textDecoration: 'none', fontSize: 13,
                            fontWeight: isActive ? 600 : 400,
                          })}
                        >
                          {child.label}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to!}
                style={({ isActive }) => ({
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '0.65rem 0.75rem', borderRadius: 8, marginBottom: 4,
                  color: isActive ? '#f59e0b' : '#ccc',
                  background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                  textDecoration: 'none', fontSize: 14,
                  fontWeight: isActive ? 600 : 400, transition: 'all 0.15s',
                })}
              >
                <Icon size={16} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Voltar ao dashboard */}
        <div style={{ padding: '0 0.75rem' }}>
          <NavLink
            to="/"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '0.65rem 0.75rem', borderRadius: 8,
              color: '#ccc', textDecoration: 'none', fontSize: 14,
              borderTop: '1px solid #2a2a4a', paddingTop: '1rem',
            }}
          >
            <ArrowLeft size={16} />
            Voltar
          </NavLink>
        </div>
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
