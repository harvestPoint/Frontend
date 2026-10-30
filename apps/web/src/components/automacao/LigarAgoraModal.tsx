// apps/web/src/components/automacao/LigarAgoraModal.tsx
import { useState } from 'react';
import Modal from '@/components/overlay/Modal';
import { fmtNum } from '@/lib/uiHelpers';
import type { Atuador } from './types';
import { Botao, FONTE_TITULO, FecharX } from './ui';

const DURACOES = [5, 10, 15, 20, 25, 30];

interface Props {
  atuador: Atuador | null;
  aoFechar: () => void;
  aoConfirmar: (minutos: number) => void;
}

export default function LigarAgoraModal({ atuador, aoFechar, aoConfirmar }: Props) {
  const [dur, setDur] = useState(15);
  return (
    <Modal aberto={!!atuador} aoFechar={aoFechar} largura={460} rotuloId="au-ligar-titulo">
      {atuador && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div id="au-ligar-titulo" style={{ fontFamily: FONTE_TITULO, fontSize: '20px', fontWeight: 700 }}>Ligar agora</div>
            <FecharX onClick={aoFechar} />
          </div>
          <div style={{ fontSize: '14px', color: 'var(--hp-text-2)', marginTop: '4px' }}>{atuador.nome} · {atuador.lote}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '18px', padding: '14px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-surface-2)' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Leitura atual</div>
              <div style={{ fontSize: '22px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtNum(atuador.temp)} °C</div>
            </div>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Limite da cultura</div>
              <div style={{ fontSize: '22px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{atuador.limite} °C</div>
            </div>
          </div>
          <div id="au-dur" style={{ fontSize: '13px', fontWeight: 600, marginTop: '18px' }}>Duração</div>
          <div role="radiogroup" aria-labelledby="au-dur" style={{ display: 'flex', padding: '3px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-surface-2)', gap: '2px', marginTop: '8px' }}>
            {DURACOES.map((v) => (
              <button key={v} type="button" role="radio" aria-checked={dur === v} onClick={() => setDur(v)} className="au-btn"
                style={{ flex: 1, height: '32px', padding: '0 4px', borderRadius: '10px', border: 0, fontSize: '13px', fontWeight: 600, whiteSpace: 'nowrap', background: dur === v ? 'var(--hp-surface)' : 'transparent', color: dur === v ? 'var(--hp-text)' : 'var(--hp-text-2)', boxShadow: dur === v ? '0 1px 2px rgba(34,31,24,.08)' : 'none' }}>
                {v} min
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '22px' }}>
            <Botao onClick={aoFechar}>Cancelar</Botao>
            <Botao variante="primario" autoFoco onClick={() => aoConfirmar(dur)}>Ligar por {dur} min</Botao>
          </div>
        </>
      )}
    </Modal>
  );
}
