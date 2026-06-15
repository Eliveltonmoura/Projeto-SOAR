import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/layout/AdminLayout';
import { AlunoLayout } from './components/layout/AlunoLayout';
import { RequireAuth } from './components/RequireAuth';
import { RequireStaff } from './components/RequireStaff';
import { LoginScreen } from './screens/login/LoginScreen';
import { MeuPainelScreen } from './screens/aluno/MeuPainelScreen';
import { MatriculaScreen } from './screens/matricula/MatriculaScreen';
import { DoacoesScreen } from './screens/doacoes/DoacoesScreen';
import { DoacoesRecebidasScreen } from './screens/doacoes/DoacoesRecebidasScreen';
import { RelatoriosScreen } from './screens/relatorios/RelatoriosScreen';
import { DashboardScreen } from './screens/dashboard/DashboardScreen';
import { ListarAlunosScreen } from './screens/alunos/ListarAlunosScreen';
import { FilaEsperaScreen } from './screens/alunos/FilaEsperaScreen';
import { MatriculasPendentesScreen } from './screens/alunos/MatriculasPendentesScreen';
import { TurmasFrequenciaScreen } from './screens/frequencia/TurmasFrequenciaScreen';
import { ChamadaScreen } from './screens/frequencia/ChamadaScreen';
import { TurmasScreen } from './screens/turmas/TurmasScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/matricula" element={<MatriculaScreen />} />

        <Route element={<Layout />}>
          <Route path="doacoes" element={<DoacoesScreen />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<AlunoLayout />}>
            <Route path="meu-painel" element={<MeuPainelScreen />} />
          </Route>

          <Route element={<RequireStaff />}>
            <Route element={<AdminLayout />}>
              <Route path="/" element={<DashboardScreen />} />
              <Route path="alunos" element={<Navigate to="/alunos/listar" replace />} />
              <Route path="alunos/pendentes" element={<MatriculasPendentesScreen />} />
              <Route path="alunos/listar" element={<ListarAlunosScreen />} />
              <Route path="alunos/fila-espera" element={<FilaEsperaScreen />} />
              <Route path="frequencia" element={<TurmasFrequenciaScreen />} />
              <Route path="frequencia/:instrumento/:horario" element={<ChamadaScreen />} />
              <Route path="turmas" element={<TurmasScreen />} />
              <Route path="doacoes-recebidas" element={<DoacoesRecebidasScreen />} />
              <Route path="relatorios" element={<RelatoriosScreen />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
