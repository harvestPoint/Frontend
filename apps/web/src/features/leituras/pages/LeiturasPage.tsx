import React, { useState, useEffect } from 'react';
import { listLeituras, createLeitura, exportLeiturasCsv, listSensores, formatDateTime, type Leitura, type Sensor } from '@/lib/api';

export default function LeiturasPage() {
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroForaFaixa, setFiltroForaFaixa] = useState(false);

  // Manual Form
  const [showManual, setShowManual] = useState(false);
  const [savingManual, setSavingManual] = useState(false);
  const [selectedSensorId, setSelectedSensorId] = useState<number | ''>('');
  const [tempInput, setTempInput] = useState('28.5');
  const [umidInput, setUmidInput] = useState('65.0');

  // Simulator
  const [gerandoSimulacao, setGerandoSimulacao] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [leiturasData, sensoresData] = await Promise.all([
        listLeituras({ limit: 50 }),
        listSensores(),
      ]);
      setLeituras(Array.isArray(leiturasData) ? leiturasData : []);
      setSensores(Array.isArray(sensoresData) ? sensoresData : []);
      if (sensoresData.length > 0 && selectedSensorId === '') {
        setSelectedSensorId(sensoresData[0].id);
      }
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Falha ao carregar histórico de leituras.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleSalvarManual(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSensorId) {
      alert('Selecione um sensor para registrar a leitura.');
      return;
    }

    try {
      setSavingManual(true);
      const nova = await createLeitura({
        sensor_id: Number(selectedSensorId),
        temperatura: parseFloat(tempInput) || 25,
        umidade: parseFloat(umidInput) || 60,
      });
      setLeituras((prev) => [nova, ...prev]);
      setShowManual(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message || 'Erro ao registrar leitura.');
    } finally {
      setSavingManual(false);
    }
  }

  async function handleGerarAgora() {
    if (sensores.length === 0) {
      alert('Nenhum sensor cadastrado para gerar leitura.');
      return;
    }
    const sensor = sensores[0];
    const tempRandom = +(24 + Math.random() * 11).toFixed(1);
    const umidRandom = +(45 + Math.random() * 35).toFixed(1);

    try {
      setGerandoSimulacao(true);
      const nova = await createLeitura({
        sensor_id: sensor.id,
        codigo: sensor.codigo,
        temperatura: tempRandom,
        umidade: umidRandom,
      });
      setLeituras((prev) => [nova, ...prev]);
    } catch {
      alert('Erro ao enviar telemetria simulada.');
    } finally {
      setGerandoSimulacao(false);
    }
  }

  const filtered = leituras.filter((l) => {
    const matchBusca = (l.sensor_codigo || '').toLowerCase().includes(busca.toLowerCase()) ||
      (l.lote_nome || '').toLowerCase().includes(busca.toLowerCase());
    const matchFaixa = !filtroForaFaixa || l.temperatura > 31.0 || l.temperatura < 20.0 || l.umidade < 40.0;
    return matchBusca && matchFaixa;
  });

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando telemetria...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Leituras IoT
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Histórico de telemetria recebida via ESP-32 · {leituras.length} leituras recentes
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
            Exportar CSV
          </button>
          <button
            type="button"
            onClick={() => setShowManual(!showManual)}
            style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
              {showManual ? 'close' : 'add'}
            </span>
            {showManual ? 'Fechar Registro' : 'Registro manual'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'stretch', marginTop: '16px' }}>
        {/* Simulador ESP-32 */}
        <div style={{ border: '1px solid var(--hp-sucesso-border)', background: 'var(--hp-bg)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--hp-accent)', display: 'inline-block' }} />
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-accent)' }}>
              SIMULADOR DE TELEMETRIA ESP-32
            </span>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '10px' }}>
            Dispare um sinal de telemetria imediato para testar o gatilho automático de alertas e o motor heurístico de colheita.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', paddingTop: '16px' }}>
            <button
              type="button"
              disabled={gerandoSimulacao}
              onClick={handleGerarAgora}
              style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: gerandoSimulacao ? 'not-allowed' : 'pointer' }}
            >
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                bolt
              </span>
              {gerandoSimulacao ? 'Enviando...' : 'Gerar telemetria agora'}
            </button>
          </div>
        </div>

        {/* Registro Manual */}
        {showManual ? (
          <form onSubmit={handleSalvarManual} style={{ border: '1px solid var(--hp-border)', background: 'var(--hp-surface)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '15px', fontWeight: '600' }}>
              Novo Registro Manual de Microclima
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--hp-text-2)' }}>
                Sensor
              </label>
              <select
                value={selectedSensorId}
                onChange={(e) => setSelectedSensorId(Number(e.target.value))}
                style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '13px' }}
                required
              >
                {sensores.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.codigo} ({s.lote_nome || `Lote ${s.lote_id}`})
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--hp-text-2)' }}>
                  Temperatura °C
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '13px' }}
                  required
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '4px', color: 'var(--hp-text-2)' }}>
                  Umidade do Ar %
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={umidInput}
                  onChange={(e) => setUmidInput(e.target.value)}
                  style={{ width: '100%', height: '38px', padding: '0 10px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '13px' }}
                  required
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
              <button
                type="submit"
                disabled={savingManual}
                style={{ height: '36px', padding: '0 16px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '10px', fontSize: '12px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
              >
                {savingManual ? 'Gravando...' : 'Salvar leitura'}
              </button>
            </div>
          </form>
        ) : (
          <div style={{ border: '1px solid var(--hp-border)', background: 'var(--hp-surface)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '15px', fontWeight: '600' }}>
              ESP-32 Endpoint Aberto
            </div>
            <p style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '8px' }}>
              Seus microcontroladores podem enviar leituras diretamente via HTTP POST sem autenticação:
            </p>
            <code style={{ fontSize: '12px', padding: '8px 12px', background: 'var(--hp-surface-2)', borderRadius: '8px', color: 'var(--hp-accent)', marginTop: '8px', display: 'block', wordBreak: 'break-all' }}>
              POST /api/sensores/leitura {"{ \"codigo\": \"ESP32-01\", \"temperatura\": 29.5, \"umidade\": 65.0 }"}
            </code>
          </div>
        )}
      </div>

      {error && (
        <div style={{ padding: '16px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', borderRadius: '12px', margin: '16px 0' }}>
          {error}
        </div>
      )}

      {/* Barra de Filtro */}
      <div style={{ height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', marginTop: '16px' }}>
        <div style={{ flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)' }}>
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por sensor ou lote..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: 'var(--hp-text)' }}
          />
        </div>
        <button
          type="button"
          onClick={() => setFiltroForaFaixa(!filtroForaFaixa)}
          style={{
            height: '36px',
            padding: '0 14px',
            borderRadius: '18px',
            border: `1px solid ${filtroForaFaixa ? 'var(--hp-critico)' : 'var(--hp-input-border)'}`,
            background: filtroForaFaixa ? 'var(--hp-critico-bg)' : 'transparent',
            color: filtroForaFaixa ? 'var(--hp-critico)' : 'var(--hp-text-2)',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {filtroForaFaixa ? '✓ Apenas Fora da Faixa' : 'Mostrar Fora da Faixa'}
        </button>
      </div>

      {/* Tabela de Leituras */}
      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden', marginTop: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                SENSOR
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                LOTE
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                DATA / HORA
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                TEMPERATURA
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                UMIDADE DO AR
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--hp-text-2)' }}>
                  Nenhuma leitura encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((item) => {
                const tempColor = item.temperatura > 32 ? 'var(--hp-critico)' : item.temperatura > 30 ? 'var(--hp-atencao)' : 'var(--hp-accent)';
                return (
                  <tr key={item.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                    <td style={{ padding: '0 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '600', color: 'var(--hp-text)' }}>
                      {item.sensor_codigo || `Sensor #${item.sensor_id}`}
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '14px', color: 'var(--hp-text-2)' }}>
                      {item.lote_nome || `Lote #${item.lote_id || '-'}`}
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                      {formatDateTime(item.data_hora)}
                    </td>
                    <td style={{ padding: '0 16px', textAlign: 'right', fontSize: '14px', fontWeight: '700', color: tempColor, fontVariantNumeric: 'tabular-nums' }}>
                      {Number(item.temperatura).toFixed(1)} °C
                    </td>
                    <td style={{ padding: '0 16px', textAlign: 'right', fontSize: '14px', color: 'var(--hp-text)', fontVariantNumeric: 'tabular-nums' }}>
                      {Number(item.umidade).toFixed(1)} %
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
