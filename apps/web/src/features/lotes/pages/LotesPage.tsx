// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LotesVazioState from '@/features/lotes/components/LotesVazioState';
import { useAuth } from '@/contexts/AuthContext';
import {
  createLote,
  deleteLote,
  listLotes,
  readApiError,
  updateLote,
  type Lote,
} from '@/lib/api';

type FormState = {
  codigo: string;
  propriedade: string;
  cultura: string;
  variedade: string;
  area_ha: string;
  data_plantio: string;
  sensor_vinculado: string;
  status: string;
};

const emptyForm = (propriedade: string): FormState => ({
  codigo: '',
  propriedade,
  cultura: 'Manga',
  variedade: 'Tommy Atkins',
  area_ha: '',
  data_plantio: '',
  sensor_vinculado: '',
  status: 'ativo',
});

function statusLabel(status: string) {
  if (status === 'em_manejo') return 'em manejo';
  return status;
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const [y, m, d] = value.split('-');
  if (!y || !m || !d) return value;
  return `${d}/${m}/${y}`;
}

export default function LotesPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [busca, setBusca] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState<Lote | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm(user?.propriedade || ''));
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(true);

  // Atualiza o estado inicial do formulário caso o usuário seja carregado assincronamente
  useEffect(() => {
    if (user?.propriedade && !form.propriedade && !editing) {
      setForm((prev) => ({ ...prev, propriedade: user.propriedade }));
    }
  }, [user?.propriedade, form.propriedade, editing]);

  const load = useCallback(async () => {
    setCarregando(true);
    try {
      setLotes(await listLotes());
    } catch (err) {
      setErro(readApiError(err).message || 'Não foi possível carregar os lotes');
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setErro('');
    setForm(emptyForm(user?.propriedade || ''));
    setDrawerOpen(true);
  };

  const openEdit = (lote: Lote) => {
    setEditing(lote);
    setErro('');
    setForm({
      codigo: lote.codigo,
      propriedade: lote.propriedade,
      cultura: lote.cultura,
      variedade: lote.variedade,
      area_ha: String(lote.area_ha ?? ''),
      data_plantio: lote.data_plantio || '',
      sensor_vinculado: lote.sensor_vinculado || '',
      status: lote.status,
    });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditing(null);
  };

  const onField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const salvar = async () => {
    setErro('');
    const parsedArea = Number(String(form.area_ha).replace(',', '.'));
    const payload = {
      codigo: form.codigo,
      propriedade: form.propriedade,
      cultura: form.cultura,
      variedade: form.variedade,
      area_ha: Number.isNaN(parsedArea) ? 0 : parsedArea,
      data_plantio: form.data_plantio || null,
      sensor_vinculado: form.sensor_vinculado || null,
      status: form.status,
    };
    try {
      if (editing) await updateLote(editing.id, payload);
      else await createLote({ ...payload, codigo: form.codigo });
      closeDrawer();
      await load();
    } catch (err) {
      const apiErr = readApiError(err);
      setErro(apiErr.details?.join(' ') || apiErr.message || 'Não foi possível salvar o lote');
    }
  };

  const excluir = async (lote: Lote) => {
    if (!window.confirm(`Excluir ${lote.codigo}?`)) return;
    try {
      await deleteLote(lote.id);
      await load();
    } catch (err) {
      setErro(readApiError(err).message || 'Não foi possível excluir o lote');
    }
  };

  const [filtroPropriedade, setFiltroPropriedade] = useState('TODAS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [compacto, setCompacto] = useState(false);

  const propriedadesDisponiveis = useMemo(() => {
    return Array.from(new Set(lotes.map((l) => l.propriedade).filter(Boolean)));
  }, [lotes]);

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return lotes.filter((l) => {
      const matchBusca =
        !q ||
        [l.codigo, l.cultura, l.variedade, l.propriedade]
          .filter(Boolean)
          .some((v) => v.toLowerCase().includes(q));

      const matchProp =
        filtroPropriedade === 'TODAS' ||
        l.propriedade === filtroPropriedade;

      const matchStatus =
        filtroStatus === 'TODOS' ||
        (l.status || '').toLowerCase() === filtroStatus.toLowerCase();

      return matchBusca && matchProp && matchStatus;
    });
  }, [lotes, busca, filtroPropriedade, filtroStatus]);

  const exportarLotes = () => {
    const headers = ['Código', 'Propriedade', 'Cultura', 'Variedade', 'Área (ha)', 'Plantio', 'Status'];
    const rows = filtrados.map((l) => [
      `"${l.codigo}"`,
      `"${l.propriedade}"`,
      `"${l.cultura}"`,
      `"${l.variedade}"`,
      `"${l.area_ha}"`,
      `"${l.data_plantio || ''}"`,
      `"${l.status}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `lotes_harvestpoint_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const inputBox: React.CSSProperties = {
    height: '44px',
    border: '1px solid var(--hp-input-border)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    padding: '0 12px',
    fontSize: '14px',
    width: '100%',
    background: 'transparent',
    color: 'var(--hp-text)',
    outline: 'none',
  };

  if (!carregando && lotes.length === 0 && !drawerOpen) {
    return <LotesVazioState onNovoLote={openCreate} />;
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        <div style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
            <div>
              <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
                Lotes / Talhões
              </h1>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
                Divisão produtiva por propriedade · {lotes.length} registro{lotes.length === 1 ? '' : 's'}
              </div>
            </div>
            <div style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onClick={openCreate}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1' }}>
                add
              </span>
              Novo lote
            </div>
          </div>
          {erro && !drawerOpen ? (
            <div style={{ fontSize: '13px', color: 'var(--hp-critico)' }}>{erro}</div>
          ) : null}
          <div style={{ height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
            <div style={{ flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)' }}>
                search
              </span>
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por código, cultura ou variedade"
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: 'var(--hp-text)' }}
              />
            </div>
            <select
              value={filtroPropriedade}
              onChange={(e) => setFiltroPropriedade(e.target.value)}
              style={{
                height: '44px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid var(--hp-input-border)',
                background: 'var(--hp-surface)',
                color: 'var(--hp-text)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="TODAS">Todas as Propriedades</option>
              {propriedadesDisponiveis.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              style={{
                height: '44px',
                padding: '0 12px',
                borderRadius: '12px',
                border: '1px solid var(--hp-input-border)',
                background: 'var(--hp-surface)',
                color: 'var(--hp-text)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <option value="TODOS">Todos os Status</option>
              <option value="ativo">Ativo</option>
              <option value="em_manejo">Em manejo</option>
              <option value="finalizado">Finalizado</option>
            </select>
            <div style={{ width: '1px', height: '28px', background: 'var(--hp-border)' }} />
            <span
              title={compacto ? 'Visualização Normal' : 'Visualização Compacta'}
              style={{
                fontFamily: "'Material Symbols Outlined'",
                fontSize: '20px',
                lineHeight: '1',
                color: compacto ? 'var(--hp-accent)' : 'var(--hp-text-2)',
                background: compacto ? 'var(--hp-accent-soft)' : 'transparent',
                padding: '6px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              onClick={() => setCompacto((c) => !c)}
            >
              density_medium
            </span>
            <span
              title="Exportar Lotes (CSV)"
              style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', padding: '6px' }}
              onClick={exportarLotes}
            >
              download
            </span>
          </div>
          <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '880px', tableLayout: 'fixed' }}>
                <thead>
                  <tr style={{ height: '48px', background: 'var(--hp-surface-2)' }}>
                    <th style={{ width: '100px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      CÓDIGO ↓
                    </th>
                    <th style={{ width: '24%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      PROPRIEDADE
                    </th>
                    <th style={{ width: '13%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      CULTURA
                    </th>
                    <th style={{ width: '18%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      VARIEDADE
                    </th>
                    <th style={{ width: '84px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      ÁREA
                    </th>
                    <th style={{ width: '104px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      PLANTIO
                    </th>
                    <th style={{ width: '116px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      STATUS
                    </th>
                    <th style={{ width: '88px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap' }}>
                      AÇÕES
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: '32px 16px', textAlign: 'center', fontSize: '14px', color: 'var(--hp-text-2)' }}>
                        Nenhum lote encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filtrados.map((lote) => (
                      <tr key={lote.id} style={{ height: compacto ? '40px' : '52px', borderTop: '1px solid var(--hp-border)' }}>
                        <td style={{ padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent)', cursor: 'pointer', whiteSpace: 'nowrap' }} onClick={() => navigate(`/lotes/${lote.id}`)}>
                          {lote.codigo}
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lote.propriedade}
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {lote.cultura}
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {lote.variedade}
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          {lote.area_ha} ha
                        </td>
                        <td style={{ padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap' }}>
                          {formatDate(lote.data_plantio)}
                        </td>
                        <td style={{ padding: '0 16px' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: lote.status === 'em_manejo' ? 'var(--hp-atencao-bg)' : 'var(--hp-accent-soft)', color: lote.status === 'em_manejo' ? 'var(--hp-atencao)' : 'var(--hp-accent)', fontSize: '12px', fontWeight: '600' }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: lote.status === 'em_manejo' ? 'var(--hp-atencao)' : 'var(--hp-accent)' }} />
                            {statusLabel(lote.status)}
                          </span>
                        </td>
                        <td style={{ padding: '0 16px', textAlign: 'right' }}>
                          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', marginRight: '12px' }} onClick={() => openEdit(lote)}>
                            edit
                          </span>
                          <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer' }} onClick={() => void excluir(lote)}>
                            delete
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div style={{ height: '56px', borderTop: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)' }}>
              <span>
                Mostrando {filtrados.length} de {lotes.length}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--hp-input-border)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-text)' }}>
                  10 por página
                  <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: 'var(--hp-text-2)' }}>
                    expand_more
                  </span>
                </div>
                <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-icon-disabled)' }}>
                  chevron_left
                </span>
                <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-icon-disabled)' }}>
                  chevron_right
                </span>
              </div>
            </div>
          </div>
        </div>
        {Boolean(drawerOpen) && (
          <React.Fragment>
            <div style={{ width: '480px', flex: '0 0 480px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', boxShadow: '-12px 0 48px rgba(22,21,15,.14)', display: 'flex', flexDirection: 'column', minHeight: '720px' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700' }}>
                  {editing ? 'Editar lote' : 'Novo lote'}
                </div>
                <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer' }} onClick={closeDrawer}>
                  close
                </span>
              </div>
              <div style={{ flex: '1', padding: '20px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {erro ? <div style={{ fontSize: '13px', color: 'var(--hp-critico)' }}>{erro}</div> : null}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px' }}>
                    IDENTIFICAÇÃO
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Código do lote
                      </div>
                      <input style={inputBox} placeholder="Ex.: Lote D4" value={form.codigo} onChange={onField('codigo')} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Propriedade
                      </div>
                      <input style={inputBox} value={form.propriedade} onChange={onField('propriedade')} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                          Cultura
                        </div>
                        <input style={inputBox} value={form.cultura} onChange={onField('cultura')} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                          Variedade
                        </div>
                        <input style={inputBox} value={form.variedade} onChange={onField('variedade')} />
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ height: '1px', background: 'var(--hp-border)' }} />
                <div>
                  <div style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px' }}>
                    PLANTIO
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                          Área (ha)
                        </div>
                        <input style={inputBox} placeholder="0,0" value={form.area_ha} onChange={onField('area_ha')} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                          Data de plantio
                        </div>
                        <input type="date" style={inputBox} value={form.data_plantio} onChange={onField('data_plantio')} />
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Sensor vinculado
                      </div>
                      <input style={inputBox} placeholder="IOT-001" value={form.sensor_vinculado} onChange={onField('sensor_vinculado')} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>
                        Status
                      </div>
                      <select style={inputBox} value={form.status} onChange={onField('status')}>
                        <option value="ativo">ativo</option>
                        <option value="em_manejo">em manejo</option>
                        <option value="inativo">inativo</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ padding: '16px 20px', borderTop: '1px solid var(--hp-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <div style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onClick={closeDrawer}>
                  Cancelar
                </div>
                <div style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} onClick={() => void salvar()}>
                  Salvar lote
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </div>
    </>
  );
}