// apps/web/src/components/automacao/Sparkline.tsx
// Minigráfico de temperatura (viewBox 120×40) com o limite tracejado.
import { limiteSparkY } from './data/curvas';

interface SparklineProps {
  pontos: string;
  largura: number | string;
  altura: number;
  limite?: number | null;
  semSinal?: boolean;
  /** espessura do traço: 2 nos cards/tabela, 1,4 nos drawers */
  traco?: number;
  esticar?: boolean;
  rotulo?: string;
}

export default function Sparkline({ pontos, largura, altura, limite = 35, semSinal, traco = 2, esticar, rotulo }: SparklineProps) {
  const limY = limite == null ? null : limiteSparkY(limite);
  return (
    <svg
      viewBox="0 0 120 40" preserveAspectRatio={esticar ? 'none' : undefined}
      style={{ width: largura, height: altura + 'px', display: 'block', flexShrink: 0 }}
      role={rotulo ? 'img' : undefined} aria-label={rotulo} aria-hidden={rotulo ? undefined : true}
    >
      {limY != null && (
        <line x1="0" y1={limY} x2="120" y2={limY} stroke="var(--hp-critico)" strokeWidth={esticar ? 0.6 : 1} strokeDasharray={esticar ? '2 2' : '3 3'} />
      )}
      <polyline
        points={pontos} fill="none" stroke={semSinal ? 'var(--hp-text-3)' : 'var(--hp-temp)'}
        strokeWidth={traco} strokeDasharray={semSinal ? '3 4' : undefined} strokeLinejoin="round"
      />
    </svg>
  );
}
