// apps/web/src/layouts/parts/Sidebar.tsx
// Fiel ao shell aprovado no Claude Design — a condição que esconde
// "CADASTROS" do Proprietário já veio pronta de lá (isTecnico); aqui ela é
// ligada ao papel real do usuário autenticado em vez de um estado fixo.
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface NavItemProps {
  to: string;
  icon: string;
  label: string;
  badge?: number;
}

function NavItem({ to, icon, label, badge }: NavItemProps) {
  return (
    <NavLink
      to={to}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        height: '44px',
        padding: '0 12px',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none',
        color: isActive ? 'var(--hp-accent)' : 'var(--hp-text)',
        background: isActive ? 'var(--hp-accent-soft)' : 'transparent',
        boxShadow: isActive ? 'inset 3px 0 0 var(--hp-accent)' : 'none',
      })}
    >
      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: 1, color: 'inherit' }}>
        {icon}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {typeof badge === 'number' && badge > 0 && (
        <span
          style={{
            minWidth: '20px', height: '20px', borderRadius: '12px', background: 'var(--hp-critico)',
            color: '#FFFFFF', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: '0 6px',
          }}
        >
          {badge}
        </span>
      )}
    </NavLink>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '11px', lineHeight: '14px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)', padding: '14px 12px 6px' }}>
      {children}
    </div>
  );
}

export default function Sidebar() {
  const { user, isTecnico } = useAuth();
  const navigate = useNavigate();
  const [cadastrosOpen, setCadastrosOpen] = useState(true);

  return (
    <div style={{ width: '264px', flex: '0 0 264px', background: 'var(--hp-surface)', borderRight: '1px solid var(--hp-border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: '72px', padding: '0 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'var(--hp-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: 1, color: 'var(--hp-accent)' }}>eco</span>
          </div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '15px', fontWeight: 800, letterSpacing: '-.01em' }}>HarvestPoint</div>
            <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Fazenda Boa Vista</div>
          </div>
        </div>
      </div>

      <div style={{ flex: 1, padding: '8px 12px 0', overflow: 'auto' }}>
        <GroupLabel>VISÃO GERAL</GroupLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <NavItem to="/" icon="dashboard" label="Dashboard" />
          <NavItem to="/alertas" icon="warning" label="Alertas" badge={4} />
        </div>

        <GroupLabel>OPERAÇÃO</GroupLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <NavItem to="/lotes" icon="grid_view" label="Lotes" />
          <NavItem to="/leituras" icon="sensors" label="Leituras IoT" />
        </div>

        <GroupLabel>INTELIGÊNCIA</GroupLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <NavItem to="/inteligencia/colheita" icon="event_available" label="Janela de colheita" />
          <NavItem to="/inteligencia/exportacao" icon="public" label="Janela de exportação" />
        </div>

        <GroupLabel>MERCADO &amp; LOGÍSTICA</GroupLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <NavItem to="/mercado" icon="payments" label="Mercado" />
          <NavItem to="/logistica" icon="local_shipping" label="Logística" />
        </div>

        {isTecnico && (
          <>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 12px 6px', cursor: 'pointer' }}
              onClick={() => setCadastrosOpen((v) => !v)}
            >
              <span style={{ fontSize: '11px', lineHeight: '14px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' }}>CADASTROS</span>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1, color: 'var(--hp-text-3)' }}>
                {cadastrosOpen ? 'expand_less' : 'expand_more'}
              </span>
            </div>
            {cadastrosOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <NavItem to="/cadastros/produtores" icon="groups" label="Produtores" />
                <NavItem to="/cadastros/propriedades" icon="location_on" label="Propriedades" />
                <NavItem to="/cadastros/culturas" icon="potted_plant" label="Culturas" />
                <NavItem to="/cadastros/sensores" icon="memory" label="Sensores" />
              </div>
            )}
          </>
        )}
      </div>

      <div style={{ borderTop: '1px solid var(--hp-border)', padding: '14px 16px' }}>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-accent)', display: 'inline-block' }} />
          2 sensores on-line · atualizado há 2 min
        </div>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px', cursor: 'pointer' }}
          onClick={() => navigate('/conta')}
        >
          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--hp-accent)', color: '#FFFFFF', fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            AF
          </div>
          <div>
            <div style={{ fontSize: '13px', lineHeight: '16px', fontWeight: 600 }}>{user?.nome ?? 'Convidado'}</div>
            <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>{isTecnico ? 'Técnico de campo' : 'Proprietário'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
