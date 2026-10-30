// apps/web/src/components/automacao/AutomacaoChart.tsx
// Gráfico principal (SVG à mão, sem biblioteca): temperatura do ar no eixo
// esquerdo (20–40 °C), umidade do ar e do solo no direito (0–100 %), limite
// tracejado, pontos críticos, faixas "aspersor ligado" e marcadores de evento.
// Mouse: linha vertical + tooltip. Clique: popover do ponto (ou "Por que isso
// aconteceu" se cair numa faixa azul). Teclado: setas e Enter.
import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { fmtNum } from '@/lib/uiHelpers';
import { MARCADORES_A1 } from './data/automacaoMock';
import { DIAS, FAIXAS_LIGADO, GRAF, hhmm, serie, yPct, yTemp } from './data/curvas';
import type { FaixaGrafico } from './types';
import { Botao, FONTE_TITULO, Icone, cartao, somenteLeitor, TONS } from './ui';

const { W, H, PL, PR, PT, PB, LIM } = GRAF;
const AREA_W = W - PL - PR;
const FAIXAS: [FaixaGrafico, string][] = [['6h', '6 h'], ['24h', '24 h'], ['7d', '7 dias']];

const rotuloEixo: React.CSSProperties = { font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)' };

interface Props {
  semSinal: boolean;
  aoAbrirEvento: (eventoId: string) => void;
}

export default function AutomacaoChart({ semSinal, aoAbrirEvento }: Props) {
  const [faixa, setFaixa] = useState<FaixaGrafico>('24h');
  const [hover, setHover] = useState<number | null>(null);
  const [pop, setPop] = useState<number | null>(null);
  const [tabela, setTabela] = useState(false);

  const pts = useMemo(() => serie(faixa), [faixa]);
  const n = pts.length;
  const xs = (i: number) => PL + (i / (n - 1)) * AREA_W;
  const a0 = faixa === '6h' ? 10 : 0;
  const a1 = faixa === '6h' ? 16 : 24;
  const xh = (h: number) => PL + ((h - a0) / (a1 - a0)) * AREA_W;
  const is7d = faixa === '7d';

  useEffect(() => {
    if (pop == null) return;
    const esc = (e: globalThis.KeyboardEvent) => { if (e.key === 'Escape') setPop(null); };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [pop]);

  const corte = semSinal && !is7d ? pts.findIndex((q) => q.h > 14.9) : -1;
  const solido = corte > 0 ? pts.slice(0, corte + 1) : pts;
  const linha = (arr: typeof pts, f: (q: (typeof pts)[number]) => number) =>
    arr.map((q, i) => xs(i).toFixed(1) + ',' + f(q).toFixed(1)).join(' ');
  const passo = faixa === '6h' ? 2 : faixa === '24h' ? 3 : 1;
  const criticos = solido
    .map((q, i) => ({ q, i }))
    .filter(({ q, i }) => q.t >= LIM && i % passo === 0)
    .map(({ q, i }) => ({ x: xs(i), y: yTemp(q.t) }));

  const rotulosX: { x: number; l: string }[] = [];
  if (is7d) for (let d = 0; d < 7; d++) rotulosX.push({ x: xs(d * 24 + 12), l: DIAS[d] + (d === 6 ? ' (hoje)' : '') });
  else for (let h = a0; h <= a1; h += faixa === '6h' ? 1 : 3) rotulosX.push({ x: xh(h), l: hhmm(h) });

  const faixasLigado = is7d ? [] : FAIXAS_LIGADO.filter((b) => b[1] > a0 && b[0] < a1);
  const marcadores = is7d ? [] : MARCADORES_A1;
  const ticks = [40, 35, 30, 25, 20].map((t, i) => ({ y: yTemp(t), t: t + ' °C', r: [100, 75, 50, 25, 0][i] + ' %' }));

  const indiceDe = (e: MouseEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    return Math.max(0, Math.min(n - 1, Math.round(((x - PL) / AREA_W) * (n - 1))));
  };
  const aoClicar = (e: MouseEvent<SVGSVGElement>) => {
    const i = indiceDe(e);
    const h = pts[i].h;
    if (!is7d && FAIXAS_LIGADO.some((b) => h >= b[0] - 0.02 && h <= b[1] + 0.02)) { setPop(null); aoAbrirEvento('e6'); }
    else setPop(i);
  };
  const aoTeclar = (e: KeyboardEvent<SVGSVGElement>) => {
    const atual = hover == null ? Math.floor(n / 2) : hover;
    if (e.key === 'ArrowRight') { e.preventDefault(); setHover(Math.min(n - 1, atual + 1)); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); setHover(Math.max(0, atual - 1)); }
    else if (e.key === 'Enter') { e.preventDefault(); setPop(atual); }
  };

  const hv = hover != null && hover < n ? pts[hover] : null;
  const hx = hover != null ? xs(hover) : 0;
  const virar = hx / W > 0.7;
  const pq = pop != null && pop < n ? pts[pop] : null;
  const px = pop != null ? (xs(pop) / W) * 100 : 0;
  const trocarFaixa = (f: FaixaGrafico) => { setFaixa(f); setHover(null); setPop(null); };
  const aria = 'Gráfico do Lote A1: temperatura do ar, umidade do ar e do solo. ' +
    (is7d ? 'Últimos 7 dias.' : 'Pico de 37,8 °C às 14h, aspersor ligado das 13h40 às 14h40 e queda de 3,1 °C em 40 minutos.') +
    ' Use as setas para percorrer os pontos e Enter para abrir o ponto.';

  const legenda = (tracejado: React.CSSProperties, texto: string) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={tracejado} />{texto}</span>
  );

  return (
    <div style={cartao}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: FONTE_TITULO, fontSize: '17px', lineHeight: '24px', fontWeight: 700 }}>Lote A1 · temperatura, umidade e acionamentos</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', flexWrap: 'wrap', fontSize: '12px', color: 'var(--hp-text-2)' }}>
            {legenda({ width: '14px', height: '3px', borderRadius: '2px', background: 'var(--hp-temp)' }, 'Temperatura do ar (°C, eixo esquerdo)')}
            {legenda({ width: '14px', height: 0, borderTop: '2px dashed var(--hp-umid-ar)' }, 'Umidade do ar (%, eixo direito)')}
            {legenda({ width: '14px', height: 0, borderTop: '2px dotted var(--hp-umid-solo)' }, 'Umidade do solo (%, eixo direito)')}
            {legenda({ width: '12px', height: '10px', borderRadius: '2px', background: 'var(--hp-faixa-aspersor)', border: '1px solid var(--hp-info)' }, 'Aspersor ligado')}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button type="button" className="au-btn" onClick={() => { setTabela((v) => !v); setPop(null); }}
            style={{ border: 0, background: 'transparent', fontSize: '13px', fontWeight: 600, color: 'var(--hp-accent-hover)', padding: '6px 4px' }}>
            {tabela ? 'Ver gráfico' : 'Ver dados em tabela'}
          </button>
          <div role="radiogroup" aria-label="Período do gráfico" style={{ display: 'flex', padding: '3px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-surface-2)', gap: '2px' }}>
            {FAIXAS.map(([k, l]) => (
              <button key={k} type="button" role="radio" aria-checked={faixa === k} className="au-btn" onClick={() => trocarFaixa(k)}
                style={{ height: '32px', padding: '0 12px', borderRadius: '10px', border: 0, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', background: faixa === k ? 'var(--hp-surface)' : 'transparent', color: faixa === k ? 'var(--hp-text)' : 'var(--hp-text-2)', boxShadow: faixa === k ? '0 1px 2px rgba(34,31,24,.08)' : 'none' }}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!tabela && (
        <div className="au-scroll-x" style={{ marginTop: '12px' }}>
          <div style={{ position: 'relative', minWidth: '720px' }}>
            <svg
              className="au-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={aria} tabIndex={0}
              style={{ width: '100%', height: 'auto', aspectRatio: `${W} / ${H}`, display: 'block', cursor: 'crosshair', outline: 'none' }}
              onMouseMove={(e) => { const i = indiceDe(e); if (i !== hover) setHover(i); }}
              onMouseLeave={() => setHover(null)} onClick={aoClicar} onKeyDown={aoTeclar}
            >
              {ticks.map((t) => (
                <g key={t.t}>
                  <line x1={PL} y1={t.y} x2={W - PR} y2={t.y} stroke="var(--hp-border)" strokeWidth="1" />
                  <text x={PL - 8} y={t.y + 4} textAnchor="end" style={rotuloEixo}>{t.t}</text>
                  <text x={W - PR + 8} y={t.y + 4} style={rotuloEixo}>{t.r}</text>
                </g>
              ))}
              {faixasLigado.map((b) => (
                <rect key={b[0]} x={xh(b[0])} y={PT} width={xh(b[1]) - xh(b[0])} height={H - PT - PB} fill="var(--hp-faixa-aspersor)" stroke="var(--hp-info)" strokeOpacity=".35" />
              ))}
              {faixasLigado.length > 0 && (
                <text x={xh(faixasLigado[0][0]) + 2} y={34} style={{ font: '600 12px Inter, sans-serif', fill: 'var(--hp-info)' }}>Aspersor ligado</text>
              )}
              <line x1={PL} y1={yTemp(LIM)} x2={W - PR} y2={yTemp(LIM)} stroke="var(--hp-critico)" strokeWidth="1.5" strokeDasharray="6 5" />
              <text x={PL + 4} y={yTemp(LIM) - 6} style={{ font: '600 12px Inter, sans-serif', fill: 'var(--hp-critico)' }}>limite 35 °C</text>
              <polyline points={linha(pts, (q) => yPct(q.solo))} fill="none" stroke="var(--hp-umid-solo)" strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
              <polyline points={linha(pts, (q) => yPct(q.ar))} fill="none" stroke="var(--hp-umid-ar)" strokeWidth="2" strokeDasharray="7 5" />
              <polyline points={linha(solido, (q) => yTemp(q.t))} fill="none" stroke="var(--hp-temp)" strokeWidth="2.5" strokeLinejoin="round" />
              {corte > 0 && (
                <polyline points={`${xs(corte).toFixed(1)},${yTemp(pts[corte].t).toFixed(1)} ${xs(n - 1).toFixed(1)},${yTemp(pts[corte].t).toFixed(1)}`} fill="none" stroke="var(--hp-text-3)" strokeWidth="2.5" strokeDasharray="3 6" />
              )}
              {criticos.map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r="4.5" fill="var(--hp-critico)" stroke="var(--hp-surface)" strokeWidth="2" />
              ))}
              {rotulosX.map((x) => (
                <text key={x.l + x.x} x={x.x} y={H - 10} textAnchor="middle" style={rotuloEixo}>{x.l}</text>
              ))}
              {hv && (
                <g>
                  <line x1={hx} y1={PT} x2={hx} y2={H - PB} stroke="var(--hp-text-3)" strokeWidth="1" />
                  <circle cx={hx} cy={yTemp(hv.t)} r="5" fill="var(--hp-temp)" stroke="var(--hp-surface)" strokeWidth="2" />
                </g>
              )}
            </svg>

            {marcadores.map((m, i) => {
              const [fg, bg] = TONS[m.tom];
              // três fileiras: os eventos das 13h18 às 13h40 caem a poucos pixels uns dos outros
              const y = [218, 242, 266][i % 3];
              return (
                <button
                  key={m.eventoId} type="button" title={m.rotulo} aria-label={m.rotulo} onClick={() => aoAbrirEvento(m.eventoId)}
                  className="au-btn"
                  style={{ position: 'absolute', left: `calc(${((xh(m.h) / W) * 100).toFixed(2)}% - 12px)`, top: `calc(${((y / H) * 100).toFixed(2)}% - 12px)`, width: '24px', height: '24px', borderRadius: '12px', background: bg, color: fg, border: '1px solid var(--hp-surface)', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}
                >
                  <Icone nome={m.icone} tamanho={14} />
                </button>
              );
            })}

            {hv && !pq && (
              <div
                style={{ position: 'absolute', top: '8px', ...(virar ? { right: `calc(${(100 - (hx / W) * 100).toFixed(2)}% + 14px)` } : { left: `calc(${((hx / W) * 100).toFixed(2)}% + 14px)` }), padding: '10px 12px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', boxShadow: '0 8px 24px rgba(34,31,24,.14)', pointerEvents: 'none', minWidth: '180px', zIndex: 3 }}
              >
                <div style={{ fontSize: '12px', fontWeight: 700 }}>{hv.label}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', gap: '2px 14px', marginTop: '6px', fontSize: '12px', fontVariantNumeric: 'tabular-nums' }}>
                  <span style={{ color: 'var(--hp-text-2)' }}>Ar</span><span style={{ fontWeight: 600, textAlign: 'right', color: 'var(--hp-temp)' }}>{fmtNum(hv.t)} °C</span>
                  <span style={{ color: 'var(--hp-text-2)' }}>Umidade do ar</span><span style={{ fontWeight: 600, textAlign: 'right' }}>{fmtNum(hv.ar)} %</span>
                  <span style={{ color: 'var(--hp-text-2)' }}>Solo</span><span style={{ fontWeight: 600, textAlign: 'right' }}>{fmtNum(hv.solo)} %</span>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--hp-text-3)', marginTop: '6px' }}>Clique para ver a leitura</div>
              </div>
            )}

            {pq && (
              <div
                role="dialog" aria-label={'Leitura de ' + pq.label} onClick={(e) => e.stopPropagation()}
                style={{ position: 'absolute', top: '30px', ...(px > 65 ? { right: `calc(${(100 - px).toFixed(2)}% + 12px)` } : { left: `calc(${px.toFixed(2)}% + 12px)` }), width: '280px', padding: '16px', borderRadius: 'var(--hp-radius)', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', boxShadow: '0 12px 32px rgba(34,31,24,.18)', zIndex: 4, animation: 'hpIn 150ms ease-out' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700 }}>{pq.label} · IOT-001</span>
                  <button type="button" aria-label="Fechar leitura" className="au-btn" onClick={() => setPop(null)}
                    style={{ border: 0, background: 'transparent', padding: 2, display: 'flex', color: 'var(--hp-text-2)' }}>
                    <Icone nome="close" tamanho={18} />
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
                  {[['Ar', fmtNum(pq.t) + ' °C'], ['Umidade do ar', fmtNum(pq.ar) + ' %'], ['Solo', fmtNum(pq.solo) + ' %'], ['Bateria do kit', '86 %']].map(([r, v]) => (
                    <div key={r}>
                      <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>{r}</div>
                      <div style={{ fontSize: '18px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '14px' }}>
                  <Botao bloco altura={36} onClick={() => { setPop(null); aoAbrirEvento('e6'); }}>Ver evento</Botao>
                </div>
              </div>
            )}
            <div aria-live="polite" style={somenteLeitor}>
              {hv ? `${hv.label}: ar ${fmtNum(hv.t)} graus, umidade do ar ${fmtNum(hv.ar)} por cento, solo ${fmtNum(hv.solo)} por cento` : ''}
            </div>
          </div>
        </div>
      )}

      {tabela && (
        <div style={{ marginTop: '12px', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius-sm)', overflow: 'hidden', maxHeight: '300px', overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
            <caption style={somenteLeitor}>Leituras do Lote A1 a cada hora</caption>
            <thead>
              <tr style={{ background: 'var(--hp-surface-2)', fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                <th scope="col" style={{ textAlign: 'left', padding: '10px 16px' }}>HORÁRIO</th>
                <th scope="col" style={{ textAlign: 'right', padding: '10px 16px' }}>AR °C</th>
                <th scope="col" style={{ textAlign: 'right', padding: '10px 16px' }}>UMIDADE DO AR %</th>
                <th scope="col" style={{ textAlign: 'right', padding: '10px 16px' }}>SOLO %</th>
              </tr>
            </thead>
            <tbody>
              {pts.filter((_, i) => i % 6 === 0).map((q) => (
                <tr key={q.label} style={{ borderTop: '1px solid var(--hp-border)', fontSize: '13px' }}>
                  <td style={{ padding: '9px 16px' }}>{q.label}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right' }}>{fmtNum(q.t)}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right' }}>{fmtNum(q.ar)}</td>
                  <td style={{ padding: '9px 16px', textAlign: 'right' }}>{fmtNum(q.solo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!is7d && (
        <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', borderTop: '1px solid var(--hp-border)', paddingTop: '12px', marginTop: '12px' }}>
          Pico de 37,8 °C às 14h00 · aspersor em pulsos de 15/15 min das 13h40 às 14h40 · <b style={{ color: 'var(--hp-text)' }}>−3,1 °C em 40 min</b> depois do acionamento.
        </div>
      )}
    </div>
  );
}
