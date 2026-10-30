import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'hp_token';
const PROP_KEY = 'hp_propriedade_id';

export type UserRole = 'proprietario' | 'tecnico';

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  propriedade: string | null;
  cpf_cnpj?: string;
  telefone?: string;
  tipo_usuario?: string;
}

export interface Lote {
  id: number;
  codigo: string;
  nome?: string;
  propriedade: string;
  propriedade_id?: number;
  municipio?: string;
  /** null quando o lote ainda não tem cultura (aí `cultura` vem "Não definida") */
  cultura_id?: number | null;
  cultura: string;
  variedade: string;
  area_ha: number;
  area?: number;
  data_plantio: string | null;
  data_fim_ciclo?: string | null;
  sensor_vinculado: string | null;
  status: string;
  ultima_temperatura?: number | null;
  ultima_umidade?: number | null;
  ultima_leitura_em?: string | null;
  alertas_ativos_count?: number;
  sensores_count?: number;
  recomendacao_atual?: Recomendacao | null;
  sensores?: Sensor[];
  alertas_recentes?: Alerta[];
  leituras?: Leitura[];
  recomendacoes?: Recomendacao[];
}

export interface Sensor {
  id: number;
  codigo: string;
  lote_id: number;
  lote_nome?: string;
  propriedade?: string;
  status: string;
  ultima_temperatura?: number | null;
  ultima_umidade?: number | null;
  ultima_leitura_em?: string | null;
  total_leituras?: number;
  alertas_pendentes_count?: number;
}

export interface Leitura {
  id: number;
  sensor_id: number;
  sensor_codigo?: string;
  lote_id?: number;
  lote_nome?: string;
  propriedade?: string;
  cultura?: string;
  temperatura: number;
  umidade: number;
  data_hora: string;
}

export interface Alerta {
  id: number;
  sensor_id: number;
  sensor_codigo?: string;
  lote_id?: number;
  lote_nome?: string;
  propriedade?: string;
  cultura?: string;
  tipo: string;
  severidade?: string;
  mensagem: string;
  data_hora: string;
  resolvido: boolean;
}

export interface Recomendacao {
  id: number;
  lote_id: number;
  lote_nome?: string;
  propriedade?: string;
  cultura?: string;
  data_inicio: string;
  data_fim: string;
  grau_confianca: number;
  data_atualizacao: string;
  status: string;
  dias_decorridos?: number;
  ciclo_medio_dias?: number;
  dias_restantes?: number;
  modelo_ml?: {
    versao: string;
    grau_brix_estimado: number;
    qualidade_safra: string;
    risco_fitossanitario: string;
    gdd_acumulado: number;
  };
}

export interface Propriedade {
  id: number;
  usuario_id?: number;
  produtor?: string;
  nome: string;
  municipio: string;
  latitude: number;
  longitude: number;
  area_total: number;
  total_lotes?: number;
}

export interface Cultura {
  id: number;
  nome: string;
  ciclo_medio_dias: number;
  temperatura_min: number;
  temperatura_max: number;
  umidade_min: number;
  umidade_max: number;
  cotacao_atual?: number;
  moeda?: string;
}

export interface PrecoMercado {
  id: number;
  cultura_id: number;
  cultura_nome?: string;
  preco_medio: number;
  moeda: string;
  data_cotacao: string;
}

export interface Clima {
  id: number;
  propriedade_id: number;
  propriedade_nome?: string;
  municipio?: string;
  data_previsao: string;
  temperatura_min: number;
  temperatura_max: number;
  chance_chuva_percentual: number;
  precipitacao_mm?: number | null;
}

export interface DashboardData {
  resumo: {
    total_propriedades: number;
    total_lotes: number;
    area_monitorada_ha: number;
    total_sensores: number;
    sensores_ativos: number;
    alertas_pendentes_count: number;
    total_leituras: number;
  };
  ultima_leitura: Leitura | null;
  alertas_recentes: Alerta[];
  lotes: Lote[];
  recomendacoes: Recomendacao[];
  previsao_clima: Clima[];
}

/** Alias usado pelo Dashboard (mesmo formato de DashboardData). */
export type DashboardResponse = DashboardData;

export interface ApiError {
  error?: string;
  message?: string;
  details?: string[];
  /** Erros separados por campo, ex.: { email: ['Este e-mail já está cadastrado'] } */
  fields?: Record<string, string[]>;
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getSelectedPropriedadeId(): number | null {
  const raw = localStorage.getItem(PROP_KEY);
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function setSelectedPropriedadeId(id: number | null): void {
  if (id == null) localStorage.removeItem(PROP_KEY);
  else localStorage.setItem(PROP_KEY, String(id));
}

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Transforma qualquer erro do axios em { message, details, fields, status }.
 * Nunca devolve mensagem vazia: se o servidor não explicou, descrevemos o que aconteceu.
 */
export function readApiError(err: unknown): ApiError & { status?: number } {
  const axiosErr = err as AxiosError<ApiError & { exception?: string }>;
  const resp = axiosErr.response;

  // Sem resposta = o backend nem foi alcançado
  if (!resp) {
    return {
      message: 'Não consegui falar com o servidor. Confira se o backend (Rails) está rodando na porta 3333.',
    };
  }

  const body = typeof resp.data === 'object' && resp.data ? resp.data : ({} as ApiError & { exception?: string });
  if (body.message) return { ...body, status: resp.status };

  // Resposta sem "message" (ex.: erro 500 do Rails): monta uma explicação útil
  const detalhe = body.exception || body.error || '';
  const message =
    resp.status >= 500
      ? `Erro interno do servidor (${resp.status})${detalhe ? `: ${detalhe}` : ''}. Veja o terminal do Rails para o motivo.`
      : `O servidor recusou a requisição (${resp.status})${detalhe ? `: ${detalhe}` : ''}.`;
  return { ...body, message, status: resp.status };
}

function unwrap<T>(payload: { data: T }): T {
  return payload.data;
}

/** Dados da fazenda no cadastro (só para proprietário; pode ficar para depois). */
export interface FazendaInput {
  nome: string;
  municipio: string;
  area_total: number;
  latitude: number;
  longitude: number;
}

export async function signup(payload: {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  propriedade?: string;
  fazenda?: FazendaInput;
  cpf_cnpj?: string;
  telefone?: string;
}) {
  const { data } = await api.post<{ data: { user: AuthUser; token: string } }>('/auth/signup', payload);
  setToken(data.data.token);
  return data.data.user;
}

export async function login(payload: { email: string; senha: string }) {
  const { data } = await api.post<{ data: { user: AuthUser; token: string } }>('/auth/login', payload);
  setToken(data.data.token);
  return data.data.user;
}

export async function fetchMe() {
  const { data } = await api.get<{ data: { user: AuthUser } }>('/auth/me');
  return data.data.user;
}

export async function logoutRequest() {
  try {
    await api.delete('/auth/logout');
  } finally {
    setToken(null);
  }
}

export async function updateUsuario(id: number | 'me', payload: Record<string, unknown>) {
  const { data } = await api.patch<{ data: AuthUser }>(`/usuarios/${id}`, payload);
  return unwrap(data);
}

export async function listUsuarios(tipo?: string) {
  const { data } = await api.get<{ data: AuthUser[] }>('/usuarios', { params: tipo ? { tipo } : undefined });
  return data.data;
}

export async function listLotes() {
  const { data } = await api.get<{ data: Lote[] }>('/lotes');
  return data.data;
}

export async function getLote(id: string | number) {
  const { data } = await api.get<{ data: Lote }>(`/lotes/${id}`);
  return data.data;
}

/** Status gravados no banco (historico_cultivos.status só aceita estes dois). */
export const STATUS_LOTE: Record<string, string> = { ATIVO: 'Ativo', FINALIZADO: 'Finalizado' };

export function statusLoteLabel(status?: string | null) {
  return STATUS_LOTE[(status || '').toUpperCase()] ?? (status || '—');
}

export async function createLote(payload: Partial<Lote> & { codigo: string }) {
  const { data } = await api.post<{ data: Lote }>('/lotes', payload);
  return data.data;
}

export async function updateLote(id: number, payload: Partial<Lote>) {
  const { data } = await api.patch<{ data: Lote }>(`/lotes/${id}`, payload);
  return data.data;
}

export async function deleteLote(id: number) {
  await api.delete(`/lotes/${id}`);
}

export async function fetchDashboard(propriedadeId?: number | null) {
  const { data } = await api.get<DashboardData>('/dashboard', {
    params: propriedadeId ? { propriedade_id: propriedadeId } : undefined,
  });
  return data;
}

export async function listAlertas(params?: { resolvido?: boolean; lote_id?: number }) {
  const { data } = await api.get<{ data: Alerta[]; pendentes: number; total: number }>('/alertas', { params });
  return data;
}

export async function resolverAlerta(id: number) {
  const { data } = await api.patch<{ data: Alerta }>(`/alertas/${id}/resolver`);
  return unwrap(data);
}

export async function listLeituras(params?: { sensor_id?: number; lote_id?: number; limit?: number }) {
  const { data } = await api.get<{ data: Leitura[]; total: number }>('/leituras', { params });
  return data.data;
}

export async function createLeitura(payload: { codigo?: string; sensor_id?: number; temperatura: number; umidade: number }) {
  const { data } = await api.post<{ data: Leitura }>('/leituras', payload);
  return unwrap(data);
}

export async function exportLeiturasCsv() {
  const { data } = await api.get('/leituras', { params: { format: 'csv' }, responseType: 'blob' });
  const url = URL.createObjectURL(data as Blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `leituras_harvestpoint_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function listSensores(params?: { lote_id?: number; status?: string }) {
  const { data } = await api.get<{ data: Sensor[] }>('/sensores', { params });
  return data.data;
}

export async function createSensor(payload: { codigo: string; lote_id: number; status?: string }) {
  const { data } = await api.post<{ data: Sensor }>('/sensores', payload);
  return unwrap(data);
}

export async function updateSensor(id: number, payload: Partial<Sensor>) {
  const { data } = await api.patch<{ data: Sensor }>(`/sensores/${id}`, payload);
  return unwrap(data);
}

export async function deleteSensor(id: number) {
  await api.delete(`/sensores/${id}`);
}

export async function listPropriedades() {
  const { data } = await api.get<{ data: Propriedade[] }>('/propriedades');
  return data.data;
}

export async function createPropriedade(payload: Partial<Propriedade> & { nome: string; municipio: string; usuario_id?: number }) {
  const { data } = await api.post<{ data: Propriedade }>('/propriedades', payload);
  return unwrap(data);
}

export async function updatePropriedade(id: number, payload: Partial<Propriedade>) {
  const { data } = await api.patch<{ data: Propriedade }>(`/propriedades/${id}`, payload);
  return unwrap(data);
}

export async function deletePropriedade(id: number) {
  await api.delete(`/propriedades/${id}`);
}

export async function listCulturas() {
  const { data } = await api.get<{ data: Cultura[] }>('/culturas');
  return data.data;
}

export async function createCultura(payload: Partial<Cultura> & { nome: string }) {
  const { data } = await api.post<{ data: Cultura }>('/culturas', payload);
  return unwrap(data);
}

export async function updateCultura(id: number, payload: Partial<Cultura>) {
  const { data } = await api.patch<{ data: Cultura }>(`/culturas/${id}`, payload);
  return unwrap(data);
}

export async function deleteCultura(id: number) {
  await api.delete(`/culturas/${id}`);
}

export async function listRecomendacoes(params?: { lote_id?: number; status?: string }) {
  const { data } = await api.get<{ data: Recomendacao[]; pendentes: number }>('/recomendacoes', { params });
  return data.data;
}

export async function gerarRecomendacoes() {
  const { data } = await api.post<{ data: Recomendacao[]; total_geradas: number }>('/recomendacoes/gerar');
  return data;
}

export async function aceitarRecomendacao(id: number) {
  const { data } = await api.patch<{ data: Recomendacao }>(`/recomendacoes/${id}/aceitar`);
  return unwrap(data);
}

export async function rejeitarRecomendacao(id: number) {
  const { data } = await api.patch<{ data: Recomendacao }>(`/recomendacoes/${id}/rejeitar`);
  return unwrap(data);
}

/** Cotação do dólar (PTAX) vinda do Banco Central pelo backend. */
export interface CotacaoDolar {
  compra?: number;
  venda?: number;
  data_hora?: string;
  historico?: { data: string; venda: number }[];
  fonte?: 'api' | 'cache';
  atualizado_em?: string;
  erro?: string;
}

/** Preço médio de exportação (Comex Stat) por produto. */
export interface PrecoExportacao {
  produto: string;
  preco_usd_kg?: number | null;
  preco_brl_kg?: number | null;
  total_kg_12m?: number;
  fonte?: 'api' | 'cache';
  atualizado_em?: string;
  erro?: string;
}

export interface MercadoResponse {
  data: PrecoMercado[];
  resumo_culturas: PrecoMercado[];
  dolar: CotacaoDolar;
  euro?: CotacaoDolar;
  exportacao: PrecoExportacao[];
}

export async function listMercado() {
  const { data } = await api.get<MercadoResponse>('/mercado');
  return data;
}

/** Exportação de um produto (manga ou uva) — dados oficiais do Comex Stat. */
export interface ExportacaoProduto {
  produto: string;
  ncm?: string;
  meses?: { mes: string; kg: number; fob_usd: number }[];
  media_por_mes?: { mes: number; nome: string; kg_medio: number }[];
  meses_pico?: number[];
  top_destinos?: { pais: string; kg: number; fob_usd: number; participacao: number }[];
  total_kg_12m?: number;
  total_fob_usd_12m?: number;
  preco_medio_usd_kg?: number | null;
  fonte?: 'api' | 'cache';
  atualizado_em?: string;
  erro?: string;
}

/** Janela de colheita de um lote cruzada com os meses de maior exportação. */
export interface JanelaExportacao extends Recomendacao {
  produto_exportacao?: string | null;
  meses_colheita: number[];
  em_alta_demanda: boolean;
}

export async function fetchExportacao() {
  const { data } = await api.get<{ data: ExportacaoProduto[]; minhas_janelas: JanelaExportacao[] }>('/exportacao');
  return data;
}

export interface FatiaLogistica {
  nome: string;
  kg: number;
  fob_usd: number;
  participacao: number;
}

export interface LogisticaProduto {
  produto: string;
  ncm?: string;
  periodo?: { from: string; to: string };
  total_kg?: number;
  modais?: FatiaLogistica[];
  saidas?: FatiaLogistica[];
  fonte?: 'api' | 'cache';
  atualizado_em?: string;
  erro?: string;
}

export async function fetchLogistica() {
  const { data } = await api.get<{ data: LogisticaProduto[] }>('/logistica');
  return data.data;
}

export async function createCotacao(payload: { cultura_id: number; preco_medio: number; moeda?: string; data_cotacao?: string }) {
  const { data } = await api.post<{ data: PrecoMercado }>('/mercado', payload);
  return unwrap(data);
}

export async function listClima(propriedadeId?: number | null) {
  const { data } = await api.get<{ data: Clima[] }>('/clima', {
    params: propriedadeId ? { propriedade_id: propriedadeId } : undefined,
  });
  return data.data;
}

export async function createClima(payload: {
  propriedade_id: number;
  data_previsao: string;
  temperatura_min: number;
  temperatura_max: number;
  chance_chuva_percentual: number;
  precipitacao_mm?: number;
}) {
  const { data } = await api.post<{ data: Clima }>('/clima', payload);
  return unwrap(data);
}

export function iniciais(nome?: string | null) {
  return (nome || 'U')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

export function formatDate(value?: string | null) {
  if (!value) return '—';
  const iso = value.slice(0, 10);
  const [y, m, d] = iso.split('-');
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

export function formatDateTime(value?: string | null) {
  if (!value) return '—';
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
