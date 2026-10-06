// src/features/clima/components/PrevisaoRegua.tsx
// Régua horizontal de previsão de N dias, reaproveitada pela tela de Clima
// Regional e pela aba "Previsão" do Detalhe do Lote.
//
// Redesign v2 · direção "1b Campo" (aprovada, ver especificacao.md/APLICAR.md
// do pacote de redesign): cabeçalho de dias com borda superior nos dias de
// risco, depois o gráfico (faixa ideal sombreada, limite tracejado em
// crítico, máxima em --hp-temp, mínima em --hp-temp-min, ponto crítico só
// acima do limite com o valor rotulado), depois as barras de chuva
// separadas do gráfico, alinhadas às mesmas colunas de dia.
import { fmtNum } from '@/lib/uiHelpers';
import type { FaixaIdealCultura, PrevisaoDiaria } from '../data/previsaoMock';

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const COL_LEGENDA = 40;
const COL_DIA = 64;

function formatDiaCurto(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return DIAS_SEMANA[d.getDay()];
}

function formatDataCurta(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

interface PrevisaoReguaProps {
  dias: PrevisaoDiaria[];
  faixaIdeal: FaixaIdealCultura;
}

export default function PrevisaoRegua({ dias, faixaIdeal }: PrevisaoReguaProps) {
  const diasRisco = dias.filter((d) => d.temperaturaMax > faixaIdeal.max).length;
  const proximaChuva = dias.find((d) => d.chanceChuvaPercentual >= 40);

  // --- escala do gráfico SVG: uma coluna de largura fixa por dia, para
  // ficar alinhado ao cabeçalho de dias e às barras de chuva abaixo ---
  const largura = COL_LEGENDA + dias.length * COL_DIA;
  const topY = 24;
  const bottomY = 150;
  const temps = dias.flatMap((d) => [d.temperaturaMax, d.temperaturaMin]);
  const minTemp = Math.min(...temps, faixaIdeal.max) - 2;
  const maxTemp = Math.max(...temps, faixaIdeal.max) + 2;
  const yScale = (t: number) => topY + ((maxTemp - t) / (maxTemp - minTemp)) * (bottomY - topY);
  const xScale = (i: number) => COL_LEGENDA + i * COL_DIA + COL_DIA / 2;

  const pontosMax = dias.map((d, i) => `${xScale(i)},${yScale(d.temperaturaMax)}`).join(' ');
  const pontosMin = dias.map((d, i) => `${xScale(i)},${yScale(d.temperaturaMin)}`).join(' ');
  const yLimite = yScale(faixaIdeal.max);

  return (
    <div>
      <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginBottom: '10px' }}>
        {diasRisco > 0 ? (
          <span>
            <span style={{ color: 'var(--hp-critico)', fontWeight: 600 }}>
              {diasRisco} {diasRisco === 1 ? 'dia' : 'dias'} acima de {faixaIdeal.max} °C
            </span>{' '}
            nesta janela — limite da {faixaIdeal.cultura.toLowerCase()}
            {proximaChuva ? ` · chuva relevante em ${formatDiaCurto(proximaChuva.data)}` : ''}
          </span>
        ) : (
          <span>Sem dias acima de {faixaIdeal.max} °C ({faixaIdeal.cultura}) nesta janela</span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '14px', fontSize: '12px', color: 'var(--hp-text-2)', marginBottom: '10px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '2px', background: 'var(--hp-temp)', display: 'block' }} />
          Máxima
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '2px', background: 'var(--hp-temp-min)', display: 'block' }} />
          Mínima
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '14px', height: '8px', background: 'var(--hp-accent-band)', border: '1px solid var(--hp-border)', display: 'block' }} />
          Faixa ideal
        </span>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
        <div style={{ width: `${largura}px` }}>
          {/* cabeçalho de dias — borda superior crítica nos dias de risco */}
          <div style={{ display: 'grid', gridTemplateColumns: `${COL_LEGENDA}px repeat(${dias.length}, ${COL_DIA}px)` }}>
            <div />
            {dias.map((d, i) => {
              const risco = d.temperaturaMax > faixaIdeal.max;
              return (
                <div
                  key={d.data}
                  style={{
                    textAlign: 'center',
                    padding: '6px 0',
                    borderTop: risco ? '3px solid var(--hp-critico)' : '3px solid transparent',
                  }}
                >
                  <div style={{ fontSize: '12px', fontWeight: 700 }}>{i === 0 ? 'Hoje' : formatDiaCurto(d.data)}</div>
                  <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>{formatDataCurta(d.data)}</div>
                </div>
              );
            })}
          </div>

          {/* gráfico: faixa ideal sombreada, limite tracejado, máxima e mínima */}
          <svg viewBox={`0 0 ${largura} 170`} style={{ width: `${largura}px`, height: '170px', overflow: 'visible' }}>
            <rect x={COL_LEGENDA} y={yLimite} width={largura - COL_LEGENDA} height={bottomY - yLimite} fill="var(--hp-accent-band)" />
            <line x1={COL_LEGENDA} y1={yLimite} x2={largura} y2={yLimite} stroke="var(--hp-critico)" strokeWidth={1} strokeDasharray="4 4" />
            <text x={COL_LEGENDA + 4} y={yLimite - 6} style={{ font: '600 12px Inter, sans-serif', fill: 'var(--hp-critico)' }}>
              limite {faixaIdeal.cultura.toLowerCase()} {faixaIdeal.max} °C
            </text>
            <polygon points={`${pontosMax} ${xScale(dias.length - 1)},${bottomY} ${xScale(0)},${bottomY}`} fill="var(--hp-area)" />
            <polyline points={pontosMin} fill="none" stroke="var(--hp-temp-min)" strokeWidth={2} strokeLinejoin="round" />
            <polyline points={pontosMax} fill="none" stroke="var(--hp-temp)" strokeWidth={2.5} strokeLinejoin="round" />
            {dias.map((d, i) =>
              d.temperaturaMax > faixaIdeal.max ? (
                <g key={d.data}>
                  <circle cx={xScale(i)} cy={yScale(d.temperaturaMax)} r={5} fill="var(--hp-critico)" stroke="var(--hp-surface)" strokeWidth={2} />
                  <text x={xScale(i)} y={yScale(d.temperaturaMax) - 10} textAnchor="middle" style={{ font: '700 12px Inter, sans-serif', fill: 'var(--hp-critico)' }}>
                    {fmtNum(d.temperaturaMax, 0)}°
                  </text>
                </g>
              ) : null
            )}
          </svg>

          {/* barras de chuva — separadas do gráfico, mesma coluna de cada dia */}
          <div style={{ display: 'grid', gridTemplateColumns: `${COL_LEGENDA}px repeat(${dias.length}, ${COL_DIA}px)`, alignItems: 'end', height: '56px', marginTop: '4px' }}>
            <div style={{ fontSize: '12px', color: 'var(--hp-text-3)', alignSelf: 'center' }}>Chuva</div>
            {dias.map((d) => {
              const forte = d.chanceChuvaPercentual >= 50;
              return (
                <div key={d.data} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div
                    style={{
                      width: '20px',
                      height: `${Math.max(d.chanceChuvaPercentual, 4) * 0.4}px`,
                      borderRadius: '3px',
                      background: 'var(--hp-info)',
                      opacity: forte ? 1 : 0.5,
                    }}
                  />
                  <span style={{ fontSize: '12px', fontWeight: forte ? 700 : 400, color: forte ? 'var(--hp-info)' : 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                    {d.chanceChuvaPercentual} %
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
