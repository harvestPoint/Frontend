// apps/web/src/features/automacao/components/SimuladorPanel.tsx
// Só para demonstração do projeto (Técnico). Percorre leitura → gatilho →
// aviso → aprovar → liga → pausa → desliga, sem depender de hardware.
import { Botao, Icone } from './ui';

interface Props {
  aoCalor: () => void;
  aoSemSinal: () => void;
  aoResetar: () => void;
  /** só aparece com aviso pendente */
  aoVerAviso?: () => void;
}

export default function SimuladorPanel({ aoCalor, aoSemSinal, aoResetar, aoVerAviso }: Props) {
  return (
    <div className="au-sim" style={{ padding: '12px 16px', border: '1px dashed var(--hp-input-border)', borderRadius: '14px', background: 'var(--hp-surface)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'var(--hp-text-2)', flex: '1 1 320px' }}>
        <Icone nome="science" tamanho={18} />
        <span><b style={{ color: 'var(--hp-text)' }}>Simulador</b> · só para demonstração do projeto. Percorre leitura → gatilho → aviso → aprovar → liga → pausa → desliga.</span>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        <Botao altura={34} icone="local_fire_department" onClick={aoCalor}>Simular onda de calor</Botao>
        <Botao altura={34} icone="signal_disconnected" onClick={aoSemSinal}>Simular sensor sem sinal</Botao>
        {aoVerAviso && <Botao altura={34} icone="smartphone" onClick={aoVerAviso}>Ver aviso no celular</Botao>}
        <Botao altura={34} icone="restart_alt" onClick={aoResetar}>Resetar</Botao>
      </div>
    </div>
  );
}
