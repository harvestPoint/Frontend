// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LotesPage() {

  const navigate = useNavigate();
  const goLote = () => navigate('/lotes/A1');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
    <div style={{display: 'flex', gap: '24px', alignItems: 'flex-start'}}>
      <div style={{flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: 'var(--hp-gap)'}}>
        <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px'}}>
          <div>
            <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
              Lotes / Talhões
            </h1>
            <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
              Divisão produtiva por propriedade · 3 registros
            </div>
          </div>
          <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={openDrawer}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
              add
            </span>
            Novo lote
          </div>
        </div>
        <div style={{height: '64px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px'}}>
          <div style={{flex: '1', minWidth: '0', height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 12px'}}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-3)'}}>
              search
            </span>
            <span style={{fontSize: '14px', color: 'var(--hp-text-3)'}}>
              Buscar por código, cultura ou variedade
            </span>
          </div>
          <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
            Propriedade
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
              expand_more
            </span>
          </div>
          <div style={{height: '44px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600'}}>
            Status
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
              expand_more
            </span>
          </div>
          <div style={{width: '1px', height: '28px', background: 'var(--hp-border)'}} />
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
            density_medium
          </span>
          <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
            download
          </span>
        </div>
        <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden'}}>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', minWidth: '880px', tableLayout: 'fixed'}}>
              <thead>
                <tr style={{height: '48px', background: 'var(--hp-surface-2)'}}>
                  <th style={{width: '100px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    CÓDIGO ↓
                  </th>
                  <th style={{width: '24%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    PROPRIEDADE
                  </th>
                  <th style={{width: '13%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    CULTURA
                  </th>
                  <th style={{width: '18%', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    VARIEDADE
                  </th>
                  <th style={{width: '84px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    ÁREA
                  </th>
                  <th style={{width: '104px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    PLANTIO
                  </th>
                  <th style={{width: '116px', textAlign: 'left', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    STATUS
                  </th>
                  <th style={{width: '88px', textAlign: 'right', padding: '0 16px', fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-2)', whiteSpace: 'nowrap'}}>
                    AÇÕES
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
                  <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer', whiteSpace: 'nowrap'}} onClick={goLote}>
                    Lote A1
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    Fazenda Boa Vista
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                    Manga
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    Tommy Atkins
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right', whiteSpace: 'nowrap'}}>
                    120 ha
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                    15/03/2024
                  </td>
                  <td style={{padding: '0 16px'}}>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent-hover)', fontSize: '12px', fontWeight: '600'}}>
                      <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
                      ativo
                    </span>
                  </td>
                  <td style={{padding: '0 16px', textAlign: 'right'}}>
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', marginRight: '12px'}}>
                      edit
                    </span>
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                      more_vert
                    </span>
                  </td>
                </tr>
                <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
                  <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer', whiteSpace: 'nowrap'}}>
                    Lote B2
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    Fazenda Boa Vista
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                    Uva
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    Itália
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right', whiteSpace: 'nowrap'}}>
                    85 ha
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                    10/06/2024
                  </td>
                  <td style={{padding: '0 16px'}}>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent-hover)', fontSize: '12px', fontWeight: '600'}}>
                      <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)'}} />
                      ativo
                    </span>
                  </td>
                  <td style={{padding: '0 16px', textAlign: 'right'}}>
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', marginRight: '12px'}}>
                      edit
                    </span>
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                      more_vert
                    </span>
                  </td>
                </tr>
                <tr style={{height: '52px', borderTop: '1px solid var(--hp-border)'}}>
                  <td style={{padding: '0 16px', fontSize: '14px', fontWeight: '600', color: 'var(--hp-accent-hover)', cursor: 'pointer', whiteSpace: 'nowrap'}}>
                    Lote C3
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    Fazenda Boa Vista
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                    Uva
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    Crimson Seedless
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', textAlign: 'right', whiteSpace: 'nowrap'}}>
                    45 ha
                  </td>
                  <td style={{padding: '0 16px', fontSize: '14px', whiteSpace: 'nowrap'}}>
                    22/08/2024
                  </td>
                  <td style={{padding: '0 16px'}}>
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-atencao-bg)', color: 'var(--hp-atencao)', fontSize: '12px', fontWeight: '600'}}>
                      <span style={{width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-atencao)'}} />
                      em manejo
                    </span>
                  </td>
                  <td style={{padding: '0 16px', textAlign: 'right'}}>
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer', marginRight: '12px'}}>
                      edit
                    </span>
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}}>
                      more_vert
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div style={{height: '56px', borderTop: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px', fontSize: '12px', color: 'var(--hp-text-2)'}}>
            <span>
              Mostrando 1–3 de 3
            </span>
            <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <div style={{height: '32px', padding: '0 10px', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid var(--hp-input-border)', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: 'var(--hp-text)'}}>
                10 por página
                <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                  expand_more
                </span>
              </div>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-icon-disabled)'}}>
                chevron_left
              </span>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-icon-disabled)'}}>
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </div>
      {Boolean(drawerOpen) && (
        <React.Fragment>
        <div style={{width: '480px', flex: '0 0 480px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', boxShadow: '-12px 0 48px rgba(22,21,15,.14)', display: 'flex', flexDirection: 'column', minHeight: '720px'}}>
          <div style={{padding: 'var(--hp-pad)', borderBottom: '1px solid var(--hp-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700'}}>
              Novo lote
            </div>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: 'var(--hp-text-2)', cursor: 'pointer'}} onClick={closeDrawer}>
              close
            </span>
          </div>
          <div style={{flex: '1', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '18px'}}>
            <div>
              <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px'}}>
                IDENTIFICAÇÃO
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div>
                  <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                    Código do lote
                  </div>
                  <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', color: 'var(--hp-text-3)'}}>
                    Ex.: Lote D4
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                    Propriedade
                  </div>
                  <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '14px'}}>
                    Fazenda Boa Vista
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                      expand_more
                    </span>
                  </div>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <div>
                    <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                      Cultura
                    </div>
                    <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '14px'}}>
                      Manga
                      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                        expand_more
                      </span>
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                      Variedade
                    </div>
                    <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '14px'}}>
                      Tommy Atkins
                      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                        expand_more
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{height: '1px', background: 'var(--hp-border)'}} />
            <div>
              <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px'}}>
                PLANTIO
              </div>
              <div style={{display: 'flex', flexDirection: 'column', gap: '14px'}}>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
                  <div>
                    <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                      Área (ha)
                    </div>
                    <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', color: 'var(--hp-text-3)'}}>
                      0,0
                    </div>
                  </div>
                  <div>
                    <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                      Data de plantio
                    </div>
                    <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '14px', color: 'var(--hp-text-3)'}}>
                      dd/mm/aaaa
                      <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                        calendar_today
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                    Sensor vinculado
                  </div>
                  <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '14px'}}>
                    IOT-001
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                      expand_more
                    </span>
                  </div>
                </div>
                <div>
                  <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                    Status
                  </div>
                  <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '14px'}}>
                    ativo
                    <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{padding: '16px 20px', borderTop: '1px solid var(--hp-border)', display: 'flex', justifyContent: 'flex-end', gap: '10px'}}>
            <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={closeDrawer}>
              Cancelar
            </div>
            <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={closeDrawer}>
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
