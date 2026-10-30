// apps/web/src/components/automacao/AcaoNecessariaBanner.tsx
// Aviso pendente de aprovação, com contagem regressiva. `compact` é a versão
// do card da Automação no Dashboard.
import type { AvisoPendente } from './types';
import { Botao, Icone, sobrelinha } from './ui';

export function formatarExpira(seg: number): string {
  return Math.floor(seg / 60) + ' MIN ' + String(seg % 60).padStart(2, '0') + ' S';
}

interface Props {
  aviso: AvisoPendente;
  compact?: boolean;
  aoLigar: () => void;
  aoIgnorar?: () => void;
  aoDetalhes?: () => void;
}

export default function AcaoNecessariaBanner({ aviso, compact, aoLigar, aoIgnorar, aoDetalhes }: Props) {
  if (compact) {
    return (
      <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-atencao-bg)', border: '1px solid var(--hp-atencao)' }}>
        <Icone nome="warning" tamanho={20} cor="var(--hp-atencao)" />
        <div style={{ flex: 1, fontSize: '13px', lineHeight: '19px' }}>
          <b>{aviso.lote}</b> · {aviso.temp} °C há 10 min. Ligar por 15 min?
        </div>
        <Botao variante="primario" altura={32} onClick={aoLigar}>Ligar</Botao>
      </div>
    );
  }
  return (
    <div className="au-banner" role="alert" style={{ padding: '16px 20px', borderRadius: 'var(--hp-radius)', background: 'var(--hp-atencao-bg)', border: '1px solid var(--hp-atencao)', animation: 'hpIn 150ms ease-out' }}>
      <Icone nome="warning" tamanho={24} cor="var(--hp-atencao)" />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ ...sobrelinha, color: 'var(--hp-atencao)' }}>AÇÃO NECESSÁRIA · EXPIRA EM {formatarExpira(aviso.seg)}</div>
        <div style={{ fontSize: '15px', lineHeight: '22px', color: 'var(--hp-text)', marginTop: '2px' }}>
          <b>{aviso.lote}</b> · {aviso.temp} °C há 10 min (limite {aviso.limite} °C) · solo {aviso.solo} %. Ligar aspersores por 15 min?
        </div>
      </div>
      <div className="au-banner-acoes">
        <Botao variante="primario" icone="water_drop" onClick={aoLigar}>Ligar por 15 min</Botao>
        {aoIgnorar && <Botao onClick={aoIgnorar}>Ignorar</Botao>}
        {aoDetalhes && <Botao variante="texto" cor="var(--hp-atencao)" onClick={aoDetalhes}>Ver detalhes</Botao>}
      </div>
    </div>
  );
}
