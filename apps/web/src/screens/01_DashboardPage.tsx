// apps/web/src/screens/01_DashboardPage.tsx
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useProperty } from '@/contexts/PropertyContext';
import {
  fetchDashboard,
  listAlertas,
  listLotes,
  listLeituras,
  exportLeiturasCsv,
  type DashboardResponse,
  type Alerta,
  type Lote,
  type Leitura,
} from '@/lib/api';
import ClimaComparativo from '@/components/ClimaComparativo';

interface ChipItem {
  id: string;
  label: string;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { selected, propriedades } = useProperty();

  const nomePropriedade = selected?.nome || user?.propriedade || propriedades[0]?.nome || 'Propriedade Principal';
  const municipioPropriedade = selected?.municipio || 'Vale do São Francisco';

  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [periodoGrafico, setPeriodoGrafico] = useState<'24h' | '7d' | '30d'>('24h');

  // Chips sem duplicação
  const [chips, setChips] = useState<ChipItem[]>([
    { id: 'propriedade', label: `Propriedade: ${nomePropriedade}` },
  ]);

  // Atualiza chip de propriedade quando mudar
  useEffect(() => {
    setChips((prev) => {
      const rest = prev.filter((c) => c.id !== 'propriedade');
      return [{ id: 'propriedade', label: `Propriedade: ${nomePropriedade}` }, ...rest];
    });
  }, [nomePropriedade]);

  const addChip = (id: string, label: string) => {
    setChips((prev) => {
      if (prev.some((c) => c.id === id)) return prev; // Impede clicar infinitamente
      return [...prev, { id, label }];
    });
  };

  const removeChip = (id: string) => {
    setChips((prev) => prev.filter((c) => c.id !== id));
  };

  // Carrega dados do dashboard e lotes
  useEffect(() => {
    fetchDashboard(selected?.id)
      .then((data) => {
        setDashboard(data);
        if (data.lotes && data.lotes.length > 0) {
          setLotes(data.lotes);
        }
      })
      .catch(() => {});

    listLotes()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setLotes(data);
      })
      .catch(() => {});

    listAlertas({ resolvido: false })
      .then((res) => {
        const list = Array.isArray(res) ? res : (res as { data: Alerta[] }).data ?? [];
        setAlertas(list);
      })
      .catch(() => {});
  }, [selected?.id]);

  // Carrega leituras para o gráfico conforme o período
  useEffect(() => {
    const limit = periodoGrafico === '30d' ? 30 : periodoGrafico === '7d' ? 14 : 8;
    listLeituras({ limit })
      .then((data) => {
        setLeituras(Array.isArray(data) ? [...data].reverse() : []);
      })
      .catch(() => setLeituras([]));
  }, [periodoGrafico]);

  const hasCulturaChip = chips.some((c) => c.id === 'cultura');
  const hasLoteChip = chips.some((c) => c.id === 'lote');
  const hasSensorChip = chips.some((c) => c.id === 'sensor');

  const addChipCultura = () => {
    const culturaNome = lotes[0]?.cultura || 'Manga';
    addChip('cultura', `Cultura: ${culturaNome}`);
  };

  const addChipLote = () => {
    const loteNome = lotes[0]?.codigo || lotes[0]?.nome || 'Lote Principal';
    addChip('lote', `Lote: ${loteNome}`);
  };

  const addChipSensor = () => {
    const sensorCod = dashboard?.ultima_leitura?.sensor_codigo || 'ESP32-01';
    addChip('sensor', `Sensor: ${sensorCod}`);
  };

  // Cálculos do gráfico a partir de leituras reais
  const chartData = useMemo(() => {
    if (leituras.length === 0) return null;
    const temps = leituras.map((l) => l.temperatura).filter((t) => typeof t === 'number');
    if (temps.length === 0) return null;
    const maxTemp = Math.max(...temps);
    const minTemp = Math.min(...temps);
    const amplitude = +(maxTemp - minTemp).toFixed(1);
    return { maxTemp, minTemp, amplitude };
  }, [leituras]);

  const ultimaLeitura = dashboard?.ultima_leitura;
  const tempAtual = ultimaLeitura?.temperatura;
  const umidAtual = ultimaLeitura?.umidade;
  const totalLotes = dashboard?.resumo?.total_lotes ?? lotes.length;
  const areaTotal = dashboard?.resumo?.area_monitorada_ha ?? lotes.reduce((acc, l) => acc + (l.area_ha || l.area || 0), 0);
  const sensoresAtivos = dashboard?.resumo?.sensores_ativos ?? 0;
  const totalSensores = dashboard?.resumo?.total_sensores ?? 0;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Dashboard Climático
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            {nomePropriedade} · {municipioPropriedade} {ultimaLeitura?.data_hora ? `· última telemetria ${new Date(ultimaLeitura.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={exportLeiturasCsv}
            style={{ height: '40px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text)', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
              download
            </span>
            Exportar Leituras (CSV)
          </button>
        </div>
      </div>

      {/* Chips com proteção de clique único */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {chips.map((c) => (
          <div
            key={c.id}
            style={{ height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent-soft)', border: '1px solid var(--hp-sucesso-border)', borderRadius: '22px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent)' }}
          >
            {c.label}
            {c.id !== 'propriedade' && (
              <span
                style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', cursor: 'pointer' }}
                onClick={() => removeChip(c.id)}
              >
                close
              </span>
            )}
          </div>
        ))}
        {!hasCulturaChip && (
          <div
            style={{ height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', background: 'transparent', border: '1px dashed var(--hp-input-border)', borderRadius: '22px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer' }}
            onClick={addChipCultura}
          >
            + Cultura
          </div>
        )}
        {!hasLoteChip && (
          <div
            style={{ height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', background: 'transparent', border: '1px dashed var(--hp-input-border)', borderRadius: '22px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer' }}
            onClick={addChipLote}
          >
            + Lote
          </div>
        )}
        {!hasSensorChip && (
          <div
            style={{ height: '32px', padding: '0 12px', display: 'flex', alignItems: 'center', background: 'transparent', border: '1px dashed var(--hp-input-border)', borderRadius: '22px', fontSize: '12px', color: 'var(--hp-text-2)', cursor: 'pointer' }}
            onClick={addChipSensor}
          >
            + Sensor
          </div>
        )}
      </div>

      {/* Banner de Alerta Dinâmico */}
      {alertas.length > 0 && (
        <div style={{ background: 'var(--hp-critico-bg)', borderLeft: '3px solid var(--hp-critico)', borderRadius: '16px', padding: '20px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
          <div style={{ display: 'flex', gap: '14px' }}>
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '24px', lineHeight: '1', color: 'var(--hp-critico)' }}>
              warning
            </span>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '700', color: 'var(--hp-text)' }}>
                {alertas.length} alerta(s) de microclima ativo(s)
              </div>
              <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--hp-text-4)', marginTop: '4px', maxWidth: '720px' }}>
                {alertas[0]?.mensagem || 'Desvios de temperatura ou umidade registrados pelos sensores.'}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/alertas')}
            style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            Ver alertas
          </button>
        </div>
      )}

      {/* 4 Cards de Métricas Reais */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        {/* Card 1: Temperatura do Ar */}
        <div style={{ minHeight: '160px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: tempAtual != null ? (tempAtual > 32 ? 'var(--hp-critico)' : tempAtual > 30 ? 'var(--hp-atencao)' : 'var(--hp-accent)') : 'var(--hp-border)', display: 'block' }} />
            <span style={{ fontSize: '13px', lineHeight: '16px', fontWeight: '600' }}>
              Temperatura do ar
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '36px', lineHeight: '40px', fontWeight: '700', letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums' }}>
              {tempAtual != null ? Number(tempAtual).toFixed(1) : '--'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
              °C
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: tempAtual != null ? (tempAtual > 30 ? 'var(--hp-critico)' : 'var(--hp-accent)') : 'var(--hp-text-3)', marginTop: '2px' }}>
            {tempAtual != null ? (tempAtual > 30 ? '▲ Acima do ideal' : '✓ Faixa recomendada') : 'Aguardando leitura do ESP-32'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: 'auto', paddingTop: '10px' }}>
            Sensor: {ultimaLeitura?.sensor_codigo || 'Sem sensor'}
          </div>
        </div>

        {/* Card 2: Umidade do Ar */}
        <div style={{ minHeight: '160px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: umidAtual != null ? 'var(--hp-info)' : 'var(--hp-border)', display: 'block' }} />
            <span style={{ fontSize: '13px', lineHeight: '16px', fontWeight: '600' }}>
              Umidade do ar
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '36px', lineHeight: '40px', fontWeight: '700', letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums' }}>
              {umidAtual != null ? Number(umidAtual).toFixed(1) : '--'}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
              %
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: umidAtual != null ? 'var(--hp-accent)' : 'var(--hp-text-3)', marginTop: '2px' }}>
            {umidAtual != null ? '✓ Telemetria ativa' : 'Aguardando leitura do ESP-32'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: 'auto', paddingTop: '10px' }}>
            Sensor DHT22 / ESP-32
          </div>
        </div>

        {/* Card 3: Lotes e Área Monitorada */}
        <div style={{ minHeight: '160px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-accent)', display: 'block' }} />
            <span style={{ fontSize: '13px', lineHeight: '16px', fontWeight: '600' }}>
              Lotes monitorados
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '36px', lineHeight: '40px', fontWeight: '700', letterSpacing: '-.02em' }}>
              {totalLotes}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
              lote{totalLotes === 1 ? '' : 's'}
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent)', marginTop: '2px' }}>
            {areaTotal > 0 ? `${Number(areaTotal).toFixed(1)} ha monitorados` : '0 ha cadastrados'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: 'auto', paddingTop: '10px', cursor: 'pointer' }} onClick={() => navigate('/lotes')}>
            Gerenciar lotes ›
          </div>
        </div>

        {/* Card 4: Rede de Sensores ESP-32 */}
        <div style={{ minHeight: '160px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: sensoresAtivos > 0 ? 'var(--hp-accent)' : 'var(--hp-border)', display: 'block' }} />
            <span style={{ fontSize: '13px', lineHeight: '16px', fontWeight: '600' }}>
              Rede de sensores ESP-32
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '36px', lineHeight: '40px', fontWeight: '700', letterSpacing: '-.02em' }}>
              {sensoresAtivos} de {totalSensores}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
              on-line
            </span>
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: sensoresAtivos > 0 ? 'var(--hp-accent)' : 'var(--hp-text-3)', marginTop: '2px' }}>
            {sensoresAtivos > 0 ? '✓ Rede em operação' : 'Nenhum sensor ativo'}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: 'auto', paddingTop: '10px', cursor: 'pointer' }} onClick={() => navigate('/cadastros/sensores')}>
            Configurar sensores ›
          </div>
        </div>
      </div>

      {/* Clima da região (Open-Meteo) junto com o clima no hectare (ESP32) */}
      <ClimaComparativo
        latitude={selected?.latitude}
        longitude={selected?.longitude}
        local={`${nomePropriedade} · ${municipioPropriedade}`}
        leitura={ultimaLeitura}
      />

      {/* Grid Principal: Gráfico Dinâmico + Lista de Alertas */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Gráfico de Evolução Climática */}
        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600' }}>
                Evolução Climática
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)' }}>
                  <span style={{ width: '10px', height: '3px', background: 'var(--hp-temp)', display: 'block', borderRadius: '2px' }} />
                  Temperatura (°C)
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)' }}>
                  <span style={{ width: '10px', height: '3px', background: 'var(--hp-info)', display: 'block', borderRadius: '2px' }} />
                  Umidade do ar (%)
                </div>
              </div>
            </div>

            {/* Abas funcionais de período 24h / 7d / 30d */}
            <div style={{ display: 'flex', gap: '4px', background: 'var(--hp-surface-2)', borderRadius: '12px', padding: '3px' }}>
              {(['24h', '7d', '30d'] as const).map((periodo) => (
                <div
                  key={periodo}
                  onClick={() => setPeriodoGrafico(periodo)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    background: periodoGrafico === periodo ? 'var(--hp-surface)' : 'transparent',
                    color: periodoGrafico === periodo ? 'var(--hp-text)' : 'var(--hp-text-2)',
                    fontSize: '12px',
                    fontWeight: '600',
                    boxShadow: periodoGrafico === periodo ? '0 1px 2px rgba(22,21,15,.06)' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {periodo === '24h' ? '24 h' : periodo}
                </div>
              ))}
            </div>
          </div>

          {leituras.length === 0 ? (
            <div style={{ padding: '64px 20px', textAlign: 'center', color: 'var(--hp-text-2)' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '40px', color: 'var(--hp-text-3)', display: 'block', marginBottom: '8px' }}>
                sensors
              </span>
              <div style={{ fontWeight: '600', fontSize: '15px', color: 'var(--hp-text)' }}>
                Aguardando telemetria do ESP-32
              </div>
              <div style={{ fontSize: '12px', marginTop: '4px', maxWidth: '420px', margin: '4px auto 0' }}>
                Conecte seus sensores via HTTP <code>POST /api/sensores/leitura</code> ou MQTT (ThingSpeak) para visualizar a evolução climática em tempo real.
              </div>
            </div>
          ) : (
            <>
              {/* Gráfico SVG com leituras reais */}
              <div style={{ overflowX: 'auto', marginTop: '16px' }}>
                <svg viewBox="0 0 800 240" style={{ width: '100%', height: '240px', overflow: 'visible' }}>
                  {/* Linhas de grade */}
                  <line x1="40" y1="40" x2="760" y2="40" stroke="var(--hp-border)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="100" x2="760" y2="100" stroke="var(--hp-border)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="160" x2="760" y2="160" stroke="var(--hp-border)" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="40" y1="210" x2="760" y2="210" stroke="var(--hp-border)" strokeWidth="1" />

                  {/* Curva de temperatura */}
                  <polyline
                    fill="none"
                    stroke="var(--hp-temp)"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    points={leituras
                      .map((l, idx) => {
                        const x = 50 + (idx / Math.max(leituras.length - 1, 1)) * 700;
                        const y = 200 - Math.min(Math.max((l.temperatura - 15) * 6, 10), 180);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Curva de umidade */}
                  <polyline
                    fill="none"
                    stroke="var(--hp-info)"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    strokeLinejoin="round"
                    points={leituras
                      .map((l, idx) => {
                        const x = 50 + (idx / Math.max(leituras.length - 1, 1)) * 700;
                        const y = 200 - Math.min(Math.max((l.umidade - 20) * 2, 10), 180);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />

                  {/* Pontos nas leituras */}
                  {leituras.map((l, idx) => {
                    const x = 50 + (idx / Math.max(leituras.length - 1, 1)) * 700;
                    const y = 200 - Math.min(Math.max((l.temperatura - 15) * 6, 10), 180);
                    return (
                      <g key={l.id}>
                        <circle cx={x} cy={y} r="4" fill="var(--hp-temp)" stroke="var(--hp-surface)" strokeWidth="2" />
                        <text x={x} y="226" textAnchor="middle" style={{ font: '400 11px Inter, sans-serif', fill: 'var(--hp-text-2)' }}>
                          {new Date(l.data_hora).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {chartData && (
                <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', borderTop: '1px solid var(--hp-border)', paddingTop: '12px', marginTop: '12px' }}>
                  Máxima de {chartData.maxTemp.toFixed(1)} °C · Mínima de {chartData.minTemp.toFixed(1)} °C · Amplitude térmica de {chartData.amplitude} °C
                </div>
              )}
            </>
          )}
        </div>

        {/* Lista Lateral de Alertas Ativos */}
        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600' }}>
              Alertas ativos ({alertas.length})
            </div>
            <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer' }} onClick={() => navigate('/alertas')}>
              Ver todos ›
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            {alertas.length === 0 ? (
              <div style={{ padding: '24px 12px', textAlign: 'center', color: 'var(--hp-text-2)', fontSize: '13px' }}>
                ✓ Nenhum alerta pendente no momento.
              </div>
            ) : (
              alertas.slice(0, 3).map((al) => {
                const isCritico = (al.tipo || '').toLowerCase().includes('critico') || (al.tipo || '').toLowerCase().includes('alta');
                return (
                  <div key={al.id} style={{ border: '1px solid var(--hp-border)', borderLeft: `3px solid ${isCritico ? 'var(--hp-critico)' : 'var(--hp-atencao)'}`, borderRadius: '12px', padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: isCritico ? 'var(--hp-critico)' : 'var(--hp-atencao)' }}>
                        {al.tipo}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', marginTop: '6px', color: 'var(--hp-text)' }}>
                      {al.mensagem}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
                      Sensor: {al.sensor_codigo || al.sensor_id} · {al.lote_nome || ''}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Seção de Lotes Reais Cadastrados */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700' }}>
            Lotes monitorados ({lotes.length})
          </div>
          <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer' }} onClick={() => navigate('/lotes')}>
            Ver todos os lotes ›
          </div>
        </div>

        {lotes.length === 0 ? (
          <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '36px', textAlign: 'center', marginTop: '14px', color: 'var(--hp-text-2)' }}>
            Nenhum lote cadastrado nesta propriedade.{' '}
            <span style={{ color: 'var(--hp-accent)', cursor: 'pointer', fontWeight: '600' }} onClick={() => navigate('/lotes')}>
              Cadastrar primeiro lote ›
            </span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '14px' }}>
            {lotes.map((lote) => (
              <div
                key={lote.id}
                onClick={() => navigate(`/lotes/${lote.id}`)}
                style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px', cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600' }}>
                      {lote.codigo || lote.nome} · {lote.cultura || 'Cultura Geral'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>
                      {lote.variedade || 'Variedade padrão'} · {lote.area_ha || lote.area || 0} ha
                    </div>
                  </div>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      height: '22px',
                      padding: '0 8px',
                      borderRadius: '12px',
                      background: lote.status === 'ativo' ? 'var(--hp-accent-soft)' : 'var(--hp-surface-2)',
                      color: lote.status === 'ativo' ? 'var(--hp-accent)' : 'var(--hp-text-2)',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}
                  >
                    {lote.status}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginTop: '16px' }}>
                  <div>
                    <div style={{ fontSize: '20px', lineHeight: '26px', fontWeight: '700' }}>
                      {lote.ultima_temperatura != null ? `${Number(lote.ultima_temperatura).toFixed(1)}°C` : '--'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
                      temperatura
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', lineHeight: '26px', fontWeight: '700' }}>
                      {lote.ultima_umidade != null ? `${Number(lote.ultima_umidade).toFixed(1)}%` : '--'}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
                      umidade do ar
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', fontSize: '12px', color: 'var(--hp-text-2)', borderTop: '1px solid var(--hp-border)', paddingTop: '10px' }}>
                  <span>Sensor: {lote.sensor_vinculado || 'Nenhum'}</span>
                  <span style={{ color: 'var(--hp-accent)', fontWeight: '600' }}>Abrir lote ›</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé Ticker com Link Funcional para Janela de Exportação */}
      <div style={{ height: '56px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text-2)' }}>
          <span>{nomePropriedade} · {municipioPropriedade}</span>
          <span style={{ color: 'var(--hp-border)' }}>|</span>
          <span>{sensoresAtivos} sensor(es) ESP-32 ativos</span>
        </div>
        <div
          onClick={() => navigate('/inteligencia/exportacao')}
          style={{ fontSize: '13px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          Janela de exportação &amp; logística ›
        </div>
      </div>
    </>
  );
}
