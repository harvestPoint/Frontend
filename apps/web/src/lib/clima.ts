// Clima da região pela API pública Open-Meteo (https://open-meteo.com).

export interface ClimaAgora {
  temperatura: number;
  umidade: number;
  chuva_mm: number;
  vento_kmh: number;
  codigo_tempo: number;
  horario: string;
}

export interface ClimaDia {
  data: string;
  temp_max: number;
  temp_min: number;
  chance_chuva: number;
  chuva_mm: number;
  codigo_tempo: number;
}

export interface ClimaRegiao {
  agora: ClimaAgora;
  dias: ClimaDia[];
}

/** Formato da resposta do Open-Meteo (só os campos que usamos). */
interface OpenMeteoResposta {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    precipitation: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

export async function buscarClimaRegiao(latitude: number, longitude: number): Promise<ClimaRegiao> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,weather_code',
    timezone: 'America/Recife',
    forecast_days: '7',
  });

  // fetch (e não o axios do projeto) porque esta API é externa: não passa pelo backend nem leva o token
  const resp = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`);
  if (!resp.ok) throw new Error(`Open-Meteo respondeu ${resp.status}`);
  const json = (await resp.json()) as OpenMeteoResposta;

  return {
    agora: {
      temperatura: json.current.temperature_2m,
      umidade: json.current.relative_humidity_2m,
      chuva_mm: json.current.precipitation,
      vento_kmh: json.current.wind_speed_10m,
      codigo_tempo: json.current.weather_code,
      horario: json.current.time,
    },
    dias: json.daily.time.map((data, i) => ({
      data,
      temp_max: json.daily.temperature_2m_max[i],
      temp_min: json.daily.temperature_2m_min[i],
      chance_chuva: json.daily.precipitation_probability_max[i] ?? 0,
      chuva_mm: json.daily.precipitation_sum[i] ?? 0,
      codigo_tempo: json.daily.weather_code[i],
    })),
  };
}

/** Traduz o código WMO do Open-Meteo em texto e ícone (Material Symbols). */
export function descreverTempo(codigo: number): { texto: string; icone: string } {
  if (codigo === 0) return { texto: 'Céu limpo', icone: 'clear_day' };
  if (codigo <= 3) return { texto: 'Parcialmente nublado', icone: 'partly_cloudy_day' };
  if (codigo <= 48) return { texto: 'Neblina', icone: 'foggy' };
  if (codigo <= 67) return { texto: 'Chuva', icone: 'rainy' };
  if (codigo <= 77) return { texto: 'Neve', icone: 'weather_snowy' };
  if (codigo <= 82) return { texto: 'Pancadas de chuva', icone: 'rainy' };
  return { texto: 'Trovoadas', icone: 'thunderstorm' };
}
