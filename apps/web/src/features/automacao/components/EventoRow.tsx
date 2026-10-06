// apps/web/src/features/automacao/components/EventoRow.tsx
import type { KeyboardEvent } from 'react';
import type { Evento, TipoEvento } from '../types';
import { Icone, TONS, type Tom } from './ui';

export const TIPOS: Record<TipoEvento, { rotulo: string; icone: string; tom: Tom }> = {
  gatilho: { rotulo: 'Gatilho', icone: 'bolt', tom: 'at' },
  aviso: { rotulo: 'Aviso enviado', icone: 'notifications', tom: 'at' },
  aprovado: { rotulo: 'Aprovado', icone: 'check_circle', tom: 'ac' },
  recusado: { rotulo: 'Recusado', icone: 'cancel', tom: 'tx' },
  expirou: { rotulo: 'Expirou', icone: 'schedule', tom: 'tx' },
  ligou: { rotulo: 'Ligou', icone: 'water_drop', tom: 'in' },
  desligou: { rotulo: 'Desligou', icone: 'format_color_reset', tom: 'tx' },
  bloqueado: { rotulo: 'Bloqueado', icone: 'block', tom: 'cr' },
  falha: { rotulo: 'Falha', icone: 'error', tom: 'cr' },
};

export default function EventoRow({ evento: e, aoAbrir }: { evento: Evento; aoAbrir: () => void }) {
  const t = TIPOS[e.tipo];
  const [fg, bg] = TONS[t.tom];
  const aoTeclar = (ev: KeyboardEvent<HTMLElement>) => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); aoAbrir(); } };
  return (
    <li
      className="au-linha-clicavel" tabIndex={0} onClick={aoAbrir} onKeyDown={aoTeclar}
      aria-label={`${e.h}, ${t.rotulo}, setor ${e.setor}. Ver por que isso aconteceu`}
      style={{ display: 'flex', gap: '12px', padding: '12px 8px', borderTop: '1px solid var(--hp-border)', borderRadius: '10px', listStyle: 'none' }}
    >
      <div style={{ width: '32px', height: '32px', borderRadius: '10px', flexShrink: 0, background: bg, color: fg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icone nome={t.icone} tamanho={17} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', flexWrap: 'wrap' }}>
          <b style={{ fontVariantNumeric: 'tabular-nums' }}>{e.h}</b>
          <span style={{ fontWeight: 600 }}>{t.rotulo}</span>
          <span style={{ color: 'var(--hp-text-2)' }}>· Setor {e.setor}</span>
        </div>
        <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '2px' }}>{e.motivo}</div>
      </div>
      <span style={{ fontSize: '12px', color: 'var(--hp-text-2)', whiteSpace: 'nowrap', alignSelf: 'center' }}>{e.origem}</span>
    </li>
  );
}
