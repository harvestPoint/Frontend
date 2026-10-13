// Bloco do Dashboard que junta "clima da região" (API Open-Meteo)
// com "clima no hectare" (última leitura do ESP32) e mostra a diferença.
import { useEffect, useState, type CSSProperties } from 'react';
import { buscarClimaRegiao, descreverTempo, type ClimaRegiao } from '@/lib/clima';
import type { Leitura } from '@/lib/api';

// Petrolina-PE: usada quando a propriedade ainda não tem coordenadas
const PADRAO = { latitude: -9.3891, longitude: -40.5027 };
const DIAS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

interface Props {
  latitude?: number | null;
  longitude?: number | null;
  local: string;
  leitura: Leitura | null | undefined;
}

const card: CSSProperties = {
  background: 'var(--hp-surface)',
  border: '1px solid var(--hp-border)',
  borderRadius: '16px',
  padding: '20px',
};
const rotulo: CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' };
const numero: CSSProperties = { fontSize: '30px', lineHeight: '36px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' };
const icone: CSSProperties = { fontFamily: "'Material Symbols Outlined'", lineHeight: 1 };

export default function ClimaComparativo({ latitude, longitude, local, leitura }: Props) {
  const [clima, setClima] = useState<ClimaRegiao | null>(null);
  const [erro, setErro] = useState('');

  const temCoordenadas = latitude != null && longitude != null && !(latitude === 0 && longitude === 0);
  const lat = temCoordenadas ? Number(latitude) : PADRAO.latitude;
  const lon = temCoordenadas ? Number(longitude) : PADRAO.longitude;

  // Busca o clima da região sempre que mudam as coordenadas (troca de propriedade)
  useEffect(() => {
    let cancelado = false;
    setErro('');
    buscarClimaRegiao(lat, lon)
      .then((c) => {
        if (!cancelado) setClima(c);
      })
      .catch(() => {
        if (!cancelado) setErro('Não foi possível falar com o Open-Meteo agora.');
      });
    return () => {
      cancelado = true;
    };
  }, [lat, lon]);

  const tempHectare = leitura?.temperatura != null ? Number(leitura.temperatura) : null;
  const umidHectare = leitura?.umidade != null ? Number(leitura.umidade) : null;
  const difTemp = clima && tempHectare != null ? +(tempHectare - clima.agora.temperatura).toFixed(1) : null;
  const difUmid = clima && umidHectare != null ? +(umidHectare - clima.agora.umidade).toFixed(1) : null;
  const tempo = clima ? descreverTempo(clima.agora.codigo_tempo) : null;

  const mediaMaxRegional = clima && clima.dias.length > 0 ? (clima.dias.reduce((acc, d) => acc + d.temp_max, 0) / clima.dias.length).toFixed(1) : '--';
  const mediaMinRegional = clima && clima.dias.length > 0 ? (clima.dias.reduce((acc, d) => acc + d.temp_min, 0) / clima.dias.length).toFixed(1) : '--';
  const acumuladoChuva = clima && clima.dias.length > 0 ? clima.dias.reduce((acc, d) => acc + d.chuva_mm, 0).toFixed(1) : '0';

  return (
    <div style={card}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: 600 }}>
            Clima da região × clima no hectare
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Região: Open-Meteo em {temCoordenadas ? local : 'Petrolina-PE (propriedade sem coordenadas)'} · Hectare: sensor ESP32
          </div>
        </div>
      </div>

      {erro ? (
        <div style={{ marginTop: '14px', fontSize: '13px', color: 'var(--hp-critico)' }}>{erro}</div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '16px' }}>
        {/* Região (API) */}
        <div style={{ border: '1px solid var(--hp-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={rotulo}>REGIÃO · OPEN-METEO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
            <span style={{ ...icone, fontSize: '28px', color: 'var(--hp-atencao)' }}>{tempo?.icone ?? 'cloud'}</span>
            <span style={numero}>{clima ? clima.agora.temperatura.toFixed(1) : '--'}</span>
            <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>°C</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '6px' }}>
            {clima ? `${tempo?.texto} · umidade ${clima.agora.umidade}% · vento ${clima.agora.vento_kmh} km/h` : 'Carregando...'}
          </div>
        </div>

        {/* Hectare (ESP32) */}
        <div style={{ border: '1px solid var(--hp-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={rotulo}>HECTARE · ESP32</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
            <span style={{ ...icone, fontSize: '28px', color: 'var(--hp-accent)' }}>sensors</span>
            <span style={numero}>{tempHectare != null ? tempHectare.toFixed(1) : '--'}</span>
            <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>°C</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '6px' }}>
            {umidHectare != null
              ? `umidade ${umidHectare.toFixed(1)}% · sensor ${leitura?.sensor_codigo ?? leitura?.sensor_id}`
              : 'Aguardando leitura do ESP32'}
          </div>
        </div>

        {/* Diferença */}
        <div style={{ border: '1px solid var(--hp-border)', borderRadius: '12px', padding: '16px' }}>
          <div style={rotulo}>DIFERENÇA (HECTARE − REGIÃO)</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginTop: '8px' }}>
            <span style={numero}>{difTemp != null ? `${difTemp > 0 ? '+' : ''}${difTemp}°` : '--'}</span>
            <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--hp-info)' }}>
              {difUmid != null ? `${difUmid > 0 ? '+' : ''}${difUmid}% umid.` : ''}
            </span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '6px' }}>
            {difTemp == null
              ? 'Aparece quando houver leitura do sensor'
              : Math.abs(difTemp) < 1
                ? 'O lote acompanha o clima da região'
                : difTemp > 0
                  ? `O lote está ${difTemp} °C mais quente que a região`
                  : `O lote está ${Math.abs(difTemp)} °C mais fresco que a região`}
          </div>
        </div>
      </div>

      {/* Previsão de 7 dias da região */}
      {clima ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px', paddingTop: '12px', borderTop: '1px solid var(--hp-border)', flexWrap: 'wrap', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hp-text)' }}>
              Previsão de 7 dias (Open-Meteo)
            </div>
            <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--hp-text-2)' }}>
              <span>Média Regional: <b>{mediaMinRegional}°C a {mediaMaxRegional}°C</b></span>
              <span>Chuva Acumulada Prevista: <b>{acumuladoChuva} mm</b></span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(72px, 1fr))', gap: '8px', marginTop: '10px', overflowX: 'auto' }}>
            {clima.dias.map((d) => {
              const t = descreverTempo(d.codigo_tempo);
              const dia = DIAS[new Date(`${d.data}T12:00:00`).getDay()];
              return (
                <div key={d.data} title={t.texto} style={{ background: 'var(--hp-surface-2)', borderRadius: '12px', padding: '10px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', fontWeight: 600 }}>{dia}</div>
                  <span style={{ ...icone, fontSize: '22px', color: 'var(--hp-text-2)', display: 'block', margin: '6px 0' }}>{t.icone}</span>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>{Math.round(d.temp_max)}°</div>
                  <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>{Math.round(d.temp_min)}°</div>
                  <div style={{ fontSize: '11px', color: 'var(--hp-info)', marginTop: '4px' }}>{d.chance_chuva}% chuva</div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
