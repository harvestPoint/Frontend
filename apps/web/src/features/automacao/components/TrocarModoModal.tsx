// apps/web/src/features/automacao/components/TrocarModoModal.tsx
import Modal from '@/components/overlay/Modal';
import { rotuloModo } from '../store';
import type { Atuador, ModoAtuador } from '../types';
import { Botao, FONTE_TITULO, Icone } from './ui';

const TEXTO: Record<ModoAtuador, string> = {
  automatico: 'Automático liga e desliga os aspersores sozinho, sem perguntar, sempre que a regra for atendida. Confirmar?',
  aprovacao: 'Em Aprovação a regra só avisa. O proprietário recebe o motivo e decide se liga. Confirmar?',
  manual: 'Em Manual a regra fica quieta. Os aspersores só ligam quando alguém aciona. Confirmar?',
};

interface Props {
  pedido: { atuador: Atuador; modo: ModoAtuador } | null;
  aoFechar: () => void;
  aoConfirmar: () => void;
}

export default function TrocarModoModal({ pedido, aoFechar, aoConfirmar }: Props) {
  return (
    <Modal aberto={!!pedido} aoFechar={aoFechar} largura={460} rotuloId="au-modo-titulo">
      {pedido && (
        <>
          <div id="au-modo-titulo" style={{ fontFamily: FONTE_TITULO, fontSize: '20px', fontWeight: 700 }}>Trocar para {rotuloModo(pedido.modo)}?</div>
          <div style={{ fontSize: '14px', color: 'var(--hp-text-2)', marginTop: '4px' }}>{pedido.atuador.nome}</div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '16px', padding: '14px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-atencao-bg)', color: 'var(--hp-text)', fontSize: '14px', lineHeight: '21px' }}>
            <Icone nome="info" tamanho={20} cor="var(--hp-atencao)" />
            <span>{TEXTO[pedido.modo]}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '22px' }}>
            <Botao onClick={aoFechar}>Cancelar</Botao>
            <Botao variante="primario" autoFoco onClick={aoConfirmar}>Confirmar</Botao>
          </div>
        </>
      )}
    </Modal>
  );
}
