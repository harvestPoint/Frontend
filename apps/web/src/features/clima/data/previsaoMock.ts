// src/features/clima/data/previsaoMock.ts
// Mock de previsão climática regional — 16 dias por propriedade, no MESMO
// formato que a resposta real da Open-Meteo vai ter (ver adendo de pesquisa
// "HarvestPoint-Clima-Mercado-Telas.pdf", §4). Quando o backend existir, só
// troca a fonte dos dados: os componentes que consomem isso não mudam.
//
// TODO: substituir por dado real, buscado no backend a partir de:
// GET https://api.open-meteo.com/v1/forecast
//   ?latitude=<propriedade.lat>&longitude=<propriedade.long>
//   &daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,
//          relative_humidity_2m_mean,wind_speed_10m_max,et0_fao_evapotranspiration
//   &timezone=America/Recife&forecast_days=16

export interface PrevisaoDiaria {
  /** ISO yyyy-mm-dd */
  data: string;
  temperaturaMax: number;
  temperaturaMin: number;
  chanceChuvaPercentual: number;
  precipitacaoMm: number;
  /** umidade relativa média do ar (%) */
  umidadeArPercentual: number;
  /** vento máximo a 10 m (km/h) */
  ventoKmh: number;
  /** evapotranspiração de referência FAO (mm) */
  evapotranspiracaoMm: number;
}

export interface FaixaIdealCultura {
  cultura: string;
  /** temperatura acima da qual a cultura entra em estresse térmico */
  max: number;
}

export interface PrevisaoPropriedade {
  id: string;
  nome: string;
  municipio: string;
  faixaIdeal: FaixaIdealCultura;
  dias: PrevisaoDiaria[];
}

export const fonteClima = {
  nome: 'Open-Meteo',
  // TODO: substituir pelo horário real da última coleta no backend
  atualizadoHaMin: 12,
  proximaAtualizacaoMin: 48,
};

function gerarDias(base: { max: number; min: number }, chuvas: Record<number, number>): PrevisaoDiaria[] {
  const hoje = new Date();
  return Array.from({ length: 16 }, (_, i) => {
    const d = new Date(hoje);
    d.setDate(hoje.getDate() + i);
    const variacao = Math.sin(i / 2.3) * 2.2;
    const chance = chuvas[i] ?? 5;
    return {
      data: d.toISOString().slice(0, 10),
      temperaturaMax: Math.round((base.max + variacao) * 10) / 10,
      temperaturaMin: Math.round((base.min + variacao * 0.6) * 10) / 10,
      chanceChuvaPercentual: chance,
      precipitacaoMm: chance >= 40 ? Math.round(chance / 4) : 0,
      umidadeArPercentual: Math.round(52 + chance * 0.35 - variacao * 2),
      ventoKmh: Math.round(12 + Math.cos(i / 1.7) * 4),
      evapotranspiracaoMm: Math.round((6 + variacao * 0.4 - chance / 40) * 10) / 10,
    };
  });
}

export const previsaoPropriedades: PrevisaoPropriedade[] = [
  {
    id: 'boa-vista',
    nome: 'Fazenda Boa Vista',
    municipio: 'Petrolina/PE',
    faixaIdeal: { cultura: 'Manga', max: 30 },
    dias: gerarDias({ max: 34, min: 22 }, { 2: 20, 3: 60, 4: 45, 9: 15 }),
  },
  {
    id: 'nova-aurora',
    nome: 'Sítio Nova Aurora',
    municipio: 'Lagoa Grande/PE',
    faixaIdeal: { cultura: 'Uva', max: 28 },
    dias: gerarDias({ max: 33, min: 21 }, { 1: 12, 5: 35, 6: 50, 11: 18 }),
  },
];
