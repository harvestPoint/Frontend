// apps/web/src/components/automacao/LinhaDoTempo.tsx
import { useState } from 'react';
import type { Evento, TipoEvento } from './types';
import EventoRow from './EventoRow';
import { cartao, tituloCartao } from './ui';

const GRUPOS: Record<string, TipoEvento[] | null> = {
  todos: null,
  acion: ['ligou', 'desligou'],
  avisos: ['gatilho', 'aviso', 'aprovado', 'recusado', 'expirou'],
  prob: ['bloqueado', 'falha'],
};
const TIPOS: [string, string][] = [['todos', 'Todos'], ['acion', 'Acionamentos'], ['avisos', 'Avisos'], ['prob', 'Problemas']];
const SETORES: [string, string][] = [['todos', 'Todos os setores'], ['A1', 'A1'], ['C3', 'C3'], ['B2', 'B2']];

function Chip({ ativo, onClick, children }: { ativo: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button" aria-pressed={ativo} onClick={onClick} className="au-btn"
      style={{
        height: '28px', padding: '0 10px', borderRadius: '14px', fontSize: '12px', fontWeight: 600,
        border: '1px solid ' + (ativo ? 'var(--hp-accent)' : 'var(--hp-input-border)'),
        background: ativo ? 'var(--hp-accent-soft)' : 'transparent', color: ativo ? 'var(--hp-accent-hover)' : 'var(--hp-text-2)',
      }}
    >
      {children}
    </button>
  );
}

export default function LinhaDoTempo({ eventos, aoAbrir }: { eventos: Evento[]; aoAbrir: (e: Evento) => void }) {
  const [fTipo, setFTipo] = useState('todos');
  const [fSetor, setFSetor] = useState('todos');
  const lista = eventos.filter((e) => (!GRUPOS[fTipo] || GRUPOS[fTipo]!.includes(e.tipo)) && (fSetor === 'todos' || e.setor === fSetor));
  return (
    <section style={cartao} aria-label="Linha do tempo">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div style={tituloCartao}>Linha do tempo</div>
        <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>Hoje, 03/10</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '14px', alignItems: 'center' }}>
        {TIPOS.map(([k, l]) => <Chip key={k} ativo={fTipo === k} onClick={() => setFTipo(k)}>{l}</Chip>)}
        <span aria-hidden="true" style={{ width: '1px', alignSelf: 'stretch', background: 'var(--hp-border)', margin: '0 4px' }} />
        {SETORES.map(([k, l]) => <Chip key={k} ativo={fSetor === k} onClick={() => setFSetor(k)}>{l}</Chip>)}
      </div>
      <ul style={{ display: 'flex', flexDirection: 'column', margin: '10px 0 0', padding: 0, maxHeight: '470px', overflowY: 'auto' }}>
        {lista.map((e) => <EventoRow key={e.id} evento={e} aoAbrir={() => aoAbrir(e)} />)}
        {lista.length === 0 && (
          <li style={{ listStyle: 'none', padding: '24px 8px', textAlign: 'center', fontSize: '13px', color: 'var(--hp-text-2)', borderTop: '1px solid var(--hp-border)' }}>
            Nenhum evento com esses filtros.
          </li>
        )}
      </ul>
    </section>
  );
}
