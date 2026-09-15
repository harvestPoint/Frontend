// apps/web/src/routes/index.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RequireAuth from './RequireAuth';
import AppShell from '@/layouts/AppShell';

import LandingPage from '@/features/landing/pages/LandingPage';
import LoginPage from '@/features/auth/pages/LoginPage';
import SignupPage from '@/features/auth/pages/SignupPage';

import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import AlertasPage from '@/features/alertas/pages/AlertasPage';
import LotesPage from '@/features/lotes/pages/LotesPage';
import LoteDetalhePage from '@/features/lotes/pages/LoteDetalhePage';
import LeiturasPage from '@/features/leituras/pages/LeiturasPage';
import JanelaColheitaPage from '@/features/inteligencia/pages/JanelaColheitaPage';
import JanelaExportacaoPage from '@/features/inteligencia/pages/JanelaExportacaoPage';
import MercadoPage from '@/features/mercado/pages/MercadoPage';
import LogisticaPage from '@/features/logistica/pages/LogisticaPage';
import PerfilPage from '@/features/conta/pages/PerfilPage';
import ProdutoresPage from '@/features/cadastros/produtores/pages/ProdutoresPage';
import PropriedadesPage from '@/features/cadastros/propriedades/pages/PropriedadesPage';
import CulturasPage from '@/features/cadastros/culturas/pages/CulturasPage';
import SensoresPage from '@/features/cadastros/sensores/pages/SensoresPage';

/** Raiz pública: mostra a landing pra quem não está logado e manda quem já
 * está logado direto pro Dashboard — os dois "moram" na mesma rota "/". */
function RootGate() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <LandingPage />;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RootGate />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/criar-conta" element={<SignupPage />} />

      <Route
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/alertas" element={<AlertasPage />} />
        <Route path="/lotes" element={<LotesPage />} />
        <Route path="/lotes/:id" element={<LoteDetalhePage />} />
        <Route path="/leituras" element={<LeiturasPage />} />
        <Route path="/inteligencia/colheita" element={<JanelaColheitaPage />} />
        <Route path="/inteligencia/exportacao" element={<JanelaExportacaoPage />} />
        <Route path="/mercado" element={<MercadoPage />} />
        <Route path="/logistica" element={<LogisticaPage />} />
        <Route path="/conta" element={<PerfilPage />} />
        <Route path="/cadastros/produtores" element={<ProdutoresPage />} />
        <Route path="/cadastros/propriedades" element={<PropriedadesPage />} />
        <Route path="/cadastros/culturas" element={<CulturasPage />} />
        <Route path="/cadastros/sensores" element={<SensoresPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
