// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleCardStyle } from '@/lib/uiHelpers';

export default function SignupPage() {

  const navigate = useNavigate();
  const [role, setRole] = useState<'proprietario' | 'tecnico'>('proprietario');
  const selectRoleProprietario = () => setRole('proprietario');
  const selectRoleTecnico = () => setRole('tecnico');
  const roleCardProprietario = roleCardStyle(role === 'proprietario');
  const roleCardTecnico = roleCardStyle(role === 'tecnico');
  const roleCheckProprietario = role === 'proprietario' ? 1 : 0;
  const roleCheckTecnico = role === 'tecnico' ? 1 : 0;
  const roleIconColorProprietario = role === 'proprietario' ? '#6B8F71' : '#8B8D82';
  const roleIconColorTecnico = role === 'tecnico' ? '#6B8F71' : '#8B8D82';
  const [cad, setCad] = useState({ nome: '', email: '', senha: '', propriedade: '' });
  const onNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => setCad((c) => ({ ...c, nome: e.target.value }));
  const onCadEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setCad((c) => ({ ...c, email: e.target.value }));
  const onCadSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => setCad((c) => ({ ...c, senha: e.target.value }));
  const onCadPropriedadeChange = (e: React.ChangeEvent<HTMLInputElement>) => setCad((c) => ({ ...c, propriedade: e.target.value }));
  const goLogin = () => navigate('/login');
  const { login } = useAuth();
  const goDashboard = () => {
    // TODO: substituir por chamada real de cadastro (POST /auth/signup) enviando `cad` e `role`
    login({ nome: cad.nome || 'Novo usuário', role });
    navigate('/dashboard');
  };

  return (
    <>
    <div style={{width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden', backgroundImage: "url('/images/signup-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 48px rgba(22,21,15,.18)'}}>
      <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(280deg, rgba(31,33,29,.82), rgba(31,33,29,.55) 40%, rgba(31,33,29,.08) 70%)'}} />
      <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(31,33,29,.40), transparent 30%, rgba(31,33,29,.48))'}} />
      <div style={{position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 56px'}}>
        <div style={{height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <div style={{width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: '#FFFFFF'}}>
                eco
              </span>
            </div>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '19px', fontWeight: '800', letterSpacing: '-.01em'}}>
              <span style={{color: '#FFFFFF'}}>
                Harvest
              </span>
              <span style={{color: '#B9D0BC'}}>
                Point
              </span>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <span style={{fontSize: '13px', color: 'rgba(255,255,255,.75)', cursor: 'pointer'}}>
                Documentação
              </span>
              <span style={{fontSize: '13px', color: 'rgba(255,255,255,.75)', cursor: 'pointer'}}>
                Suporte
              </span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'rgba(255,255,255,.7)', whiteSpace: 'nowrap'}}>
              <span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#8FB596', display: 'inline-block', animation: 'hpPulse 2s ease-in-out infinite'}} />
              3 fazendas ativas no Vale agora
            </div>
            <div style={{fontSize: '13px', fontWeight: '600', color: '#FFFFFF', cursor: 'pointer'}} onClick={goLogin}>
              Entrar
            </div>
          </div>
        </div>
        <div style={{flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '56px', paddingBottom: '24px'}}>
          <div style={{width: '440px', padding: '32px', borderRadius: '22px', background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 20px 48px rgba(22,21,15,.18)', maxHeight: '780px', overflowY: 'auto'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '16px', background: '#E7EFE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '40ms'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '24px', lineHeight: '1', color: '#6B8F71'}}>
                eco
              </span>
            </div>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700', color: '#1F211D', textAlign: 'center', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '80ms'}}>
              Criar sua conta
            </div>
            <div style={{fontSize: '12px', lineHeight: '16px', color: '#6B6D63', textAlign: 'center', marginTop: '4px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '110ms'}}>
              Acompanhe clima, lotes e operações do Vale.
            </div>
            <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', margin: '22px 0 6px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '150ms'}}>
              Nome completo
            </div>
            <div style={{height: '48px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #D6D4CB', display: 'flex', alignItems: 'center', padding: '0 14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '150ms'}}>
              <input type="text" placeholder="Seu nome" value={cad.nome} onChange={onNomeChange} style={{width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#1F211D'}} />
            </div>
            <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', margin: '14px 0 6px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '190ms'}}>
              E-mail profissional
            </div>
            <div style={{height: '48px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #D6D4CB', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '190ms'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: '#8B8D82'}}>
                mail
              </span>
              <input type="email" placeholder="seu@email.com" value={cad.email} onChange={onCadEmailChange} style={{flex: '1', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#1F211D'}} />
            </div>
            <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', margin: '14px 0 6px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '230ms'}}>
              Senha
            </div>
            <div style={{height: '48px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #D6D4CB', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '230ms'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: '#8B8D82'}}>
                lock
              </span>
              <input type="password" placeholder="••••••••" value={cad.senha} onChange={onCadSenhaChange} style={{flex: '1', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', letterSpacing: '.04em', color: '#1F211D'}} />
            </div>
            <div style={{fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: '#8B8D82', margin: '22px 0 10px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '270ms'}}>
              QUAL SUA FUNÇÃO NA FAZENDA
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '270ms'}}>
              <div style={roleCardProprietario} onClick={selectRoleProprietario}>
                <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: roleIconColorProprietario}}>
                  potted_plant
                </span>
                <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginTop: '6px'}}>
                  Proprietário
                </div>
                <div style={{fontSize: '12px', lineHeight: '14px', color: '#6B6D63', marginTop: '2px'}}>
                  Visão geral da fazenda
                </div>
                {Boolean(role) && (
                  <React.Fragment>
                  <span style={{position: 'absolute', top: '10px', right: '10px', fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: '#6B8F71', opacity: roleCheckProprietario}}>
                    check_circle
                  </span>
                  </React.Fragment>
                )}
              </div>
              <div style={roleCardTecnico} onClick={selectRoleTecnico}>
                <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: roleIconColorTecnico}}>
                  engineering
                </span>
                <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginTop: '6px'}}>
                  Técnico de campo
                </div>
                <div style={{fontSize: '12px', lineHeight: '14px', color: '#6B6D63', marginTop: '2px'}}>
                  Coleta e operações
                </div>
                {Boolean(role) && (
                  <React.Fragment>
                  <span style={{position: 'absolute', top: '10px', right: '10px', fontFamily: "'Material Symbols Outlined'", fontSize: '16px', lineHeight: '1', color: '#6B8F71', opacity: roleCheckTecnico}}>
                    check_circle
                  </span>
                  </React.Fragment>
                )}
              </div>
            </div>
            <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', margin: '16px 0 6px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '310ms'}}>
              Nome da propriedade
            </div>
            <div style={{height: '48px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #D6D4CB', display: 'flex', alignItems: 'center', padding: '0 14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '310ms'}}>
              <input type="text" placeholder="Ex.: Fazenda Boa Vista" value={cad.propriedade} onChange={onCadPropriedadeChange} style={{width: '100%', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#1F211D'}} />
            </div>
            <div style={{height: '52px', marginTop: '20px', borderRadius: '12px', background: '#6B8F71', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: 'pointer', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '350ms'}} onClick={goDashboard}>
              Criar conta
            </div>
            <div style={{textAlign: 'center', fontSize: '12px', color: '#6B6D63', marginTop: '14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '380ms'}}>
              Já tem uma conta? 
              <span style={{color: '#6B8F71', fontWeight: '600', cursor: 'pointer'}} onClick={goLogin}>
                Entrar
              </span>
            </div>
          </div>
          <div style={{maxWidth: '480px', alignSelf: 'center', textAlign: 'right', width: '485px', height: '146px'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginBottom: '20px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '40ms'}}>
              <div style={{fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: 'rgba(255,255,255,.7)'}}>
                HARVESTPOINT
              </div>
              <div style={{width: '3px', height: '16px', borderRadius: '2px', background: '#B9D0BC'}} />
            </div>
            <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '36px', lineHeight: '42px', fontWeight: '800', letterSpacing: '-.02em', color: '#FFFFFF', textWrap: 'pretty', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '90ms'}}>
              Bem-vindo ao Vale — leva menos de 
              <span style={{color: '#B9D0BC', borderBottom: '3px solid #B9D0BC', borderRadius: '3px', paddingBottom: '3px'}}>
                dois minutos
              </span>
              .
            </h1>
            <p style={{margin: '18px 0 0', fontSize: '15px', lineHeight: '23px', color: 'rgba(255,255,255,.85)', maxWidth: '420px', marginLeft: 'auto', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '140ms'}}>
              Cadastre sua fazenda e comece a acompanhar clima, lotes e operações em tempo real.
            </p>
            <div style={{height: '1px', background: 'rgba(255,255,255,.2)', margin: '24px 0 18px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '170ms'}} />
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '200ms'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)'}}>
                Sem cartão de crédito, sem compromisso
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)'}}>
                Painel de clima e alertas já no primeiro acesso
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)'}}>
                Simulador de telemetria pronto para testar
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
