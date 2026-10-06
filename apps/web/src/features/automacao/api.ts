// apps/web/src/features/automacao/api.ts
// Toda chamada de rede da Automação fica aqui (convenção do projeto). Hoje
// tudo é simulado no frontend: as funções devolvem os dados de exemplo e os
// comandos só confirmam. Quando o backend existir, trocar o corpo de cada
// função pela chamada real (REST + MQTT/WebSocket para o estado ao vivo).
import { instantaneoInicial } from './data/automacaoMock';
import type { AutomacaoSnapshot, ModoAtuador, SetorId } from './types';

const espera = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/** TODO: GET /propriedades/:id/automacao */
export async function carregarAutomacao(): Promise<AutomacaoSnapshot> {
  await espera(450);
  return instantaneoInicial();
}

/** TODO: POST /atuadores/:id/comandos  { acao: 'ligar', minutos } → publica em harvestpoint/{propriedade}/{kit}/cmd */
export async function enviarLigar(_atuador: SetorId, _minutos: number): Promise<void> { await espera(0); }
/** TODO: POST /atuadores/:id/comandos  { acao: 'desligar' } */
export async function enviarDesligar(_atuador: SetorId): Promise<void> { await espera(0); }
/** TODO: PATCH /atuadores/:id  { modo } */
export async function enviarModo(_atuador: SetorId, _modo: ModoAtuador): Promise<void> { await espera(0); }
