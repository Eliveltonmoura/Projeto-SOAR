import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireProfessor() {
  const { usuario } = useAuth();

  if (usuario?.papel === 'aluno') {
    return <Navigate to="/meu-painel" replace />;
  }
  if (usuario?.papel === 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
