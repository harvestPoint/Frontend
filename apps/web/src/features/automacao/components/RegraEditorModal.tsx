// apps/web/src/features/automacao/components/RegraEditorModal.tsx
// Editor de regra (só Técnico): 8 campos com stepper − / + e uma prévia viva
// de quantas vezes a regra teria disparado nos últimos 7 dias.
import { useState } from 'react';
import Modal from '@/components/overlay/Modal';
import { FORM_PADRAO } from '../data/automacaoMock';
import { MAX_DIA } from '../data/curvas';
import type { FormRegra } from '../types';
import { Botao, FONTE_TITULO, FecharX, Icone } from './ui';

type Campo = { rotulo: string; chave: keyof FormRegra; passo: number; min: number; max: number; formatar: (f: FormRegra) => string };
const CAMPOS: Campo[] = [
  { rotulo: 'Limite de temperatura', chave: 'limite', passo: 1, min: 30, max: 42, formatar: (f) => f.limite + ' °C' },
  { rotulo: 'Duração mínima', chave: 'dur', passo: 5, min: 5, max: 30, formatar: (f) => f.dur + ' min' },
  { rotulo: 'Bloquear se o solo passar de', chave: 'solo', passo: 5, min: 15, max: 60, formatar: (f) => f.solo + ' %' },
  { rotulo: 'Início da janela', chave: 'ini', passo: 1, min: 0, max: 12, formatar: (f) => String(f.ini).padStart(2, '0') + 'h – 20h' },
  { rotulo: 'Pulso ligado', chave: 'on', passo: 5, min: 5, max: 30, formatar: (f) => f.on + ' min' },
  { rotulo: 'Pulso desligado', chave: 'off', passo: 5, min: 5, max: 30, formatar: (f) => f.off + ' min' },
  { rotulo: 'Máximo de ciclos', chave: 'ciclos', passo: 1, min: 1, max: 8, formatar: (f) => String(f.ciclos) },
  { rotulo: 'Prazo de aprovação', chave: 'prazo', passo: 5, min: 5, max: 60, formatar: (f) => f.prazo + ' min' },
];

/** Prévia (mock): conta quantos dos últimos 7 dias passariam do limite.
 *  TODO: trocar por retroteste real com a telemetria da API. */
export function disparosEm7Dias(f: FormRegra): number {
  return MAX_DIA.filter((m) => m >= f.limite + 1 + (f.dur - 10) * 0.04).length;
}

interface Props {
  aberto: boolean;
  /** null = regra nova */
  regraId: string | null;
  inicial: FormRegra | undefined;
  aoFechar: () => void;
  aoSalvar: (form: FormRegra) => void;
}

function Corpo({ regraId, inicial, aoFechar, aoSalvar }: Omit<Props, 'aberto'>) {
  const [f, setF] = useState<FormRegra>(inicial ?? FORM_PADRAO);
  const ajustar = (c: Campo, d: number) => setF((x) => ({ ...x, [c.chave]: Math.max(c.min, Math.min(c.max, x[c.chave] + d)) }));
  const vezes = disparosEm7Dias(f);
  const passo: React.CSSProperties = { width: '32px', height: '32px', borderRadius: '8px', border: 0, background: 'var(--hp-surface-2)', color: 'var(--hp-text)', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div id="au-regra-titulo" style={{ fontFamily: FONTE_TITULO, fontSize: '20px', fontWeight: 700 }}>{regraId ? 'Editar regra' : 'Nova regra'}</div>
        <FecharX onClick={aoFechar} />
      </div>
      <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', marginTop: '2px' }}>Só o técnico de campo edita regras.</div>
      <div className="au-regra-campos" style={{ marginTop: '18px' }}>
        {CAMPOS.map((c) => (
          <div key={c.chave} role="group" aria-label={c.rotulo}>
            <div style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>{c.rotulo}</div>
            <div style={{ height: '44px', borderRadius: 'var(--hp-radius-sm)', border: '1px solid var(--hp-input-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 6px 0 14px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }} aria-live="polite">{c.formatar(f)}</span>
              <span style={{ display: 'flex', gap: '4px' }}>
                <button type="button" className="au-btn" style={passo} aria-label={'Diminuir ' + c.rotulo} onClick={() => ajustar(c, -c.passo)}>−</button>
                <button type="button" className="au-btn" style={passo} aria-label={'Aumentar ' + c.rotulo} onClick={() => ajustar(c, c.passo)}>+</button>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px', padding: '14px 16px', borderRadius: 'var(--hp-radius-sm)', background: 'var(--hp-accent-soft)', color: 'var(--hp-text)' }}>
        <Icone nome="history" tamanho={22} cor="var(--hp-accent-hover)" />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700 }}>Teria disparado {vezes} {vezes === 1 ? 'vez' : 'vezes'} nos últimos 7 dias</div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>
            Com limite de {f.limite} °C por {f.dur} min, nas leituras de 7 dias do IOT-001 e do IOT-002 (dados simulados).
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '20px' }}>
        <Botao onClick={aoFechar}>Cancelar</Botao>
        <Botao variante="primario" onClick={() => aoSalvar(f)}>Salvar regra</Botao>
      </div>
    </>
  );
}

export default function RegraEditorModal({ aberto, regraId, inicial, aoFechar, aoSalvar }: Props) {
  return (
    <Modal aberto={aberto} aoFechar={aoFechar} largura={620} rotuloId="au-regra-titulo">
      {/* key reinicia os campos a cada abertura/regra diferente */}
      <Corpo key={regraId ?? 'nova'} regraId={regraId} inicial={inicial} aoFechar={aoFechar} aoSalvar={aoSalvar} />
    </Modal>
  );
}
