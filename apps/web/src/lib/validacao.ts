// Validações de formulário usadas no Cadastro e no Perfil.
// Cada função devolve um objeto { campo: 'mensagem' } só com os campos errados.
// Objeto vazio = tudo certo.

export type Erros = Record<string, string>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface FazendaForm {
  nome: string;
  municipio: string;
  area: string;
  latitude: string;
  longitude: string;
}

export const fazendaVazia: FazendaForm = { nome: '', municipio: '', area: '', latitude: '', longitude: '' };

/** Converte texto digitado ("12,5") em número; devolve NaN se não for número. */
export function paraNumero(valor: string): number {
  if (valor.trim() === '') return NaN;
  return Number(valor.replace(',', '.'));
}

export function validarConta(dados: { nome: string; email: string; senha: string }): Erros {
  const erros: Erros = {};
  if (dados.nome.trim().length < 3) erros.nome = 'Informe seu nome completo';
  if (!EMAIL_RE.test(dados.email.trim())) erros.email = 'E-mail inválido (ex.: nome@fazenda.com)';
  if (dados.senha.length < 6) erros.senha = 'A senha precisa ter pelo menos 6 caracteres';
  return erros;
}

/** Valida a fazenda. As chaves começam com "fazenda_" para não misturar com os campos da conta. */
export function validarFazenda(f: FazendaForm): Erros {
  const erros: Erros = {};
  const area = paraNumero(f.area);
  const lat = paraNumero(f.latitude);
  const lon = paraNumero(f.longitude);

  if (f.nome.trim().length < 2) erros.fazenda_nome = 'Informe o nome da fazenda';
  if (f.municipio.trim().length < 2) erros.fazenda_municipio = 'Informe o município (ex.: Petrolina - PE)';
  if (!(area > 0)) erros.fazenda_area_total = 'Área em hectares, maior que zero';
  if (Number.isNaN(lat) || lat < -90 || lat > 90) erros.fazenda_latitude = 'Latitude entre -90 e 90 (ex.: -9.3891)';
  if (Number.isNaN(lon) || lon < -180 || lon > 180) erros.fazenda_longitude = 'Longitude entre -180 e 180 (ex.: -40.5027)';
  return erros;
}

/** Monta o objeto que o backend espera a partir do formulário (já validado). */
export function fazendaParaApi(f: FazendaForm) {
  return {
    nome: f.nome.trim(),
    municipio: f.municipio.trim(),
    area_total: paraNumero(f.area),
    latitude: paraNumero(f.latitude),
    longitude: paraNumero(f.longitude),
  };
}

/**
 * Traduz os erros por campo que vêm do backend para as chaves do formulário.
 * O backend chama a senha de "password"; o resto já vem com o mesmo nome.
 */
export function errosDoBackend(fields?: Record<string, string[]>): Erros {
  const erros: Erros = {};
  if (!fields) return erros;
  for (const [campo, mensagens] of Object.entries(fields)) {
    const chave = campo === 'password' || campo === 'senha_hash' ? 'senha' : campo;
    if (mensagens.length > 0) erros[chave] = mensagens[0];
  }
  return erros;
}

/** Pega a posição do navegador (GPS/Wi-Fi). Só funciona em localhost ou https. */
export function pegarLocalizacao(): Promise<{ latitude: string; longitude: string }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Navegador sem suporte a localização'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        resolve({
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }),
      () => reject(new Error('Permissão de localização negada')),
      { timeout: 10000 },
    );
  });
}
