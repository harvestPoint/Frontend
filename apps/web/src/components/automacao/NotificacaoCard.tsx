// apps/web/src/components/automacao/NotificacaoCard.tsx
// Como o aviso chega fora do sistema (fase 2: bot de mensagens). Cartão
// genérico, sem logo de aplicativo: título, motivo e dois botões.
import type { AvisoPendente } from './types';
import { Botao, Icone } from './ui';

export default function NotificacaoCard({ aviso, aoLigar, aoIgnorar }: { aviso: AvisoPendente; aoLigar: () => void; aoIgnorar: () => void }) {
  return (
    <div style={{ borderRadius: 'var(--hp-radius)', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', padding: '16px', boxShadow: '0 12px 32px rgba(34,31,24,.14)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--hp-text-2)' }}>
        <span style={{ width: '22px', height: '22px', borderRadius: '6px', background: 'var(--hp-accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icone nome="eco" tamanho={14} cor="var(--hp-accent)" />
        </span>
        HarvestPoint · agora
      </div>
      <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '10px' }}>{aviso.lote} passou do limite</div>
      <div style={{ fontSize: '14px', lineHeight: '20px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
        {aviso.temp} °C há 10 min (limite {aviso.limite} °C), solo {aviso.solo} %. Ligar os aspersores por 15 min? Expira em {Math.ceil(aviso.seg / 60)} min.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
        <Botao variante="primario" onClick={aoLigar}>Ligar 15 min</Botao>
        <Botao onClick={aoIgnorar}>Ignorar</Botao>
      </div>
    </div>
  );
}
