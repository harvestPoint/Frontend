// apps/web/src/components/automacao/data/porque.ts
// Monta o conteúdo de "Por que isso aconteceu" a partir de um evento.
// O dia do Lote A1 tem a explicação completa (condições, bloqueios e
// antes/depois); os demais eventos mostram o resumo.
// TODO: substituir por dado real da API (a decisão e as condições avaliadas
// devem vir gravadas junto com cada evento).
import type { Evento, Regra } from '../types';

export type TomVerificacao = 'ok' | 'bloqueio' | 'info';
export interface Verificacao { icone: string; tom: TomVerificacao; texto: string }
export interface PorQue {
  titulo: string; sub: string; completo: boolean;
  leitura: string; regra: string; decisao: string; verificacoes: Verificacao[];
}

const ok = (texto: string, icone = 'check_circle'): Verificacao => ({ icone, tom: 'ok', texto });

export function montarPorQue(e: Evento, rotuloTipo: string, regras: Regra[]): PorQue {
  const frase = (id: string) => regras.find((r) => r.id === id)?.frase ?? '';
  const completo = e.setor === 'A1' && ['gatilho', 'aviso', 'aprovado', 'ligou', 'desligou'].includes(e.tipo);
  if (completo) {
    return {
      titulo: `${rotuloTipo} · Setor A1 · ${e.h}`, sub: e.motivo, completo: true,
      leitura: '36,4 °C há 10 min às 13h28 · umidade do ar 52,1 % · solo 22,4 %',
      regra: frase('r1'),
      decisao: 'Aprovado por Abraão Freitas (proprietário) às 13h31, 3 min depois do aviso. Resultado: −3,1 °C em 40 min.',
      verificacoes: [
        ok('Ar ≥ 35 °C por 10 min: 36,4 °C desde 13h18'),
        ok('Solo abaixo de 35 %: 22,4 %'),
        ok('Janela de horário 06h–20h: dentro'),
        ok('Bloqueio por solo úmido: solo em 22,4 %, abaixo do bloqueio de 35 %, liberado', 'lock_open'),
        ok('Kit IOT-001 on-line, bateria em 86 %'),
      ],
    };
  }
  const verificacoes: Verificacao[] =
    e.tipo === 'bloqueado'
      ? [
          ok('Ar ≥ 35 °C por 10 min: atendido'),
          { icone: 'block', tom: 'bloqueio', texto: 'Bloqueio por solo úmido: solo em 41,0 %, acima do bloqueio de 35 %. Aspersor não ligou.' },
        ]
      : e.tipo === 'falha'
        ? [
            { icone: 'error', tom: 'bloqueio', texto: 'Válvula não confirmou abertura em 30 s' },
            ok('Segunda tentativa confirmada pelo firmware'),
          ]
        : [ok(e.motivo), { icone: 'info', tom: 'info', texto: 'Registrado na linha do tempo do setor ' + e.setor }];
  return {
    titulo: `${rotuloTipo} · Setor ${e.setor} · ${e.h}`, sub: e.motivo, completo: false,
    leitura: e.tipo === 'bloqueado' ? 'Ar em 35,4 °C há 10 min · solo 41,0 %' : e.motivo,
    regra: frase(e.setor === 'B2' ? 'r2' : 'r1'),
    decisao: 'Origem: ' + e.origem,
    verificacoes,
  };
}
