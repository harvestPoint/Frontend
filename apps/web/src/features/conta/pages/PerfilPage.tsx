// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import { useNavigate } from 'react-router-dom';

export default function PerfilPage() {

  const navigate = useNavigate();
  const goLogin = () => navigate('/login');

  return (
    <>
    <div>
      <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: '700', letterSpacing: '-.01em'}}>
        Perfil
      </h1>
      <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px'}}>
        Suas informações e preferências de acesso
      </div>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: '280px 1fr', gap: 'var(--hp-gap)', alignItems: 'start'}}>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <div style={{width: '72px', height: '72px', borderRadius: '50%', background: 'var(--hp-accent)', color: '#FFFFFF', fontSize: '22px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          AF
        </div>
        <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: '700', marginTop: '14px'}}>
          Abraão Freitas
        </div>
        <div style={{fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '2px'}}>
          Proprietário
        </div>
        <div style={{fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--hp-border)', width: '100%'}}>
          Fazenda Boa Vista · Petrolina/PE
        </div>
      </div>
      <div style={{background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: 'var(--hp-gap)'}}>
        <div>
          <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px'}}>
            DADOS PESSOAIS
          </div>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px'}}>
            <div>
              <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                Nome completo
              </div>
              <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px'}}>
                Abraão Freitas
              </div>
            </div>
            <div>
              <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                Telefone
              </div>
              <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px', fontVariantNumeric: 'tabular-nums'}}>
                (87) 99123-4567
              </div>
            </div>
            <div style={{gridColumn: '1 / -1'}}>
              <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
                E-mail profissional
              </div>
              <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '0 12px', fontSize: '14px'}}>
                abraao@boavista.agro.br
              </div>
            </div>
          </div>
        </div>
        <div style={{height: '1px', background: 'var(--hp-border)'}} />
        <div>
          <div style={{fontSize: '11px', fontWeight: '700', letterSpacing: '.08em', color: 'var(--hp-text-3)', marginBottom: '12px'}}>
            PREFERÊNCIAS
          </div>
          <div>
            <div style={{fontSize: '13px', fontWeight: '600', marginBottom: '6px'}}>
              Perfil de acesso
            </div>
            <div style={{height: '44px', border: '1px solid var(--hp-input-border)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 12px', fontSize: '14px', maxWidth: '320px'}}>
              Proprietário
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: 'var(--hp-text-2)'}}>
                expand_more
              </span>
            </div>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--hp-text-4)'}}>
              <span style={{width: '18px', height: '18px', borderRadius: '8px', border: '1px solid var(--hp-accent)', background: 'var(--hp-accent)', display: 'block'}} />
              Receber alertas críticos por e-mail
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--hp-text-4)'}}>
              <span style={{width: '18px', height: '18px', borderRadius: '8px', border: '1px solid var(--hp-accent)', background: 'var(--hp-accent)', display: 'block'}} />
              Receber alertas críticos por SMS
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--hp-text-4)'}}>
              <span style={{width: '18px', height: '18px', borderRadius: '8px', border: '1px solid var(--hp-input-border)', background: 'var(--hp-surface)', display: 'block'}} />
              Resumo semanal por e-mail
            </div>
          </div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', gap: '10px', paddingTop: '4px'}}>
          <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-critico-bg)', color: 'var(--hp-critico)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}} onClick={goLogin}>
            <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
              logout
            </span>
            Sair
          </div>
          <div style={{display: 'flex', gap: '10px'}}>
            <div style={{height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
              Cancelar
            </div>
            <div style={{height: '40px', padding: '0 18px', display: 'flex', alignItems: 'center', background: 'var(--hp-accent)', color: '#FFFFFF', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer'}}>
              Salvar alterações
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
