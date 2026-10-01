import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getSelectedPropriedadeId,
  listPropriedades,
  setSelectedPropriedadeId,
  type Propriedade,
} from '@/lib/api';

interface PropertyContextValue {
  propriedades: Propriedade[];
  selectedId: number | null;
  selected: Propriedade | null;
  setSelectedId: (id: number | null) => void;
  reload: () => Promise<void>;
}

const PropertyContext = createContext<PropertyContextValue | undefined>(undefined);

export function PropertyProvider({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [selectedId, setSelectedIdState] = useState<number | null>(getSelectedPropriedadeId());

  const reload = async () => {
    const list = await listPropriedades();
    setPropriedades(list);
    setSelectedIdState((current) => {
      if (current && list.some((p) => p.id === current)) return current;
      const next = list[0]?.id ?? null;
      setSelectedPropriedadeId(next);
      return next;
    });
  };

  useEffect(() => {
    if (!ready || !user) {
      setPropriedades([]);
      return;
    }
    void reload().catch(() => setPropriedades([]));
  }, [ready, user?.id]);

  const setSelectedId = (id: number | null) => {
    setSelectedPropriedadeId(id);
    setSelectedIdState(id);
  };

  return (
    <PropertyContext.Provider
      value={{
        propriedades,
        selectedId,
        selected: propriedades.find((p) => p.id === selectedId) || null,
        setSelectedId,
        reload,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
}

export function useProperty() {
  const ctx = useContext(PropertyContext);
  if (!ctx) throw new Error('useProperty precisa estar dentro de PropertyProvider');
  return ctx;
}
