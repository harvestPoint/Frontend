import axios, { AxiosError } from 'axios';

const TOKEN_KEY = 'hp_token';

export type UserRole = 'proprietario' | 'tecnico';

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  role: UserRole;
  propriedade: string | null;
}

export interface Lote {
  id: number;
  codigo: string;
  propriedade: string;
  cultura: string;
  variedade: string;
  area_ha: number;
  data_plantio: string | null;
  sensor_vinculado: string | null;
  status: string;
}

export interface ApiError {
  error?: string;
  message?: string;
  details?: string[];
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
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

export function readApiError(err: unknown): ApiError {
  const axiosErr = err as AxiosError<ApiError>;
  return axiosErr.response?.data ?? { message: 'Falha ao falar com o servidor' };
}

export async function signup(payload: {
  nome: string;
  email: string;
  senha: string;
  role: UserRole;
  propriedade: string;
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

export async function listLotes() {
  const { data } = await api.get<{ data: Lote[] }>('/lotes');
  return data.data;
}

export async function getLote(id: string | number) {
  const { data } = await api.get<{ data: Lote }>(`/lotes/${id}`);
  return data.data;
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
