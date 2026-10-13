// Gerado a partir do design aprovado no Claude Design (HarvestPoint.dc.html)
// e adaptado para React + TypeScript + Tailwind pelo pipeline de migração.
// Revise os TODOs antes de ligar em dados reais da API.
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { roleCardStyle } from '@/lib/uiHelpers';
import { login as loginRequest, readApiError } from '@/lib/api';
import Logo from '@/components/Logo';

export default function LoginPage() {

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
  const goCadastro = () => navigate('/criar-conta');
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const [senha, setSenha] = useState('');
  const onSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => setSenha(e.target.value);
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showSenha, setShowSenha] = useState(false);
  const toggleShowSenha = () => setShowSenha((v) => !v);
  const passwordFieldType = showSenha ? 'text' : 'password';
  const passwordIcon = showSenha ? 'visibility_off' : 'visibility';
  const handleEntrar = async () => {
    setErro('');
    setEnviando(true);
    try {
      const user = await loginRequest({ email, senha });
      login(user);
      navigate('/dashboard');
    } catch (err) {
      const apiErr = readApiError(err);
      setErro(apiErr.message || 'Não foi possível entrar');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <>
    <div style={{width: '100%', minHeight: '100vh', position: 'relative', overflowX: 'hidden', backgroundImage: "url('/images/auth-bg.jpg')", backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 20px 48px rgba(22,21,15,.18)'}}>
      <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(100deg, rgba(31,33,29,.82), rgba(31,33,29,.55) 40%, rgba(31,33,29,.08) 70%)'}} />
      <div style={{position: 'absolute', inset: '0', background: 'linear-gradient(180deg, rgba(31,33,29,.40), transparent 30%, rgba(31,33,29,.48))'}} />
      <div style={{position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '0 56px'}}>
        <div style={{height: '72px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <Logo size={36} textColor="#FFFFFF" />
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
            <div style={{height: '40px', padding: '0 18px', display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,.35)', borderRadius: '12px', color: '#FFFFFF', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap'}} onClick={goCadastro}>
              Criar conta
            </div>
          </div>
        </div>
        <div style={{flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '56px', paddingBottom: '24px'}}>
          <div style={{maxWidth: '520px', alignSelf: 'flex-end', paddingBottom: '56px', width: '556px', height: '451px'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '40ms'}}>
              <div style={{width: '3px', height: '16px', borderRadius: '2px', background: '#B9D0BC'}} />
              <div style={{fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: 'rgba(255,255,255,.7)'}}>
                HARVESTPOINT
              </div>
            </div>
            <h1 style={{margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '44px', lineHeight: '48px', fontWeight: '800', letterSpacing: '-.02em', color: '#FFFFFF', textWrap: 'pretty', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '90ms'}}>
              Tecnologia e inteligência para uma colheita no{' '}
              <span style={{color: '#B9D0BC', borderBottom: '3px solid #B9D0BC', borderRadius: '3px', paddingBottom: '3px'}}>
                ponto certo
              </span>
              .
            </h1>
            <p style={{margin: '22px 0 0', fontSize: '16px', lineHeight: '24px', color: 'rgba(255,255,255,.85)', maxWidth: '440px', width: '443px', height: '25px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '140ms'}}>
              Mais produtividade, menos desperdício e frutas de qualidade para o mundo.
            </p>
            <div style={{height: '1px', background: 'rgba(255,255,255,.2)', margin: '28px 0 20px', maxWidth: '440px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '170ms'}} />
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '200ms'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)'}}>
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
                12 leituras IoT nas últimas 24 h
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,.75)', width: '521px', height: '12px'}}>
                <span style={{width: '6px', height: '6px', background: '#B9D0BC', display: 'block'}} />
                3 lotes monitorados · Fazenda Boa Vista
              </div>
            </div>
          </div>
          <div style={{width: '440px', padding: '32px', borderRadius: '22px', background: 'rgba(255,255,255,.96)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,.5)', boxShadow: '0 20px 48px rgba(22,21,15,.18)'}}>
            <div style={{width: '48px', height: '48px', borderRadius: '16px', background: '#E7EFE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '40ms'}}>
              <Logo size={32} showText={false} />
            </div>
            <div style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '20px', lineHeight: '28px', fontWeight: '700', color: '#1F211D', textAlign: 'center', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '80ms'}}>
              Bem-vindo de volta
            </div>
            <div style={{fontSize: '12px', lineHeight: '16px', color: '#6B6D63', textAlign: 'center', marginTop: '4px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '110ms'}}>
              Acompanhe clima, lotes e operações do Vale.
            </div>
            <div style={{fontSize: '11px', lineHeight: '14px', fontWeight: '700', letterSpacing: '.08em', color: '#8B8D82', margin: '24px 0 10px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '150ms'}}>
              COMO VOCÊ VAI ENTRAR
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '150ms'}}>
              <div style={roleCardProprietario} onClick={selectRoleProprietario}>
                <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '20px', lineHeight: '1', color: roleIconColorProprietario}}>
                  potted_plant
                </span>
                <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginTop: '6px'}}>
                  Proprietário
                </div>
                <div style={{fontSize: '12px', lineHeight: '14px', color: '#6B6D63', marginTop: '2px', paddingRight: '18px'}}>
                  Visão geral da fazenda, resultados e gestão
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
                  Coleta de dados, operações e acompanhamento
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
            <div style={{height: '48px', marginTop: '16px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #D6D4CB', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '14px', fontWeight: '600', color: '#1F211D', cursor: 'pointer', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '190ms'}}>
              <span style={{fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '18px', fontWeight: '700', color: '#4285F4'}}>
                G
              </span>
              Continuar com Google
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 0', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '220ms'}}>
              <div style={{flex: '1', height: '1px', background: '#E7E5DE'}} />
              <div style={{fontSize: '12px', color: '#8B8D82'}}>
                ou
              </div>
              <div style={{flex: '1', height: '1px', background: '#E7E5DE'}} />
            </div>
            <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', marginBottom: '6px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '250ms'}}>
              E-mail profissional
            </div>
            <div style={{height: '48px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #D6D4CB', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '250ms'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: '#8B8D82'}}>
                mail
              </span>
              <input type="email" placeholder="seu@email.com" value={email} onChange={onEmailChange} style={{flex: '1', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', color: '#1F211D'}} />
            </div>
            <div style={{fontSize: '13px', lineHeight: '16px', fontWeight: '600', color: '#1F211D', margin: '14px 0 6px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '290ms'}}>
              Senha
            </div>
            <div style={{height: '48px', borderRadius: '12px', background: '#FFFFFF', border: '1px solid #D6D4CB', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '290ms'}}>
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: '#8B8D82'}}>
                lock
              </span>
              <input type={passwordFieldType} placeholder="••••••••" value={senha} onChange={onSenhaChange} style={{flex: '1', border: 'none', outline: 'none', background: 'transparent', fontSize: '14px', letterSpacing: '.04em', color: '#1F211D'}} />
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', color: '#8B8D82', cursor: 'pointer'}} onClick={toggleShowSenha}>
                {passwordIcon}
              </span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '14px 0 18px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '320ms'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#33352E'}}>
                <span style={{width: '18px', height: '18px', borderRadius: '8px', border: '1px solid #D6D4CB', background: '#FFFFFF', display: 'block'}} />
                Lembrar por 30 dias
              </div>
              <div style={{fontSize: '12px', fontWeight: '600', color: '#6B8F71', cursor: 'pointer'}}>
                Esqueci a senha
              </div>
            </div>
            {erro ? (
              <div style={{fontSize: '12px', color: '#B42318', marginBottom: '10px'}}>
                {erro}
              </div>
            ) : null}
            <div style={{height: '52px', borderRadius: '12px', background: '#6B8F71', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#FFFFFF', fontSize: '15px', fontWeight: '600', cursor: enviando ? 'default' : 'pointer', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '350ms'}} onClick={enviando ? undefined : handleEntrar}>
              {enviando ? 'Entrando...' : 'Entrar na plataforma'}
              <span style={{fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1'}}>
                arrow_forward
              </span>
            </div>
            <div style={{textAlign: 'center', fontSize: '12px', color: '#6B6D63', marginTop: '14px', opacity: '0', animation: 'hpFieldIn 400ms ease-out forwards', animationDelay: '380ms'}}>
              Não tem uma conta?{' '}
              <span style={{color: '#6B8F71', fontWeight: '600', cursor: 'pointer'}} onClick={goCadastro}>
                Criar conta gratuitamente
              </span>
            </div>
          </div>
        </div>
        <div style={{height: '64px', borderTop: '1px solid rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: 'rgba(255,255,255,.65)'}}>
          <div>
            © 2026 HarvestPoint · Vale do São Francisco
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
            Termos de uso · Política de privacidade · 
            <span style={{width: '6px', height: '6px', borderRadius: '50%', background: '#B9D0BC', display: 'inline-block'}} />
            Sistema operando
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
