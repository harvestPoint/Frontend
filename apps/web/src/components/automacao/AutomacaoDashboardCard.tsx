// apps/web/src/components/automacao/AutomacaoDashboardCard.tsx
// Card "Automação" do Dashboard: aviso compacto (quando houver) e duas
// métricas — aspersores ligados agora e último acionamento.
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { acoes, useAutomacao } from './store';
import AcaoNecessariaBanner from './AcaoNecessariaBanner';
import { FONTE_TITULO, Icone, cartao } from './ui';

export default function AutomacaoDashboardCard() {
  const navigate = useNavigate();
  const { isTecnico } = useAuth();
  const s = useAutomacao();
  const abrir = () => navigate('/automacao');
  const ligados = s.atuadores.filter((a) => a.estado === 'ligado');
  const ultimo = s.eventos.find((e) => e.tipo === 'ligou');

  return (
    <div style={{ ...cartao, display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icone nome="water_drop" tamanho={20} cor="var(--hp-info)" />
          <span style={{ fontFamily: FONTE_TITULO, fontSize: '16px', lineHeight: '22px', fontWeight: 700 }}>Automação</span>
        </div>
        <button type="button" className="au-btn" onClick={abrir}
          style={{ border: 0, background: 'transparent', padding: '4px', fontSize: '13px', fontWeight: 600, color: 'var(--hp-accent-hover)' }}>
          Abrir ›
        </button>
      </div>

      {s.status === 'carregando' && <div className="au-skel" style={{ height: '96px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-surface-2)' }} />}
      {s.status === 'erro' && <div style={{ fontSize: '13px', color: 'var(--hp-text-2)' }}>Não foi possível carregar. Os aspersores seguem as regras gravadas em cada kit.</div>}

      {s.status === 'pronto' && (
        <>
          {s.aviso && <AcaoNecessariaBanner compact aviso={s.aviso} aoLigar={() => acoes.aprovar(isTecnico ? 'técnico' : 'proprietário')} />}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Ligados agora</div>
              <div style={{ fontSize: '26px', lineHeight: '34px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                {ligados.length} <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--hp-text-2)' }}>de {s.atuadores.length}</span>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
                {ligados[0] ? `Setor ${ligados[0].id.toUpperCase()} · faltam ${ligados[0].restante} min` : 'Nenhum aspersor ligado'}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Último acionamento</div>
              <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>{ultimo ? `Setor ${ultimo.setor} · ${ultimo.h}` : '—'}</div>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>{ultimo ? ultimo.motivo : 'Sem acionamentos hoje'}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
