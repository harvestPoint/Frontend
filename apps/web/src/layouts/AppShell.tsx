import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './parts/Sidebar';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import { iniciais } from '@/lib/api';
import { useEffect, useState } from 'react';
import { listAlertas } from '@/lib/api';

const CRUMBS: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/alertas': 'Alertas',
  '/lotes': 'Lotes / Talhões',
  '/leituras': 'Leituras IoT',
  '/inteligencia/colheita': 'Janela de Colheita',
  '/inteligencia/exportacao': 'Janela de Exportação',
  '/mercado': 'Mercado & Preços',
  '/logistica': 'Planejamento de embarque',
  '/conta': 'Perfil',
  '/cadastros/produtores': 'Produtores',
  '/cadastros/propriedades': 'Propriedades',
  '/cadastros/culturas': 'Culturas',
  '/cadastros/sensores': 'Sensores',
};

export default function AppShell() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { propriedades, selectedId, selected, setSelectedId } = useProperty();
  const [propMenuOpen, setPropMenuOpen] = useState(false);
  const [pendentes, setPendentes] = useState(0);

  useEffect(() => {
    listAlertas({ resolvido: false })
      .then((r) => setPendentes(r.pendentes))
      .catch(() => setPendentes(0));
  }, [pathname, selectedId]);

  const crumb = pathname.startsWith('/lotes/') ? 'Lote' : CRUMBS[pathname] ?? '';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hp-bg)', color: 'var(--hp-text)', display: 'flex' }}>
      <Sidebar alertasPendentes={pendentes} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: '64px', background: 'var(--hp-surface)', borderBottom: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Início › {crumb}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', display: 'flex', cursor: 'pointer' }} onClick={() => navigate('/alertas')}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: 1, color: 'var(--hp-text-4)' }}>
                notifications
              </span>
              {pendentes > 0 && (
                <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-critico)' }} />
              )}
            </div>

            <div style={{ position: 'relative' }}>
              <div
                style={{ height: '36px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                onClick={() => setPropMenuOpen((v) => !v)}
              >
                {selected?.nome || 'Todas as propriedades'}
                <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1, color: 'var(--hp-text-2)' }}>expand_more</span>
              </div>
              {propMenuOpen && (
                <div style={{ position: 'absolute', top: '42px', right: 0, width: '240px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(22,21,15,.12)', padding: '6px', zIndex: 20 }}>
                  {propriedades.map((p) => (
                    <div
                      key={p.id}
                      style={{ padding: '10px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', background: p.id === selectedId ? 'var(--hp-accent-soft)' : 'transparent' }}
                      onClick={() => { setSelectedId(p.id); setPropMenuOpen(false); }}
                    >
                      {p.nome}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <span
              title="Modo noturno"
              style={{ cursor: 'pointer', fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: 1, color: 'var(--hp-text-4)' }}
              onClick={toggleTheme}
            >
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>

            <div
              style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--hp-accent)', color: '#FFFFFF', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              onClick={() => navigate('/conta')}
            >
              {iniciais(user?.nome)}
            </div>
          </div>
        </div>

        <div style={{ flex: 1, padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
