// apps/web/src/components/automacao/data/automacaoMock.ts
// Dados de exemplo da Automação. Limites provisórios: uva 35 °C, manga 36 °C
// (o exemplo do Lote A1 usa 35 °C, como no texto do evento); o limite sobe
// 1 °C quando a umidade do ar passa de 60 %. Valores ainda sem validação
// agronômica.
// TODO: substituir por dado real da API
import type { Atuador, AutomacaoSnapshot, Evento, FormRegra, Kit, Regra } from '../types';

export const FORM_PADRAO: FormRegra = { limite: 35, dur: 10, solo: 35, ini: 6, on: 15, off: 15, ciclos: 4, prazo: 15 };

export function fraseDaRegra(f: FormRegra): string {
  return `Se o ar ficar ≥ ${f.limite} °C por ${f.dur} min e o solo estiver abaixo de ${f.solo} %, pulsar ${f.on} min ligado / ${f.off} min desligado, até ${f.ciclos} ciclos.`;
}

export const REGRAS: Regra[] = [
  {
    id: 'r1', frase: fraseDaRegra(FORM_PADRAO),
    alvo: 'Setores A1 e C3 · pede aprovação · prazo de 15 min', ativa: true, form: { ...FORM_PADRAO },
  },
  { id: 'r2', frase: 'Se o solo ficar abaixo de 20 %, ligar por 20 min, entre 17h e 6h.', alvo: 'Setor B2 · automático', ativa: true },
  { id: 'r3', frase: 'Se o ar ficar ≥ 38 °C por 5 min, ligar 15 min sem pedir aprovação.', alvo: 'Todos os setores · automático', ativa: false },
];

export const ATUADORES: Atuador[] = [
  { id: 'a1', nome: 'Aspersor · Setor A1', lote: 'Lote A1 · Manga Tommy Atkins', kit: 'IOT-001', modo: 'aprovacao', estado: 'desligado', restante: 0, temp: 34.7, pico: 37.8, hoje: true, regraId: 'r1', limite: 35 },
  { id: 'c3', nome: 'Aspersor · Setor C3', lote: 'Lote C3 · Uva Crimson', kit: 'IOT-002', modo: 'aprovacao', estado: 'aguardando', restante: 0, temp: 35.8, pico: 36.4, hoje: false, regraId: 'r1', limite: 35 },
  { id: 'b2', nome: 'Válvula · Setor B2', lote: 'Lote B2 · Uva Itália', kit: 'IOT-003', modo: 'manual', estado: 'ligado', restante: 11, temp: 33.1, pico: 34.2, hoje: false, regraId: 'r2', limite: 35 },
];

export const KITS: Kit[] = [
  { id: 'IOT-001', atuadorId: 'a1', lote: 'Lote A1 · Manga Tommy Atkins', sinal: 'há 2 min', bateria: 86, wifi: -61, firmware: 'v1.4.2', pico: 37.8 },
  { id: 'IOT-002', atuadorId: 'c3', lote: 'Lote C3 · Uva Crimson', sinal: 'há 1 min', bateria: 72, wifi: -68, firmware: 'v1.4.2', pico: 36.4 },
  { id: 'IOT-003', atuadorId: 'b2', lote: 'Lote B2 · Uva Itália', sinal: 'há 3 min', bateria: 41, wifi: -74, firmware: 'v1.3.9', pico: 34.2 },
];

type Linha = [string, Evento['tipo'], Evento['setor'], string, Evento['origem']];
const LINHAS: Linha[] = [
  ['15h04', 'aviso', 'C3', '35,8 °C há 10 min (limite 35 °C), solo 24,1 %', 'regra'],
  ['15h01', 'ligou', 'B2', 'Ligado manualmente por 15 min', 'técnico'],
  ['14h54', 'gatilho', 'C3', 'Ar passou de 35 °C', 'firmware'],
  ['14h40', 'desligou', 'A1', 'Ciclo concluído · ar caiu para 34,7 °C', 'regra'],
  ['14h25', 'desligou', 'A1', 'Pausa do pulso · 15 min desligado', 'regra'],
  ['14h10', 'ligou', 'A1', 'Pulso 2 de 4 · ar ainda em 36,9 °C', 'regra'],
  ['13h40', 'ligou', 'A1', 'Aspersor ligado por 15 min', 'regra'],
  ['13h31', 'aprovado', 'A1', 'Aprovado pelo proprietário', 'proprietário'],
  ['13h28', 'aviso', 'A1', '36,4 °C há 10 min (limite 35 °C), solo 22,4 %', 'regra'],
  ['13h18', 'gatilho', 'A1', 'Ar passou de 35 °C', 'firmware'],
  ['12h52', 'bloqueado', 'B2', 'Solo em 41,0 %, acima do bloqueio de 35 %', 'regra'],
  ['09h14', 'expirou', 'C3', 'Aviso não respondido em 15 min', 'regra'],
  ['07h30', 'falha', 'B2', 'Válvula não confirmou abertura · nova tentativa ok', 'firmware'],
];
export const EVENTOS: Evento[] = LINHAS.map((l, i) => ({ id: 'e' + i, h: l[0], tipo: l[1], setor: l[2], motivo: l[3], origem: l[4] }));

/** ids dos eventos do dia do Lote A1 usados como marcadores no gráfico */
export const MARCADORES_A1: { h: number; icone: string; rotulo: string; tom: 'at' | 'ac' | 'in' | 'tx'; eventoId: string }[] = [
  { h: 13.3, icone: 'bolt', rotulo: 'Gatilho · 13h18', tom: 'at', eventoId: 'e9' },
  { h: 13.467, icone: 'notifications', rotulo: 'Aviso enviado · 13h28', tom: 'at', eventoId: 'e8' },
  { h: 13.517, icone: 'check_circle', rotulo: 'Aprovado · 13h31', tom: 'ac', eventoId: 'e7' },
  { h: 13.667, icone: 'water_drop', rotulo: 'Ligou · 13h40', tom: 'in', eventoId: 'e6' },
  { h: 14.667, icone: 'format_color_reset', rotulo: 'Desligou · 14h40', tom: 'tx', eventoId: 'e3' },
];

export const AVISO_INICIAL = { atuadorId: 'c3' as const, lote: 'Lote C3', temp: '35,8', limite: '35', solo: '24,1', seg: 14 * 60 };

export function instantaneoInicial(): AutomacaoSnapshot {
  return {
    atuadores: ATUADORES.map((a) => ({ ...a })),
    regras: REGRAS.map((r) => ({ ...r, form: r.form ? { ...r.form } : undefined })),
    eventos: EVENTOS.map((e) => ({ ...e })),
    kits: KITS.map((k) => ({ ...k })),
    aviso: { ...AVISO_INICIAL },
  };
}
