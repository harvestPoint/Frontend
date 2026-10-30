// apps/web/src/components/automacao/data/curvas.ts
// Curvas simuladas do dia de exemplo (Lote A1): mínima de 22 °C, pico de
// 37,8 °C às 14h, aspersor das 13h40 às 14h40 em pulsos de 15/15 min.
// TODO: substituir por dado real da API (telemetria dos kits IoT).
import { fmtNum } from '@/lib/uiHelpers';
import type { FaixaGrafico } from '../types';

export const GRAF = { W: 1000, H: 280, PL: 48, PR: 52, PT: 20, PB: 36, TLO: 20, THI: 40, LIM: 35 } as const;
export const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
export const MAX_DIA = [36.4, 34.8, 37.1, 35.5, 33.9, 35.9, 37.8];
/** períodos (hora decimal) com o aspersor ligado: 13h40–13h55 e 14h10–14h25 */
export const FAIXAS_LIGADO: [number, number][] = [[13.667, 13.917], [14.167, 14.417]];

export const hhmm = (h: number): string => {
  const m = Math.round(h * 60);
  return String(Math.floor(m / 60) % 24).padStart(2, '0') + 'h' + String(m % 60).padStart(2, '0');
};
const ligadoEm = (h: number) => FAIXAS_LIGADO.some((b) => h >= b[0] && h < b[1]);

export function tempAr(h: number, pico: number, hoje: boolean): number {
  let t = 22 + (pico - 22) * Math.exp(-Math.pow((h - 14) / 2.1, 2));
  if (hoje && h > 14) t -= h < 14.667 ? (1.6 * (h - 14)) / 0.667 : 1.6 * Math.exp(-(h - 14.667) / 3);
  return t;
}
export const umidAr = (t: number, ligado: boolean) =>
  Math.max(30, Math.min(95, 88 - (t - 22) * 2.4 + (ligado ? 6 : 0)));
export function umidSolo(h: number, hoje: boolean): number {
  let s = 26 - h * 0.27;
  if (hoje && h >= 13.667) s += 12 * Math.min(1, h - 13.667) * Math.exp(-Math.max(0, h - 14.667) / 6);
  return s;
}

export interface Ponto { h: number; d: number; label: string; t: number; ar: number; solo: number }

export function serie(faixa: FaixaGrafico): Ponto[] {
  const p: Ponto[] = [];
  if (faixa === '7d') {
    for (let d = 0; d < 7; d++)
      for (let h = 0; h < 24; h++) {
        const hoje = d === 6;
        const t = tempAr(h, MAX_DIA[d], hoje);
        p.push({
          h, d, label: DIAS[d] + ' ' + hhmm(h), t,
          ar: umidAr(t, hoje && ligadoEm(h)),
          solo: hoje ? umidSolo(h, true) : 26 - h * 0.27 + (d % 2) * 3,
        });
      }
  } else {
    const a = faixa === '6h' ? 10 : 0;
    const b = faixa === '6h' ? 16 : 24;
    for (let i = 0; i <= (b - a) * 6; i++) {
      const h = a + i / 6;
      const t = tempAr(h, 37.8, true);
      p.push({ h, d: 6, label: 'Hoje ' + hhmm(h), t, ar: umidAr(t, ligadoEm(h)), solo: umidSolo(h, true) });
    }
  }
  return p;
}

export const yTemp = (t: number) =>
  GRAF.PT + ((GRAF.THI - t) / (GRAF.THI - GRAF.TLO)) * (GRAF.H - GRAF.PT - GRAF.PB);
export const yPct = (v: number) => GRAF.PT + ((100 - v) / 100) * (GRAF.H - GRAF.PT - GRAF.PB);

/** pontos do sparkline (viewBox 120×40) — janela de 6 h terminando ~15h10 */
export function sparkPontos(pico: number, hoje: boolean, desloc: number): string {
  let s = '';
  for (let i = 0; i <= 36; i++) {
    const h = 9.2 + desloc + i / 6;
    const t = tempAr(h, pico, hoje);
    s += ((i * 120) / 36).toFixed(1) + ',' + (4 + ((GRAF.THI - t) / (GRAF.THI - GRAF.TLO)) * 32).toFixed(1) + ' ';
  }
  return s.trim();
}
export const limiteSparkY = (limite: number = GRAF.LIM) => 4 + ((GRAF.THI - limite) / (GRAF.THI - GRAF.TLO)) * 32;

export interface Leitura { h: string; t: number; ar: number; solo: number; acima: boolean; tTxt: string; arTxt: string; soloTxt: string }
/** últimas 20 leituras (a cada 10 min) terminando às 15h10 */
export function ultimasLeituras(pico: number, hoje: boolean, limite = GRAF.LIM): Leitura[] {
  const r: Leitura[] = [];
  for (let i = 0; i < 20; i++) {
    const h = 15 + 10 / 60 - i / 6;
    const t = tempAr(h, pico, hoje);
    const ar = umidAr(t, hoje && ligadoEm(h));
    const solo = hoje ? umidSolo(h, true) : 26 - h * 0.27;
    r.push({ h: hhmm(h), t, ar, solo, acima: t >= limite, tTxt: fmtNum(t), arTxt: fmtNum(ar), soloTxt: fmtNum(solo) });
  }
  return r;
}

/** minutos ligado por dia nos últimos 7 dias (Dom → Sáb) */
export const CONSUMO_7D: [number, string][] = [[45, 'Dom'], [30, 'Seg'], [0, 'Ter'], [60, 'Qua'], [15, 'Qui'], [90, 'Sex'], [60, 'Sáb']];
export const LITROS_POR_MIN = 18;
