// apps/web/src/features/automacao/pages/AutomacaoPage.tsx
// Automação: o que o sistema fez com os aspersores, e por quê.
// Estados reais: carregando (esqueleto), erro, vazio e normal. Para revisar
// os três primeiros sem mexer no código: /automacao?estado=carregando|erro|vazio.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { acoes, kitsOnline, useAutomacao } from '../store';
import type { Evento, ModoAtuador, SetorId } from '../types';
import AcaoNecessariaBanner from '../components/AcaoNecessariaBanner';
import AtuadorCard from '../components/AtuadorCard';
import AtuadorDrawer from '../components/AtuadorDrawer';
import AutomacaoChart from '../components/AutomacaoChart';
import DispositivoDrawer from '../components/DispositivoDrawer';
import KitSaudeTable from '../components/KitSaudeTable';
import LigarAgoraModal from '../components/LigarAgoraModal';
import LinhaDoTempo from '../components/LinhaDoTempo';
import NotificacaoCard from '../components/NotificacaoCard';
import PorQueModal from '../components/PorQueModal';
import RegraEditorModal from '../components/RegraEditorModal';
import RegraItem from '../components/RegraItem';
import SimuladorPanel from '../components/SimuladorPanel';
import TrocarModoModal from '../components/TrocarModoModal';
import Modal from '@/components/overlay/Modal';
import { Botao, FONTE_TITULO, FecharX, Icone, Pilula, Ponto, cartao, tituloCartao } from '../components/ui';

const skeleton = (h: number): React.CSSProperties => ({ height: h + 'px', borderRadius: 'var(--hp-radius)', background: 'var(--hp-surface-2)' });

export default function AutomacaoPage() {
  const { isTecnico } = useAuth();
  const origem = isTecnico ? 'técnico' : 'proprietário';
  const s = useAutomacao();
  const [params] = useSearchParams();
  const forcado = params.get('estado');

  const [ligarId, setLigarId] = useState<SetorId | null>(null);
  const [modoPedido, setModoPedido] = useState<{ id: SetorId; modo: ModoAtuador } | null>(null);
  const [porque, setPorque] = useState<Evento | null>(null);
  const [regraAberta, setRegraAberta] = useState<{ id: string | null } | null>(null);
  const [drawerAtuador, setDrawerAtuador] = useState<SetorId | null>(null);
  const [drawerKit, setDrawerKit] = useState<string | null>(null);
  const [avisoCelular, setAvisoCelular] = useState(false);

  useEffect(() => {
    if (forcado === 'vazio' || forcado === 'erro' || forcado === 'carregando') acoes.forcarEstado(forcado);
  }, [forcado]);

  const abrirEvento = (id: string) => setPorque(s.eventos.find((e) => e.id === id) ?? s.eventos[0] ?? null);
  const atuador = (id: SetorId | null) => (id ? s.atuadores.find((a) => a.id === id) ?? null : null);
  const regraEditando = regraAberta?.id ? s.regras.find((r) => r.id === regraAberta.id) : undefined;
  const online = kitsOnline(s);
  const vazio = s.status === 'pronto' && s.atuadores.length === 0;
  const normal = s.status === 'pronto' && !vazio;

  const detalhesAviso = () => {
    if (!s.aviso) return;
    const setor = s.aviso.atuadorId.toUpperCase();
    setPorque(s.eventos.find((e) => e.tipo === 'aviso' && e.setor === setor) ?? s.eventos[0] ?? null);
  };

  return (
    <>
      <div className="au-head">
        <div>
          <h1 style={{ margin: 0, fontFamily: FONTE_TITULO, fontSize: '26px', lineHeight: '32px', fontWeight: 700, letterSpacing: '-.01em' }}>Automação</h1>
          <div style={{ fontSize: '14px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
            Aspersores e válvulas · {s.atuadores.length} {s.atuadores.length === 1 ? 'atuador' : 'atuadores'}
          </div>
        </div>
        {normal && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Pilula fg={online === s.kits.length ? 'var(--hp-accent-hover)' : 'var(--hp-atencao)'} bg={online === s.kits.length ? 'var(--hp-accent-soft)' : 'var(--hp-atencao-bg)'}>
              <Ponto cor={online === s.kits.length ? 'var(--hp-accent-hover)' : 'var(--hp-atencao)'} />
              {online} de {s.kits.length} kits online
            </Pilula>
            {isTecnico && <Botao variante="primario" icone="add" onClick={() => setRegraAberta({ id: null })}>Nova regra</Botao>}
          </div>
        )}
      </div>

      {isTecnico && s.status !== 'carregando' && (
        <SimuladorPanel
          aoCalor={acoes.simularCalor} aoSemSinal={acoes.simularSemSinal} aoResetar={acoes.resetar}
          aoVerAviso={s.aviso ? () => setAvisoCelular(true) : undefined}
        />
      )}

      {s.status === 'carregando' && (
        <>
          <div className="au-grid-3" role="status" aria-label="Carregando automação">
            {[1, 2, 3].map((i) => <div key={i} className="au-skel" style={skeleton(260)} />)}
          </div>
          <div className="au-skel" style={skeleton(360)} />
          <div className="au-cols-2">
            <div className="au-skel" style={skeleton(300)} />
            <div className="au-skel" style={skeleton(300)} />
          </div>
        </>
      )}

      {s.status === 'erro' && (
        <div role="alert" style={{ border: '1px solid var(--hp-critico)', borderRadius: 'var(--hp-radius)', background: 'var(--hp-critico-bg)', minHeight: '320px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px' }}>
          <Icone nome="cloud_off" tamanho={40} cor="var(--hp-critico)" />
          <div style={{ fontSize: '17px', fontWeight: 700, marginTop: '14px' }}>Não foi possível carregar.</div>
          <div style={{ fontSize: '14px', color: 'var(--hp-text-2)', marginTop: '6px' }}>Os aspersores continuam seguindo as regras gravadas em cada kit.</div>
          <div style={{ marginTop: '20px' }}><Botao icone="refresh" onClick={() => void acoes.carregar()}>Tentar de novo</Botao></div>
        </div>
      )}

      {vazio && (
        <div style={{ ...cartao, minHeight: '420px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '48px' }}>
          <Icone nome="water_drop" tamanho={44} cor="var(--hp-text-3)" />
          <div style={{ fontSize: '17px', fontWeight: 700, marginTop: '16px' }}>Nenhuma regra nem atuador cadastrado</div>
          <div style={{ fontSize: '14px', color: 'var(--hp-text-2)', marginTop: '6px', maxWidth: '460px' }}>
            Vincule um aspersor ou válvula a um kit IoT e crie a primeira regra. Ela diz quando ligar e se precisa da sua aprovação.
          </div>
          {isTecnico && <div style={{ marginTop: '20px' }}><Botao variante="primario" icone="add" onClick={() => setRegraAberta({ id: null })}>Criar a primeira regra</Botao></div>}
        </div>
      )}

      {normal && (
        <>
          {s.aviso && (
            <AcaoNecessariaBanner
              aviso={s.aviso} aoLigar={() => acoes.aprovar(origem)} aoIgnorar={() => acoes.ignorar(origem)} aoDetalhes={detalhesAviso}
            />
          )}

          {s.semSinal && (
            <div role="status" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', borderRadius: 'var(--hp-radius)', background: 'var(--hp-surface-2)', border: '1px dashed var(--hp-input-border)', fontSize: '14px', color: 'var(--hp-text-2)' }}>
              <Icone nome="signal_disconnected" tamanho={22} />
              <span><b style={{ color: 'var(--hp-text)' }}>IOT-001 sem sinal há 18 min.</b> Nenhuma ação automática será tomada no Setor A1 enquanto o sensor não responder.</span>
            </div>
          )}

          <div className="au-grid-3">
            {s.atuadores.map((a) => (
              <AtuadorCard
                key={a.id} atuador={a} tecnico={isTecnico}
                aoAbrir={() => setDrawerAtuador(a.id)} aoLigar={() => setLigarId(a.id)}
                aoDesligar={() => acoes.desligar(a.id, origem)}
                aoEscolherModo={(modo) => setModoPedido({ id: a.id, modo })}
              />
            ))}
          </div>

          <AutomacaoChart semSinal={s.semSinal} aoAbrirEvento={abrirEvento} />

          <div className="au-cols-2">
            <section style={cartao} aria-label="Regras">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={tituloCartao}>Regras</div>
                <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>{s.regras.filter((r) => r.ativa).length} de {s.regras.length} ativas</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
                {s.regras.map((r) => (
                  <RegraItem key={r.id} regra={r} tecnico={isTecnico} aoAlternar={() => acoes.alternarRegra(r.id)} aoEditar={() => setRegraAberta({ id: r.id })} />
                ))}
              </div>
            </section>
            <LinhaDoTempo eventos={s.eventos} aoAbrir={setPorque} />
          </div>

          <KitSaudeTable kits={s.kits} semSinal={s.semSinal} aoAbrir={setDrawerKit} />
        </>
      )}

      <LigarAgoraModal key={ligarId ?? 'nenhum'} atuador={atuador(ligarId)} aoFechar={() => setLigarId(null)}
        aoConfirmar={(min) => { if (ligarId) acoes.ligarAgora(ligarId, min, origem); setLigarId(null); }} />
      <TrocarModoModal
        pedido={modoPedido && atuador(modoPedido.id) ? { atuador: atuador(modoPedido.id)!, modo: modoPedido.modo } : null}
        aoFechar={() => setModoPedido(null)}
        aoConfirmar={() => { if (modoPedido) acoes.trocarModo(modoPedido.id, modoPedido.modo); setModoPedido(null); }}
      />
      <PorQueModal evento={porque} regras={s.regras} aoFechar={() => setPorque(null)} />
      <RegraEditorModal
        aberto={!!regraAberta} regraId={regraAberta?.id ?? null} inicial={regraEditando?.form} aoFechar={() => setRegraAberta(null)}
        aoSalvar={(form) => { acoes.salvarRegra(regraAberta?.id ?? null, form); setRegraAberta(null); }}
      />
      <AtuadorDrawer
        atuador={atuador(drawerAtuador)} regras={s.regras} eventos={s.eventos} aoFechar={() => setDrawerAtuador(null)}
        aoLigar={() => { setLigarId(drawerAtuador); setDrawerAtuador(null); }}
        aoDesligar={() => { if (drawerAtuador) acoes.desligar(drawerAtuador, origem); }}
      />
      <DispositivoDrawer kitId={drawerKit} aoFechar={() => setDrawerKit(null)} />
      <Modal aberto={avisoCelular && !!s.aviso} aoFechar={() => setAvisoCelular(false)} largura={380} rotuloId="au-celular-titulo">
        {s.aviso && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div id="au-celular-titulo" style={{ fontFamily: FONTE_TITULO, fontSize: '17px', fontWeight: 700 }}>Aviso fora do sistema</div>
              <FecharX onClick={() => setAvisoCelular(false)} />
            </div>
            <NotificacaoCard
              aviso={s.aviso}
              aoLigar={() => { acoes.aprovar(origem); setAvisoCelular(false); }}
              aoIgnorar={() => { acoes.ignorar(origem); setAvisoCelular(false); }}
            />
            <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '12px' }}>
              Prévia do cartão que o proprietário recebe fora do sistema (fase 2). Os botões funcionam como na tela.
            </div>
          </>
        )}
      </Modal>
    </>
  );
}
