import { useNavigate } from 'react-router-dom';
import { Users, ClipboardCheck, Heart, LayoutGrid } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const cards = [
  { label: 'Alunos', icon: Users, to: '/alunos/listar', color: '#2563eb' },
  { label: 'Frequência', icon: ClipboardCheck, to: '/frequencia', color: '#059669' },
  { label: 'Doações', icon: Heart, to: '/doacoes-recebidas', color: '#ec4899' },
  { label: 'Turmas', icon: LayoutGrid, to: '/turmas', color: '#f59e0b' },
];

export function DashboardScreen() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 4 }}>Olá, {usuario?.nome ?? 'usuário'}</h1>
      <p style={{ color: '#666', fontSize: 14, marginBottom: 32 }}>
        Selecione uma seção para começar.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20,
      }}>
        {cards.map(({ label, icon: Icon, to, color }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
              padding: '2rem 1rem', borderRadius: 12, border: '1px solid #e5e7eb',
              background: '#fff', cursor: 'pointer', transition: 'all 0.15s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'; }}
          >
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: `${color}1a`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={26} color={color} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e' }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
