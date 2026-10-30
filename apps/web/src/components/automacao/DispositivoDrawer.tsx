// apps/web/src/components/automacao/DispositivoDrawer.tsx
// Drawer do kit IoT (ESP32 + DHT22 + sensor capacitivo de solo). É o mesmo
// da tela de Automação e do código do sensor nas Leituras IoT.
import Drawer from '@/components/overlay/Drawer';
import { fmtNum } from '@/lib/uiHelpers';
import { sparkPontos, ultimasLeituras } from './data/curvas';
import { useAutomacao } from './store';
import type { Kit } from './types';
import Sparkline from './Sparkline';
import { Pilula, Ponto, sobrelinha } from './ui';

export function statusDoKit(kit: Kit, semSinal: boolean) {
  const off = semSinal && kit.atuadorId === 'a1';
  return {
    off,
    texto: off ? 'off-line' : 'on-line',
    sinal: off ? 'há 18 min' : kit.sinal,
    fg: off ? 'var(--hp-critico)' : 'var(--hp-accent-hover)',
    bg: off ? 'var(--hp-critico-bg)' : 'var(--hp-accent-soft)',
  };
}

export function StatusKitPilula({ kit, semSinal }: { kit: Kit; semSinal: boolean }) {
  const s = statusDoKit(kit, semSinal);
  return <Pilula fg={s.fg} bg={s.bg}><Ponto cor={s.fg} />{s.texto}</Pilula>;
}

interface Props {
  kitId: string | null;
  aoFechar: () => void;
  /** 440 nas Leituras IoT, 480 na Automação */
  largura?: number;
}

export default function DispositivoDrawer({ kitId, aoFechar, largura = 480 }: Props) {
  const { kits, semSinal } = useAutomacao();
  const kit = kitId ? kits.find((k) => k.id === kitId) ?? null : null;
  const s = kit ? statusDoKit(kit, semSinal) : null;
  const hoje = kit?.atuadorId === 'a1';
  const caixa: React.CSSProperties = { border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius-sm)', padding: '10px' };
  const rotulo: React.CSSProperties = { fontSize: '12px', color: 'var(--hp-text-2)' };
  const valor: React.CSSProperties = { fontSize: '17px', fontWeight: 700, marginTop: '4px', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
  const unidade: React.CSSProperties = { fontSize: '12px', fontWeight: 500, color: 'var(--hp-text-2)' };
  return (
    <Drawer aberto={!!kit} aoFechar={aoFechar} largura={largura} titulo={kit?.id ?? ''}
      subtitulo={kit && `${kit.lote} · ESP32 + DHT22 + sensor capacitivo de solo`}>
      {kit && s && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            <div style={caixa}><div style={rotulo}>Status</div><div style={{ marginTop: '6px' }}><StatusKitPilula kit={kit} semSinal={semSinal} /></div></div>
            <div style={caixa}><div style={rotulo}>Bateria</div><div style={valor}>{kit.bateria} %</div></div>
            <div style={caixa}><div style={rotulo}>Sinal</div><div style={valor}>{kit.wifi} <span style={unidade}>dBm</span></div></div>
            <div style={caixa}><div style={rotulo}>Firmware</div><div style={valor}>{kit.firmware}</div></div>
          </div>
          <div>
            <div style={sobrelinha}>TEMPERATURA · ÚLTIMAS 6 H</div>
            <div style={{ marginTop: '8px' }}>
              <Sparkline pontos={sparkPontos(kit.pico, hoje, hoje ? 0 : -0.3)} largura="100%" altura={90} semSinal={s.off} traco={1.4} esticar
                rotulo="Temperatura do kit nas últimas 6 horas" />
            </div>
          </div>
          <div>
            <div style={sobrelinha}>ÚLTIMAS 20 LEITURAS</div>
            <div style={{ border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius-sm)', overflow: 'hidden', marginTop: '8px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontVariantNumeric: 'tabular-nums' }}>
                <thead>
                  <tr style={{ background: 'var(--hp-surface-2)', fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-2)' }}>
                    <th scope="col" style={{ textAlign: 'left', padding: '9px 14px' }}>HORA</th>
                    <th scope="col" style={{ textAlign: 'right', padding: '9px 14px' }}>AR °C</th>
                    <th scope="col" style={{ textAlign: 'right', padding: '9px 14px' }}>UM. AR %</th>
                    <th scope="col" style={{ textAlign: 'right', padding: '9px 14px' }}>SOLO %</th>
                  </tr>
                </thead>
                <tbody>
                  {ultimasLeituras(kit.pico, hoje).map((r) => (
                    <tr key={r.h} style={{ borderTop: '1px solid var(--hp-border)', fontSize: '13px' }}>
                      <td style={{ padding: '8px 14px' }}>{r.h}</td>
                      <td style={{ padding: '8px 14px', textAlign: 'right', color: r.acima ? 'var(--hp-critico)' : 'var(--hp-text)', fontWeight: r.acima ? 600 : 400 }}>{r.tTxt}{r.acima ? ' ▲' : ''}</td>
                      <td style={{ padding: '8px 14px', textAlign: 'right' }}>{r.arTxt}</td>
                      <td style={{ padding: '8px 14px', textAlign: 'right' }}>{r.soloTxt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '8px' }}>
              Última leitura {s.sinal} · limite de {fmtNum(35, 0)} °C. Dados simulados.
            </div>
          </div>
        </>
      )}
    </Drawer>
  );
}
