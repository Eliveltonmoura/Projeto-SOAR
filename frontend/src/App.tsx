import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { MatriculaScreen } from './screens/matricula/MatriculaScreen';
import { PresencaScreen } from './screens/presenca/PresencaScreen';
import { DoacoesScreen } from './screens/doacoes/DoacoesScreen';
import { RelatoriosScreen } from './screens/relatorios/RelatoriosScreen';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/matricula" replace />} />
          <Route path="matricula" element={<MatriculaScreen />} />
          <Route path="presenca" element={<PresencaScreen />} />
          <Route path="doacoes" element={<DoacoesScreen />} />
          <Route path="relatorios" element={<RelatoriosScreen />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
