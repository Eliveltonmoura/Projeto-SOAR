import { Music2 } from 'lucide-react';

const LETTER_COLORS = ['#0d9488', '#f59e0b', '#ec4899', '#0d9488'];

// Wordmark "Soar" colorido, igual ao logo do Projeto SOAR
export function SoarLogo({ size = 28, withTagline = false }: { size?: number; withTagline?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
        {['S', 'o', 'a', 'r'].map((letra, i) => (
          <span key={i} style={{ fontSize: size, fontWeight: 800, color: LETTER_COLORS[i] }}>
            {letra}
          </span>
        ))}
        <Music2 size={size * 0.8} color="#ec4899" style={{ marginLeft: -2 }} />
      </div>
      {withTagline && (
        <span style={{ fontSize: size * 0.28, color: '#6b7280', letterSpacing: '0.04em', marginTop: 2 }}>
          Arte, educação e cultura
        </span>
      )}
    </div>
  );
}
