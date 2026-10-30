// apps/web/src/components/automacao/EstadoPill.tsx
import type { EstadoAtuador } from './types';
import { Icone, Pilula } from './ui';

export const ESTADOS: Record<EstadoAtuador, { rotulo: string; icone: string; fg: string; bg: string }> = {
  desligado: { rotulo: 'Desligado', icone: 'format_color_reset', fg: 'var(--hp-text-2)', bg: 'var(--hp-surface-2)' },
  ligado: { rotulo: 'Ligado', icone: 'water_drop', fg: 'var(--hp-info)', bg: 'var(--hp-info-bg)' },
  aguardando: { rotulo: 'Aguardando aprovação', icone: 'hourglass_top', fg: 'var(--hp-atencao)', bg: 'var(--hp-atencao-bg)' },
  pausa: { rotulo: 'Em pausa', icone: 'pause_circle', fg: 'var(--hp-text-2)', bg: 'var(--hp-surface-2)' },
  // texto em text-2 (e não text-3) para manter contraste AA no fundo cinza
  semsinal: { rotulo: 'Sem sinal', icone: 'signal_disconnected', fg: 'var(--hp-text-2)', bg: 'var(--hp-surface-2)' },
  falha: { rotulo: 'Falha', icone: 'error', fg: 'var(--hp-critico)', bg: 'var(--hp-critico-bg)' },
};

/** `curto` encurta "Aguardando aprovação" nos cartões estreitos (o aviso acima já explica). */
export default function EstadoPill({ estado, curto }: { estado: EstadoAtuador; curto?: boolean }) {
  const e = ESTADOS[estado];
  return (
    <Pilula fg={e.fg} bg={e.bg}>
      <Icone nome={e.icone} tamanho={15} />
      {curto && estado === 'aguardando' ? 'Aguardando' : e.rotulo}
    </Pilula>
  );
}
