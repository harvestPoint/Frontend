// apps/web/src/components/automacao/RegraItem.tsx
import type { Regra } from './types';
import { Botao, Pilula, Ponto } from './ui';

interface Props {
  regra: Regra;
  tecnico: boolean;
  aoAlternar: () => void;
  aoEditar: () => void;
}

export default function RegraItem({ regra, tecnico, aoAlternar, aoEditar }: Props) {
  const on = regra.ativa;
  const editavel = !!regra.form;
  return (
    <div style={{ border: '1px solid var(--hp-border)', borderRadius: '14px', padding: '16px', background: on ? 'var(--hp-surface)' : 'var(--hp-surface-2)' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '14px', lineHeight: '21px', color: 'var(--hp-text)', flex: 1, minWidth: 0 }}>{regra.frase}</div>
        <button
          type="button" role="switch" aria-checked={on} aria-label={on ? 'Desativar regra' : 'Ativar regra'}
          title={tecnico ? (on ? 'Desativar regra' : 'Ativar regra') : 'Só o técnico ativa ou desativa regras'}
          onClick={() => tecnico && aoAlternar()} className="au-btn"
          style={{ width: '40px', height: '24px', borderRadius: '12px', border: 0, padding: 0, background: on ? 'var(--hp-accent)' : 'var(--hp-input-border)', position: 'relative', flexShrink: 0, cursor: tecnico ? 'pointer' : 'default', opacity: tecnico ? 1 : 0.6, transition: 'background-color 150ms' }}
        >
          <span style={{ position: 'absolute', top: '3px', left: on ? '19px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: '#FFFFFF', transition: 'left 150ms' }} />
        </button>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px' }}>{regra.alvo}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
        <Pilula fg={on ? 'var(--hp-accent-hover)' : 'var(--hp-text-2)'} bg={on ? 'var(--hp-accent-soft)' : 'var(--hp-surface-2)'}>
          <Ponto cor={on ? 'var(--hp-accent-hover)' : 'var(--hp-text-3)'} />
          {on ? 'ativa' : 'inativa'}
        </Pilula>
        {tecnico && (
          <Botao variante="texto" altura={32} onClick={aoEditar} desabilitado={!editavel}
            titulo={editavel ? undefined : 'Este tipo de regra ainda não tem editor'}>
            Editar
          </Botao>
        )}
      </div>
    </div>
  );
}
