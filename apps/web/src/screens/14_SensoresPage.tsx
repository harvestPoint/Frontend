import React, { useState, useEffect } from 'react';
import { listSensores, createSensor, updateSensor, deleteSensor, listLotes, createLeitura, readApiError, type Sensor, type Lote } from '@/lib/api';

export default function SensoresPage() {
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [loading, setLoading] = useState(true);
  // A tela inteira só vira "Carregando..." na primeira vez; recargas depois
  // (ex.: após simular uma leitura) atualizam a lista sem apagar a página.
  const [jaCarregou, setJaCarregou] = useState(false);
  const [editando, setEditando] = useState<Sensor | null>(null);
  const [formErro, setFormErro] = useState('');
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [showGuiaEsp32, setShowGuiaEsp32] = useState(false);
  const [testandoEsp32, setTestandoEsp32] = useState(false);
  const [testeMsg, setTesteMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [codigoInput, setCodigoInput] = useState('');
  const [loteIdInput, setLoteIdInput] = useState<number | ''>('');
  const [statusInput, setStatusInput] = useState('ATIVO');

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [sensData, lotesData] = await Promise.all([
        listSensores(),
        listLotes(),
      ]);
      setSensores(Array.isArray(sensData) ? sensData : []);
      setLotes(Array.isArray(lotesData) ? lotesData : []);
      if (lotesData.length > 0 && loteIdInput === '') {
        setLoteIdInput(lotesData[0].id);
      }
    } catch (err: unknown) {
      setError(readApiError(err).message || 'Falha ao carregar sensores.');
    } finally {
      setLoading(false);
      setJaCarregou(true);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function abrirNovo() {
    setEditando(null);
    setFormErro('');
    setCodigoInput('');
    setStatusInput('ATIVO');
    if (lotes.length > 0 && loteIdInput === '') setLoteIdInput(lotes[0].id);
    setShowForm(true);
  }

  function abrirEdicao(s: Sensor) {
    setEditando(s);
    setFormErro('');
    setCodigoInput(s.codigo);
    setLoteIdInput(s.lote_id);
    setStatusInput((s.status || 'ATIVO').toUpperCase());
    setShowForm(true);
  }

  function fecharForm() {
    setShowForm(false);
    setEditando(null);
    setFormErro('');
  }

  async function handleSalvar(e: React.FormEvent) {
    e.preventDefault();
    if (saving) return;
    if (!codigoInput.trim()) return setFormErro('Informe o código ou MAC do sensor.');
    if (!loteIdInput) return setFormErro('Selecione um lote para vincular o sensor.');

    const dados = { codigo: codigoInput.trim().toUpperCase(), lote_id: Number(loteIdInput), status: statusInput };
    try {
      setSaving(true);
      setFormErro('');
      if (editando) {
        const salvo = await updateSensor(editando.id, dados);
        setSensores((prev) => prev.map((s) => (s.id === salvo.id ? salvo : s)));
      } else {
        const novo = await createSensor(dados);
        setSensores((prev) => [novo, ...prev]);
      }
      fecharForm();
    } catch (err: unknown) {
      const apiErr = readApiError(err);
      setFormErro(apiErr.details?.join(' · ') || apiErr.message || 'Erro ao salvar sensor.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(s: Sensor) {
    if (!window.confirm(`Remover o sensor ${s.codigo}? As leituras e alertas dele também serão apagados.`)) return;
    try {
      setError('');
      await deleteSensor(s.id);
      setSensores((prev) => prev.filter((x) => x.id !== s.id));
    } catch (err: unknown) {
      setError(readApiError(err).message || 'Erro ao excluir sensor.');
    }
  }

  async function testarLeituraEsp32() {
    try {
      setTestandoEsp32(true);
      setTesteMsg('');
      const cod = codigoInput.trim() || (sensores[0]?.codigo) || 'ESP32-01';
      const tempRand = +(26.0 + Math.random() * 8.0).toFixed(1);
      const umidRand = +(50.0 + Math.random() * 25.0).toFixed(1);
      const res = await createLeitura({
        codigo: cod,
        temperatura: tempRand,
        umidade: umidRand,
      });
      setTesteMsg(`✓ Telemetria registrada: Sensor ${res.sensor_codigo || cod} -> ${tempRand} °C, ${umidRand} %`);
      await loadData();
    } catch (err) {
      setTesteMsg(`Falha ao enviar telemetria: ${readApiError(err).message}`);
    } finally {
      setTestandoEsp32(false);
    }
  }

  const filteredSensores = sensores.filter((s) => {
    const matchBusca = (s.codigo || '').toLowerCase().includes(busca.toLowerCase()) ||
      (s.lote_nome || '').toLowerCase().includes(busca.toLowerCase());
    const matchStatus = filtroStatus === 'todos' || s.status?.toUpperCase() === filtroStatus.toUpperCase();
    return matchBusca && matchStatus;
  });

  if (loading && !jaCarregou) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando sensores...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Sensores IoT
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Dispositivos ESP-32 de telemetria instalados em campo · {sensores.length} sensores registrados
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setShowGuiaEsp32(!showGuiaEsp32)}
            style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', color: 'var(--hp-text)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-accent)' }}>
              sensors
            </span>
            {showGuiaEsp32 ? 'Fechar Guia ESP-32' : 'Integração ESP-32'}
          </button>
          <button
            type="button"
            onClick={() => (showForm ? fecharForm() : abrirNovo())}
            style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
              {showForm ? 'close' : 'add'}
            </span>
            {showForm ? 'Cancelar' : 'Novo sensor'}
          </button>
        </div>
      </div>

      {showGuiaEsp32 && (
        <div style={{ background: 'var(--hp-surface)', border: '1.5px solid var(--hp-accent)', borderRadius: '16px', padding: '20px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontWeight: 700, fontSize: '16px', color: 'var(--hp-text)' }}>
              Guia de Integração e Ingestão ESP-32 + DHT22
            </div>
            <button
              type="button"
              disabled={testandoEsp32}
              onClick={testarLeituraEsp32}
              style={{ height: '36px', padding: '0 14px', background: 'var(--hp-accent)', color: '#FFFFFF', border: 'none', borderRadius: '10px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '16px' }}>sensors</span>
              {testandoEsp32 ? 'Enviando telemetria...' : 'Simular Leitura ESP-32 Agora'}
            </button>
          </div>
          {testeMsg && (
            <div style={{ padding: '8px 12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', borderRadius: '8px', fontSize: '12px', fontWeight: 600 }}>
              {testeMsg}
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', fontSize: '13px' }}>
            <div style={{ background: 'var(--hp-surface-2)', padding: '12px', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--hp-text)' }}>Endpoint de Ingestão:</strong>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', marginTop: '4px', color: 'var(--hp-accent)' }}>
                POST /api/sensores/leitura
              </div>
              <div style={{ fontSize: '11px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
                Livre de autenticação para o firmware enviar direto pelo ESP32.
              </div>
            </div>
            <div style={{ background: 'var(--hp-surface-2)', padding: '12px', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--hp-text)' }}>Payload JSON esperado:</strong>
              <pre style={{ fontFamily: 'monospace', fontSize: '11px', margin: '4px 0 0', color: 'var(--hp-text)' }}>
{`{
  "codigo": "ESP32-01",
  "temperatura": 28.5,
  "umidade": 65.0
}`}
              </pre>
            </div>
            <div style={{ background: 'var(--hp-surface-2)', padding: '12px', borderRadius: '10px' }}>
              <strong style={{ color: 'var(--hp-text)' }}>Código C++ do Firmware:</strong>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
                Disponível em <code style={{ color: 'var(--hp-accent)' }}>firmware/esp32_harvestpoint.ino</code> com suporte a reconexão WiFi e HTTPClient.
              </div>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSalvar} noValidate style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-accent)', borderRadius: '16px', padding: '20px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--hp-text)' }}>
            {editando ? `Editar sensor · ${editando.codigo}` : 'Cadastrar Novo Sensor ESP-32'}
          </div>
          {formErro ? (
            <div role="alert" style={{ fontSize: '13px', color: 'var(--hp-critico)', background: 'var(--hp-critico-bg)', borderRadius: '10px', padding: '10px 12px' }}>{formErro}</div>
          ) : null}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Código / MAC Address
              </label>
              <input
                type="text"
                placeholder="Ex: ESP32-01 ou 24:6F:28:A1:B2"
                value={codigoInput}
                onChange={(e) => setCodigoInput(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Lote Vinculado
              </label>
              <select
                value={loteIdInput}
                onChange={(e) => setLoteIdInput(Number(e.target.value))}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              >
                {lotes.map((lote) => (
                  <option key={lote.id} value={lote.id}>
                    {lote.nome || lote.codigo} ({lote.cultura || 'Geral'})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                {editando ? 'Status' : 'Status Inicial'}
              </label>
              <select
                value={statusInput}
                onChange={(e) => setStatusInput(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
              >
                <option value="ATIVO">ATIVO</option>
                <option value="MANUTENCAO">MANUTENÇÃO</option>
                <option value="INATIVO">INATIVO</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={fecharForm}
              style={{ height: '36px', padding: '0 14px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'transparent', color: 'var(--hp-text-2)', fontSize: '13px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ height: '36px', padding: '0 18px', borderRadius: '10px', border: 'none', background: 'var(--hp-accent)', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
            >
              {saving ? 'Salvando...' : editando ? 'Salvar alterações' : 'Salvar Sensor'}
            </button>
          </div>
        </form>
      )}

      {error && (
        <div style={{ padding: '16px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', borderRadius: '12px', margin: '16px 0' }}>
          {error}
        </div>
      )}

      <div style={{ height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px', marginTop: '16px' }}>
        <div style={{ flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)' }}>
            search
          </span>
          <input
            type="text"
            placeholder="Buscar por código ou lote..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: 'var(--hp-text)' }}
          />
        </div>
        <select
          value={filtroStatus}
          onChange={(e) => setFiltroStatus(e.target.value)}
          style={{ height: '44px', padding: '0 12px', borderRadius: '12px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-surface)', fontSize: '13px', fontWeight: '600', color: 'var(--hp-text)' }}
        >
          <option value="todos">Todos os Status</option>
          <option value="ATIVO">Ativos</option>
          <option value="MANUTENCAO">Manutenção</option>
          <option value="INATIVO">Inativos</option>
        </select>
      </div>

      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden', marginTop: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                CÓDIGO (MAC)
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                LOTE
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                ÚLTIMA LEITURA
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                STATUS
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSensores.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--hp-text-2)', fontSize: '14px' }}>
                  Nenhum sensor encontrado.
                </td>
              </tr>
            ) : (
              filteredSensores.map((s) => {
                const isAtivo = s.status === 'ATIVO';
                const isManut = s.status === 'MANUTENCAO';
                return (
                  <tr key={s.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                    <td style={{ padding: '0 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)' }}>
                      {s.codigo}
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '14px', color: 'var(--hp-text)' }}>
                      {s.lote_nome || `Lote #${s.lote_id}`}
                    </td>
                    <td style={{ padding: '0 16px', fontSize: '13px', color: 'var(--hp-text-2)' }}>
                      {s.ultima_temperatura != null ? `${s.ultima_temperatura.toFixed(1)} °C · ${s.ultima_umidade?.toFixed(1)} %` : 'Aguardando telemetria...'}
                    </td>
                    <td style={{ padding: '0 16px' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '24px',
                          padding: '0 10px',
                          borderRadius: '12px',
                          background: isAtivo ? 'var(--hp-accent-soft)' : isManut ? 'var(--hp-atencao-bg)' : 'var(--hp-surface-2)',
                          color: isAtivo ? 'var(--hp-accent)' : isManut ? 'var(--hp-atencao)' : 'var(--hp-text-3)',
                          fontSize: '12px',
                          fontWeight: '600',
                        }}
                      >
                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isAtivo ? 'var(--hp-accent)' : isManut ? 'var(--hp-atencao)' : 'var(--hp-text-3)' }} />
                        {s.status}
                      </span>
                    </td>
                    <td style={{ padding: '0 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => abrirEdicao(s)}
                        title="Editar sensor"
                        aria-label={`Editar ${s.codigo}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--hp-text-2)', padding: '6px' }}
                      >
                        <span aria-hidden="true" style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                          edit
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s)}
                        title="Excluir sensor"
                        aria-label={`Excluir ${s.codigo}`}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--hp-critico)', padding: '6px' }}
                      >
                        <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                          delete
                        </span>
                      </button>
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
