import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

/**
 * Zentrales Routing.
 * Weitere Seiten (z.B. Vertragsdetail, Login, Benutzerverwaltung)
 * können hier einfach ergänzt werden.
 */
function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Vorbereitet: <Route path="/login" element={<LoginPage />} /> */}
        {/* Vorbereitet: <Route path="/contracts/:id" element={<ContractDetailPage />} /> */}
      </Route>
    </Routes>
  );
}

export default App;
