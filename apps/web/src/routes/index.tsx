// apps/web/src/routes/index.tsx

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import RequireAuth from './RequireAuth';
import AppShell from '@/layouts/AppShell';

import LandingPage from '@/screens-public/1_LandingPage';
import LoginPage from '@/screens-public/2_LoginPage';
import SignupPage from '@/screens-public/3_SignupPage';

import DashboardPage from '@/screens/01_DashboardPage';
import AlertasPage from '@/screens/03_AlertasPage';
import LotesPage from '@/screens/04_LotesPage';
import LoteDetalhePage from '@/screens/05_LoteDetalhePage';
import LeiturasPage from '@/screens/02_LeiturasPage';
import JanelaColheitaPage from '@/screens/06_JanelaColheitaPage';
import JanelaExportacaoPage from '@/screens/07_JanelaExportacaoPage';
import MercadoPage from '@/screens/08_MercadoPage';
import LogisticaPage from '@/screens/09_LogisticaPage';
import PerfilPage from '@/screens/10_PerfilPage';
import ProdutoresPage from '@/screens/11_ProdutoresPage';
import PropriedadesPage from '@/screens/12_PropriedadesPage';
import CulturasPage from '@/screens/13_CulturasPage';
import SensoresPage from '@/screens/14_SensoresPage';

/** Raiz pública: mostra a landing pra quem não está logado e manda quem já
 * está logado direto pro Dashboard — os dois "moram" na mesma rota "/". */
function RootGate() {
  const { user, ready } = useAuth();
  if (!ready) return null;
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

