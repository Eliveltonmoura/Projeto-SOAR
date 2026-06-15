import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireStaff() {
  const { usuario, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <p style={{ padding: 24, color: '#9ca3af' }}>Carregando...</p>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (usuario?.papel === 'aluno') {
    return <Navigate to="/meu-painel" replace />;
  }

  return <Outlet />;
}
