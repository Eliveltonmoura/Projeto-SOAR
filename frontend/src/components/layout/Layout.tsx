import { NavLink, Outlet } from 'react-router-dom';
import {
  Users,
  ClipboardList,
  Heart,
  BarChart3,
  Music,
} from 'lucide-react';

const navItems = [
  { to: '/matricula', icon: Users, label: 'Matrícula' },
  { to: '/presenca', icon: ClipboardList, label: 'Presença' },
  { to: '/doacoes', icon: Heart, label: 'Doações' },
  { to: '/relatorios', icon: BarChart3, label: 'Relatórios' },
];

export function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        background: '#1a1a2e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 0',
      }}>
        <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid #2a2a4a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Music size={20} color="#f59e0b" />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14 }}>Instituto Carrascal</div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>Sistema SOAR</div>
            </div>
          </div>
        </div>

        <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0.65rem 0.75rem',
                borderRadius: 8,
                marginBottom: 4,
                color: isActive ? '#f59e0b' : '#ccc',
                background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.15s',
              })}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main style={{ flex: 1, background: '#f8fafc', padding: '2rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
