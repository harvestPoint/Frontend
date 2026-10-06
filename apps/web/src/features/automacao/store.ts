// apps/web/src/features/automacao/store.ts
// Estado compartilhado da Automação (tela /automacao, card do Dashboard e
// drawer das Leituras leem o mesmo estado). É um store pequeno ligado ao
// React por useSyncExternalStore — sem biblioteca nova. Enquanto não existe
// backend, ele também faz o papel do "simulador": aprovar um aviso percorre
// ligar → pausa → ligar → desligar com a linha do tempo se atualizando.
// TODO: trocar por estado vindo da API/WebSocket; as ações continuam as mesmas.
import { useSyncExternalStore } from 'react';
import { enviarDesligar, enviarLigar, enviarModo, carregarAutomacao } from './api';
import { instantaneoInicial, fraseDaRegra } from './data/automacaoMock';
import { hhmm } from './data/curvas';
import type {
  AutomacaoState, Atuador, Evento, FormRegra, ModoAtuador, OrigemEvento, SetorId, TipoEvento,
} from './types';

export const MODOS: [ModoAtuador, string][] = [['automatico', 'Automático'], ['aprovacao', 'Aprovação'], ['manual', 'Manual']];
export const rotuloModo = (m: ModoAtuador) => MODOS.find((x) => x[0] === m)![1];

const INICIAL: AutomacaoState = {
  status: 'ocioso', atuadores: [], regras: [], eventos: [], kits: [], aviso: null, semSinal: false, relogio: 906,
};

let state: AutomacaoState = INICIAL;
const ouvintes = new Set<() => void>();
let intervalo: ReturnType<typeof setInterval> | undefined;
let temporizadores: ReturnType<typeof setTimeout>[] = [];
let contadorEventos = 0;

function emitir() { ouvintes.forEach((l) => l()); }
function atualizar(p: Partial<AutomacaoState> | ((s: AutomacaoState) => Partial<AutomacaoState>)) {
  state = { ...state, ...(typeof p === 'function' ? p(state) : p) };
  emitir();
}
const getState = () => state;

function limparTemporizadores() { temporizadores.forEach(clearTimeout); temporizadores = []; }
const agendar = (ms: number, f: () => void) => { temporizadores.push(setTimeout(f, ms)); };

function comEvento(s: AutomacaoState, tipo: TipoEvento, setor: SetorId, motivo: string, origem: OrigemEvento): Partial<AutomacaoState> {
  const relogio = s.relogio + 1;
  const e: Evento = {
    id: 'n' + ++contadorEventos, h: hhmm(relogio / 60), tipo,
    setor: setor.toUpperCase() as Evento['setor'], motivo, origem,
  };
  return { eventos: [e, ...s.eventos], relogio };
}
function mudarAtuador(s: AutomacaoState, id: SetorId, patch: Partial<Atuador>): Atuador[] {
  return s.atuadores.map((a) => (a.id === id ? { ...a, ...patch } : a));
}
/** aplica patch no atuador e registra um evento no mesmo passo */
function registrar(id: SetorId, patch: Partial<Atuador> | null, tipo: TipoEvento, motivo: string, origem: OrigemEvento, extra?: Partial<AutomacaoState>) {
  atualizar((s) => ({
    ...(patch ? { atuadores: mudarAtuador(s, id, patch) } : {}),
    ...comEvento(s, tipo, id, motivo, origem),
    ...(extra ?? {}),
  }));
}

function tique() {
  const s = state;
  if (s.status !== 'pronto' || !s.aviso) return;
  const av = s.aviso;
  if (av.seg <= 1) {
    registrar(av.atuadorId, { estado: 'desligado' }, 'expirou', 'Aviso não respondido em 15 min', 'regra', { aviso: null });
  } else {
    atualizar({ aviso: { ...av, seg: av.seg - 1 } });
  }
}

function cicloDePulsos(id: SetorId) {
  agendar(5000, () => registrar(id, { estado: 'pausa', restante: 0 }, 'desligou', 'Pausa do pulso · 15 min desligado', 'regra'));
  agendar(10000, () => registrar(id, { estado: 'ligado', restante: 15 }, 'ligou', 'Pulso 2 de 4 · ar ainda acima do limite', 'regra'));
  agendar(15000, () => registrar(id, { estado: 'desligado', restante: 0, temp: 34.6 }, 'desligou', 'Ciclo concluído · ar abaixo do limite', 'regra'));
}

async function carregar() {
  limparTemporizadores();
  atualizar({ status: 'carregando' });
  try {
    const snap = await carregarAutomacao();
    atualizar({ ...snap, status: 'pronto', semSinal: false, relogio: 906 });
  } catch {
    atualizar({ status: 'erro' });
  }
}

export const acoes = {
  carregar,
  /** só para revisão de design: /automacao?estado=vazio|erro|carregando */
  forcarEstado(e: 'vazio' | 'erro' | 'carregando') {
    limparTemporizadores();
    if (e === 'erro') atualizar({ status: 'erro' });
    else if (e === 'carregando') atualizar({ status: 'carregando' });
    else atualizar({ status: 'pronto', atuadores: [], regras: [], eventos: [], kits: [], aviso: null, semSinal: false });
  },
  aprovar(origem: OrigemEvento) {
    const av = state.aviso;
    if (!av) return;
    atualizar((s) => ({
      aviso: null,
      atuadores: mudarAtuador(s, av.atuadorId, { estado: 'ligado', restante: 15 }),
    }));
    registrar(av.atuadorId, null, 'aprovado', 'Aprovado pelo ' + origem, origem);
    registrar(av.atuadorId, null, 'ligou', 'Aspersor ligado por 15 min', 'regra');
    void enviarLigar(av.atuadorId, 15);
    cicloDePulsos(av.atuadorId);
  },
  ignorar(origem: OrigemEvento) {
    const av = state.aviso;
    if (!av) return;
    registrar(av.atuadorId, { estado: 'desligado' }, 'recusado', 'Ignorado pelo ' + origem, origem, { aviso: null });
  },
  ligarAgora(id: SetorId, minutos: number, origem: OrigemEvento) {
    registrar(id, { estado: 'ligado', restante: minutos }, 'ligou', `Ligado manualmente por ${minutos} min`, origem,
      state.aviso?.atuadorId === id ? { aviso: null } : undefined);
    void enviarLigar(id, minutos);
  },
  desligar(id: SetorId, origem: OrigemEvento) {
    registrar(id, { estado: 'desligado', restante: 0 }, 'desligou', 'Desligado manualmente', origem);
    void enviarDesligar(id);
  },
  trocarModo(id: SetorId, modo: ModoAtuador) {
    registrar(id, { modo }, 'aprovado', 'Modo alterado para ' + rotuloModo(modo), 'técnico');
    void enviarModo(id, modo);
  },
  alternarRegra(id: string) {
    atualizar((s) => ({ regras: s.regras.map((r) => (r.id === id ? { ...r, ativa: !r.ativa } : r)) }));
  },
  salvarRegra(id: string | null, form: FormRegra) {
    const frase = fraseDaRegra(form);
    const alvo = `Setor A1 · pede aprovação · prazo de ${form.prazo} min`;
    atualizar((s) => ({
      regras: id
        ? s.regras.map((r) => (r.id === id ? { ...r, frase, form: { ...form } } : r))
        : [...s.regras, { id: 'r' + (s.regras.length + 1), frase, alvo, ativa: true, form: { ...form } }],
    }));
  },
  simularCalor() {
    limparTemporizadores();
    atualizar((s) => ({
      semSinal: false,
      atuadores: mudarAtuador(s, 'a1', { estado: 'aguardando', temp: 36.4 }),
      aviso: { atuadorId: 'a1', lote: 'Lote A1', temp: '36,4', limite: '35', solo: '22,4', seg: 15 * 60 },
    }));
    registrar('a1', null, 'gatilho', 'Ar passou de 35 °C', 'firmware');
    registrar('a1', null, 'aviso', '36,4 °C há 10 min (limite 35 °C), solo 22,4 %', 'regra');
  },
  simularSemSinal() {
    registrar('a1', { estado: 'semsinal' }, 'falha', 'IOT-001 sem sinal há 18 min · ações automáticas suspensas', 'firmware',
      { semSinal: true, ...(state.aviso?.atuadorId === 'a1' ? { aviso: null } : {}) });
  },
  resetar() {
    limparTemporizadores();
    atualizar({ ...instantaneoInicial(), status: 'pronto', semSinal: false, relogio: 906 });
  },
};

function assinar(l: () => void) {
  ouvintes.add(l);
  if (!intervalo) intervalo = setInterval(tique, 1000);
  if (state.status === 'ocioso') void carregar();
  return () => {
    ouvintes.delete(l);
    if (!ouvintes.size) { clearInterval(intervalo); intervalo = undefined; }
  };
}

export function useAutomacao(): AutomacaoState {
  return useSyncExternalStore(assinar, getState, getState);
}

export const kitsOnline = (s: AutomacaoState) =>
  s.kits.filter((k) => !(s.semSinal && k.atuadorId === 'a1')).length;
