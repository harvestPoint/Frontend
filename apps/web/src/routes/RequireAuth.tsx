// apps/web/src/routes/RequireAuth.tsx
import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  // TODO: trocar por verificação de token real assim que a API existir
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
