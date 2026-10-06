// apps/web/src/features/automacao/components/AtuadorCard.tsx
import type { KeyboardEvent } from 'react';
import { fmtNum } from '@/lib/uiHelpers';
import { sparkPontos } from '../data/curvas';
import type { Atuador, ModoAtuador } from '../types';
import EstadoPill from './EstadoPill';
import ModoSegmentado from './ModoSegmentado';
import Sparkline from './Sparkline';
import { Botao, cartao, sobrelinha } from './ui';

export function textoApoio(a: Atuador): string {
  switch (a.estado) {
    case 'ligado': return 'faltam ' + a.restante + ' min';
    case 'aguardando': return 'aviso enviado ao proprietário';
    case 'pausa': return 'pulso em pausa · volta em 15 min';
    case 'semsinal': return 'sem leitura há 18 min';
    default: return 'limite ' + a.limite + ' °C';
  }
}

/** Botão principal do atuador (cartão e drawer usam a mesma regra). */
export function BotaoAtuador({ a, aoLigar, aoDesligar }: { a: Atuador; aoLigar: () => void; aoDesligar: () => void }) {
  if (a.estado === 'semsinal') {
    return <Botao bloco tracejado desabilitado icone="signal_disconnected" cor="var(--hp-text-3)">Sem sinal · aguardando kit</Botao>;
  }
  if (a.estado === 'ligado' || a.estado === 'pausa') {
    return <Botao bloco icone="power_settings_new" onClick={(e) => { e.stopPropagation(); aoDesligar(); }}>Desligar</Botao>;
  }
  return <Botao bloco variante="primario" icone="water_drop" onClick={(e) => { e.stopPropagation(); aoLigar(); }}>Ligar agora</Botao>;
}

interface Props {
  atuador: Atuador;
  tecnico: boolean;
  aoAbrir: () => void;
  aoLigar: () => void;
  aoDesligar: () => void;
  aoEscolherModo: (m: ModoAtuador) => void;
}

export default function AtuadorCard({ atuador: a, tecnico, aoAbrir, aoLigar, aoDesligar, aoEscolherModo }: Props) {
  const perdido = a.estado === 'semsinal';
  const aoTeclar = (e: KeyboardEvent<HTMLElement>) => {
    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); aoAbrir(); }
  };
  return (
    <article
      className="au-card-atuador" tabIndex={0} aria-label={`${a.nome}. Abrir detalhes`} onClick={aoAbrir} onKeyDown={aoTeclar}
      style={{
        ...cartao,
        border: `1px ${perdido ? 'dashed' : 'solid'} ${a.estado === 'aguardando' ? 'var(--hp-atencao)' : 'var(--hp-border)'}`,
        background: perdido ? 'var(--hp-surface-2)' : 'var(--hp-surface)',
        color: perdido ? 'var(--hp-text-2)' : 'var(--hp-text)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: '15px', fontWeight: 700 }}>{a.nome}</div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>{a.lote}</div>
        </div>
        <EstadoPill estado={a.estado} curto />
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px', marginTop: '16px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Ar agora</div>
          <div style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
            {perdido ? '—' : fmtNum(a.temp)} °C
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>{textoApoio(a)}</div>
        </div>
        <Sparkline pontos={sparkPontos(a.pico, a.hoje, a.id === 'a1' ? 0 : -0.3)} largura={132} altura={44} limite={a.limite} semSinal={perdido} />
      </div>
      <div style={{ ...sobrelinha, marginTop: '16px' }}>MODO</div>
      <div style={{ marginTop: '6px' }}>
        <ModoSegmentado modo={a.modo} podeEditar={tecnico} aoEscolher={aoEscolherModo} rotulo={'Modo de ' + a.nome} />
      </div>
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
        <BotaoAtuador a={a} aoLigar={aoLigar} aoDesligar={aoDesligar} />
      </div>
    </article>
  );
}
