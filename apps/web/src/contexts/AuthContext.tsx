// apps/web/src/contexts/AuthContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';

export type UserRole = 'proprietario' | 'tecnico';

interface AuthUser {
  nome: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  isTecnico: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // TODO: substituir por sessão real (token em cookie/localStorage + /auth/me).
  // Começa deslogado de propósito: assim a rota "/" mostra a Landing Page
  // pra quem chega no site. Pra testar o app direto sem logar toda hora
  // durante o desenvolvimento, troque `null` por um usuário mockado aqui.
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (u: AuthUser) => setUser(u);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isTecnico: user?.role === 'tecnico', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth precisa estar dentro de <AuthProvider>');
  return ctx;
}
