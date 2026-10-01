// apps/web/src/App.tsx — só providers, a árvore de rotas mora em routes/

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { PropertyProvider } from '@/contexts/PropertyContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppRoutes from '@/routes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <PropertyProvider>
            <AppRoutes />
          </PropertyProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
