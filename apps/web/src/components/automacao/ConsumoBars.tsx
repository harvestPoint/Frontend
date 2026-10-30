// apps/web/src/components/automacao/ConsumoBars.tsx
// Minutos ligado por dia nos últimos 7 dias (viewBox 420×150, barra de 40 px).
import { CONSUMO_7D, LITROS_POR_MIN } from './data/curvas';

export const consumoTotal = CONSUMO_7D.reduce((a, c) => a + c[0], 0);
export const consumoTexto = `${consumoTotal} min · ≈ ${(consumoTotal * LITROS_POR_MIN).toLocaleString('pt-BR')} L`;

export default function ConsumoBars() {
  return (
    <svg viewBox="0 0 420 150" style={{ width: '100%', height: '150px', marginTop: '8px', display: 'block' }} role="img"
      aria-label={'Minutos ligado por dia: ' + CONSUMO_7D.map((c) => c[1] + ' ' + c[0]).join(', ')}>
      {CONSUMO_7D.map((c, i) => {
        const h = (c[0] / 90) * 100;
        return (
          <g key={c[1]}>
            <rect x={10 + i * 58} y={126 - h} width="40" height={h} rx="4" fill="var(--hp-info)" opacity={i === 6 ? 1 : 0.55} />
            <text x={30 + i * 58} y={120 - h} textAnchor="middle" style={{ font: '600 12px Inter, sans-serif', fill: 'var(--hp-text)' }}>{c[0] + ' min'}</text>
            <text x={30 + i * 58} y="146" textAnchor="middle" style={{ font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)' }}>{c[1]}</text>
          </g>
        );
      })}
    </svg>
  );
}
