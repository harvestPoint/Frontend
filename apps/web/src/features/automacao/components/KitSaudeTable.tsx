// apps/web/src/features/automacao/components/KitSaudeTable.tsx
import type { KeyboardEvent } from 'react';
import { sparkPontos } from '../data/curvas';
import type { Kit } from '../types';
import { StatusKitPilula, statusDoKit } from './DispositivoDrawer';
import Sparkline from './Sparkline';
import { cartao, tituloCartao } from './ui';

const cab: React.CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-2)' };

export default function KitSaudeTable({ kits, semSinal, aoAbrir }: { kits: Kit[]; semSinal: boolean; aoAbrir: (id: string) => void }) {
  const aoTeclar = (e: KeyboardEvent<HTMLElement>, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); aoAbrir(id); }
  };
  return (
    <section style={{ ...cartao, padding: 0, overflow: 'hidden' }} aria-label="Saúde do kit">
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
        <div style={tituloCartao}>Saúde do kit</div>
        <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Clique numa linha para ver o dispositivo</span>
      </div>
      <div className="au-scroll-x">
        <div className="au-tabela-min" role="table" aria-label="Saúde dos kits IoT">
          <div role="row" className="au-tabela-linha" style={{ height: '44px', background: 'var(--hp-surface-2)', ...cab }}>
            <span role="columnheader">DISPOSITIVO</span><span role="columnheader">LOTE</span><span role="columnheader">ÚLTIMO SINAL</span>
            <span role="columnheader" style={{ textAlign: 'right' }}>BATERIA</span><span role="columnheader" style={{ textAlign: 'right' }}>SINAL WI-FI</span>
            <span role="columnheader">FIRMWARE</span><span role="columnheader">ÚLTIMAS 6 H</span><span role="columnheader">STATUS</span>
          </div>
          {kits.map((k) => {
            const s = statusDoKit(k, semSinal);
            const hoje = k.atuadorId === 'a1';
            return (
              <div
                key={k.id} role="row" tabIndex={0} className="au-tabela-linha au-linha-clicavel" onClick={() => aoAbrir(k.id)} onKeyDown={(e) => aoTeclar(e, k.id)}
                aria-label={`${k.id}, ${s.texto}. Abrir dispositivo`}
                style={{ height: '56px', borderTop: '1px solid var(--hp-border)', fontSize: '14px' }}
              >
                <span role="cell" style={{ fontWeight: 600, color: 'var(--hp-accent-hover)' }}>{k.id}</span>
                <span role="cell">{k.lote}</span>
                <span role="cell" style={{ color: 'var(--hp-text-2)' }}>{s.sinal}</span>
                <span role="cell" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{k.bateria} %</span>
                <span role="cell" style={{ textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{k.wifi} dBm</span>
                <span role="cell" style={{ color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>{k.firmware}</span>
                <span role="cell"><Sparkline pontos={sparkPontos(k.pico, hoje, hoje ? 0 : -0.3)} largura={96} altura={30} limite={null} semSinal={s.off} /></span>
                <span role="cell"><StatusKitPilula kit={k} semSinal={semSinal} /></span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
