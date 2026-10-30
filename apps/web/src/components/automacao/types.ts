// apps/web/src/components/automacao/types.ts
// Tipos da tela de Automação (aspersores/válvulas ligados aos kits IoT).

export type SetorId = 'a1' | 'c3' | 'b2';
export type ModoAtuador = 'automatico' | 'aprovacao' | 'manual';
export type EstadoAtuador = 'desligado' | 'ligado' | 'aguardando' | 'pausa' | 'semsinal' | 'falha';
export type TipoEvento =
  | 'gatilho' | 'aviso' | 'aprovado' | 'recusado' | 'expirou'
  | 'ligou' | 'desligou' | 'bloqueado' | 'falha';
export type OrigemEvento = 'regra' | 'firmware' | 'técnico' | 'proprietário';
export type Papel = 'tecnico' | 'proprietario';
export type FaixaGrafico = '6h' | '24h' | '7d';

export interface Atuador {
  id: SetorId;
  nome: string;
  lote: string;
  kit: string;
  modo: ModoAtuador;
  estado: EstadoAtuador;
  /** minutos que faltam para desligar (só faz sentido em "ligado") */
  restante: number;
  temp: number;
  /** pico do dia, usado só para desenhar o sparkline do mock */
  pico: number;
  hoje: boolean;
  regraId: string;
  limite: number;
}

export interface Evento {
  id: string;
  h: string;
  tipo: TipoEvento;
  setor: 'A1' | 'C3' | 'B2';
  motivo: string;
  origem: OrigemEvento;
}

export interface FormRegra {
  limite: number; dur: number; solo: number; ini: number;
  on: number; off: number; ciclos: number; prazo: number;
}

export interface Regra {
  id: string;
  frase: string;
  alvo: string;
  ativa: boolean;
  /** só regras de pulso por temperatura são editáveis no editor atual */
  form?: FormRegra;
}

export interface AvisoPendente {
  atuadorId: SetorId;
  lote: string;
  temp: string;
  limite: string;
  solo: string;
  /** segundos que faltam para o aviso expirar */
  seg: number;
}

export interface Kit {
  id: string;
  atuadorId: SetorId;
  lote: string;
  sinal: string;
  bateria: number;
  wifi: number;
  firmware: string;
  pico: number;
}

export type StatusCarga = 'ocioso' | 'carregando' | 'pronto' | 'erro';

export interface AutomacaoState {
  status: StatusCarga;
  atuadores: Atuador[];
  regras: Regra[];
  eventos: Evento[];
  kits: Kit[];
  aviso: AvisoPendente | null;
  semSinal: boolean;
  /** relógio do mock em minutos desde 00h (906 = 15h06) */
  relogio: number;
}

export interface AutomacaoSnapshot {
  atuadores: Atuador[];
  regras: Regra[];
  eventos: Evento[];
  kits: Kit[];
  aviso: AvisoPendente | null;
}
