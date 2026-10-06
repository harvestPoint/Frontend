// apps/web/src/features/automacao/components/AtuadorDrawer.tsx
import Drawer from '@/components/overlay/Drawer';
import { rotuloModo } from '../store';
import type { Atuador, Evento, Regra } from '../types';
import { BotaoAtuador } from './AtuadorCard';
import ConsumoBars, { consumoTexto } from './ConsumoBars';
import { TIPOS } from './EventoRow';
import EstadoPill from './EstadoPill';
import { sobrelinha } from './ui';

interface Props {
  atuador: Atuador | null;
  regras: Regra[];
  eventos: Evento[];
  aoFechar: () => void;
  aoLigar: () => void;
  aoDesligar: () => void;
}

export default function AtuadorDrawer({ atuador: a, regras, eventos, aoFechar, aoLigar, aoDesligar }: Props) {
  const regra = a ? regras.find((r) => r.id === a.regraId) : undefined;
  const historico = a ? eventos.filter((e) => e.setor === a.id.toUpperCase()).slice(0, 6) : [];
  return (
    <Drawer aberto={!!a} aoFechar={aoFechar} titulo={a?.nome ?? ''} subtitulo={a && `${a.lote} · kit ${a.kit}`}>
      {a && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <EstadoPill estado={a.estado} />
            <span style={{ fontSize: '13px', color: 'var(--hp-text-2)' }}>Modo {rotuloModo(a.modo)}</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <BotaoAtuador a={a} aoLigar={aoLigar} aoDesligar={aoDesligar} />
          </div>
          <div>
            <div style={sobrelinha}>REGRA APLICADA</div>
            <div style={{ fontSize: '14px', lineHeight: '21px', marginTop: '6px' }}>{regra?.frase}</div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
              <div style={sobrelinha}>CONSUMO · ÚLTIMOS 7 DIAS</div>
              <span style={{ fontSize: '13px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{consumoTexto}</span>
            </div>
            <ConsumoBars />
            <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Minutos ligado por dia · litros estimados a 18 L/min</div>
          </div>
          <div>
            <div style={sobrelinha}>HISTÓRICO DE ACIONAMENTOS</div>
            {historico.map((e) => (
              <div key={e.id} style={{ display: 'flex', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--hp-border)', fontSize: '13px' }}>
                <b style={{ fontVariantNumeric: 'tabular-nums', width: '44px', flexShrink: 0 }}>{e.h}</b>
                <span style={{ fontWeight: 600, width: '90px', flexShrink: 0 }}>{TIPOS[e.tipo].rotulo}</span>
                <span style={{ color: 'var(--hp-text-2)' }}>{e.motivo}</span>
              </div>
            ))}
            {historico.length === 0 && <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', paddingTop: '10px' }}>Sem acionamentos hoje.</div>}
          </div>
        </>
      )}
    </Drawer>
  );
}
