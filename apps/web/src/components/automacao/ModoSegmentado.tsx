// apps/web/src/components/automacao/ModoSegmentado.tsx
// Automático · Aprovação · Manual. Só o Técnico altera; para o Proprietário
// o controle fica a 60 % de opacidade e não responde ao clique.
import { MODOS } from './store';
import type { ModoAtuador } from './types';

interface Props {
  modo: ModoAtuador;
  podeEditar: boolean;
  aoEscolher: (m: ModoAtuador) => void;
  rotulo: string;
}

export default function ModoSegmentado({ modo, podeEditar, aoEscolher, rotulo }: Props) {
  return (
    <div role="radiogroup" aria-label={rotulo} style={{ display: 'flex', padding: '3px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-surface-2)', gap: '2px' }}>
      {MODOS.map(([k, label]) => {
        const ativo = modo === k;
        return (
          <button
            key={k} type="button" role="radio" aria-checked={ativo}
            title={podeEditar ? undefined : 'Só o técnico altera o modo'}
            onClick={(e) => { e.stopPropagation(); if (podeEditar && !ativo) aoEscolher(k); }}
            className="au-btn"
            style={{
              flex: 1, height: '32px', padding: '0 10px', borderRadius: '10px', border: 0, fontSize: '13px', fontWeight: 600,
              whiteSpace: 'nowrap', background: ativo ? 'var(--hp-surface)' : 'transparent',
              color: ativo ? 'var(--hp-text)' : 'var(--hp-text-2)', boxShadow: ativo ? '0 1px 2px rgba(34,31,24,.08)' : 'none',
              cursor: podeEditar ? 'pointer' : 'default', opacity: podeEditar || ativo ? 1 : 0.6,
            }}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
