import React, { useState, useEffect } from 'react';
import { listPropriedades, createPropriedade, deletePropriedade, type Propriedade } from '@/lib/api';

export default function PropriedadesPage() {
  const [propriedades, setPropriedades] = useState<Propriedade[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busca, setBusca] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState('');
  const [municipio, setMunicipio] = useState('Petrolina - PE');
  const [areaTotal, setAreaTotal] = useState('100');
  const [latitude, setLatitude] = useState('-9.3891');
  const [longitude, setLongitude] = useState('-40.5027');

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const data = await listPropriedades();
      setPropriedades(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e?.message || 'Falha ao carregar propriedades.');
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
      alert('Informe o nome da propriedade.');
      return;
    }

    try {
      setSaving(true);
      const nova = await createPropriedade({
        nome: nome.trim(),
        municipio: municipio.trim(),
        area_total: Number(areaTotal) || 50,
        latitude: Number(latitude) || -9.3891,
        longitude: Number(longitude) || -40.5027,
      });
      setPropriedades((prev) => [nova, ...prev]);
      setNome('');
      setShowForm(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      alert(e?.response?.data?.message || 'Erro ao criar propriedade.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm('Deseja excluir esta propriedade? Todos os lotes associados serão removidos.')) return;
    try {
      await deletePropriedade(id);
      setPropriedades((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Erro ao excluir propriedade.');
    }
  }

  const filtered = propriedades.filter((p) =>
    (p.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (p.municipio || '').toLowerCase().includes(busca.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: '24px', fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando propriedades...</div>;
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
            Propriedades Agrícolas
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Locais de cultivo e fazendas no Vale do São Francisco · {propriedades.length} propriedades registradas
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
          {showForm ? 'Cancelar' : 'Nova propriedade'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-accent)', borderRadius: '16px', padding: '20px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ fontWeight: '700', fontSize: '15px', color: 'var(--hp-text)' }}>Cadastrar Nova Propriedade</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Nome da Fazenda / Propriedade
              </label>
              <input
                type="text"
                placeholder="Ex: Fazenda Boa Vista"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Município / UF
              </label>
              <input
                type="text"
                value={municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Área Total (ha)
              </label>
              <input
                type="number"
                step="0.1"
                value={areaTotal}
                onChange={(e) => setAreaTotal(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Latitude
              </label>
              <input
                type="text"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', marginBottom: '6px', color: 'var(--hp-text-2)' }}>
                Longitude
              </label>
              <input
                type="text"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                style={{ width: '100%', height: '40px', padding: '0 12px', borderRadius: '10px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-bg)', color: 'var(--hp-text)', fontSize: '14px' }}
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
              {saving ? 'Salvando...' : 'Salvar Propriedade'}
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
            placeholder="Buscar por propriedade ou município..."
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
                PROPRIEDADE
              </th>
              <th style={{ textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                MUNICÍPIO / UF
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                ÁREA (HA)
              </th>
              <th style={{ textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                COORDENADAS
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
                  Nenhuma propriedade cadastrada.
                </td>
              </tr>
            ) : (
              filtered.map((prop) => (
                <tr key={prop.id} style={{ height: '52px', borderTop: '1px solid var(--hp-border)' }}>
                  <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)' }}>
                    {prop.nome}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px', color: 'var(--hp-text)' }}>
                    {prop.municipio}
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '14px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {prop.area_total} ha
                  </td>
                  <td style={{ padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {prop.latitude?.toFixed(4)}, {prop.longitude?.toFixed(4)}
                  </td>
                  <td style={{ padding: '0 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(prop.id)}
                      title="Excluir propriedade"
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
