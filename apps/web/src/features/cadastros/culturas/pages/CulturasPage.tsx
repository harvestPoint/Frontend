import React, { useState, useEffect } from 'react';
import { listCulturas, createCultura, deleteCultura, type Cultura } from '@/lib/api';

export default function CulturasPage() {
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [ciclo, setCiclo] = useState('120');
  const [tempMin, setTempMin] = useState('20.0');
  const [tempMax, setTempMax] = useState('32.0');
  const [umidMin, setUmidMin] = useState('50.0');
  const [umidMax, setUmidMax] = useState('80.0');

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const data = await listCulturas();
      setCulturas(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Falha ao carregar culturas.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!nome.trim()) {
      alert('Informe o nome da cultura.');
      return;
    }

    try {
      setSaving(true);
      const nova = await createCultura({
        nome: nome.trim(),
        ciclo_medio_dias: Number(ciclo) || 120,
        temperatura_min: Number(tempMin) || 20,
        temperatura_max: Number(tempMax) || 32,
        umidade_min: Number(umidMin) || 50,
        umidade_max: Number(umidMax) || 80,
      });
      setCulturas((prev) => [nova, ...prev]);
      setNome('');
      setShowForm(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message || 'Erro ao criar cultura.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Deseja excluir esta cultura?')) return;
    try {
      await deleteCultura(id);
      setCulturas((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert('Erro ao excluir cultura.');
    }
  }

  const filtered = culturas.filter((c) =>
    (c.nome || '').toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando culturas...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Culturas Agrícolas
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Base de conhecimento agronômico e limites de microclima · {culturas.length} culturas cadastradas
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
        >
          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
            {showForm ? 'close' : 'add'}
          </span>
          {showForm ? 'Cancelar' : 'Nova cultura'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-accent)', borderRadius: '16px', padding: '20px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--hp-text)' }}>Cadastrar Nova Cultura</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Nome da Cultura
              </label>
              <input
                type="text"
                placeholder="Ex: Uva Crimson Seedless"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Ciclo Médio (dias)
              </label>
              <input
                type="number"
                value={ciclo}
                onChange={(e) => setCiclo(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Temperatura Mínima (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={tempMin}
                onChange={(e) => setTempMin(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Temperatura Máxima (°C)
              </label>
              <input
                type="number"
                step="0.5"
                value={tempMax}
                onChange={(e) => setTempMax(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Umidade Mínima (%)
              </label>
              <input
                type="number"
                step="1"
                value={umidMin}
                onChange={(e) => setUmidMin(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Umidade Máxima (%)
              </label>
              <input
                type="number"
                step="1"
                value={umidMax}
                onChange={(e) => setUmidMax(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{ height: '36px', padding: '0 14px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'transparent', color: 'var(--hp-text-2)', fontSize: '13px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{ height: '36px', padding: '0 18px', borderRadius: '10px', border: 'none', background: 'var(--hp-accent)', color: '#fff', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}
            >
              {saving ? 'Salvando...' : 'Salvar Cultura'}
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
            placeholder="Buscar por nome da cultura..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '14px', color: 'var(--hp-text)' }}
          />
        </div>
      </div>

      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden', marginTop: '16px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                CULTURA
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                FAIXA DE TEMPERATURA
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                FAIXA DE UMIDADE
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                CICLO (DIAS)
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                AÇÕES
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: 'var(--hp-text-2)', fontSize: '14px' }}>
                  Nenhuma cultura encontrada.
                </td>
              </tr>
            ) : (
              filtered.map((cult) => (
                <tr key={cult.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                  <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)' }}>
                    {cult.nome}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {cult.temperatura_min} – {cult.temperatura_max} °C
                    </span>
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                      {cult.umidade_min} – {cult.umidade_max} %
                    </span>
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {cult.ciclo_medio_dias} dias
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(cult.id)}
                      title="Excluir cultura"
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--hp-critico)', padding: '6px' }}
                    >
                      <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                        delete
                      </span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
