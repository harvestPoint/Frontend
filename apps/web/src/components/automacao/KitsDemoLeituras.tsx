// apps/web/src/components/automacao/KitsDemoLeituras.tsx
// Bloco "Kits de automação · demonstração" das Leituras IoT. Os sensores da
// tabela são reais (API) e não têm atuador; os kits IOT-001 a 003 vêm do mock
// da Automação, então ficam separados e marcados como exemplo até a etapa 5.
import { useState } from 'react';
import { useAutomacao } from './store';
import DispositivoDrawer from './DispositivoDrawer';
import KitSaudeTable from './KitSaudeTable';
import { FONTE_TITULO } from './ui';

export default function KitsDemoLeituras() {
  const s = useAutomacao();
  const [kitAberto, setKitAberto] = useState<string | null>(null);
  if (s.status !== 'pronto' || s.kits.length === 0) return null;

  return (
    <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <div style={{ fontFamily: FONTE_TITULO, fontSize: '16px', lineHeight: '22px', fontWeight: 700 }}>
          Kits de automação · demonstração
        </div>
        <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '2px' }}>
          Dados de exemplo da tela de Automação. Ainda não vêm dos sensores acima.
        </div>
      </div>
      <KitSaudeTable kits={s.kits} semSinal={s.semSinal} aoAbrir={setKitAberto} />
      <DispositivoDrawer kitId={kitAberto} aoFechar={() => setKitAberto(null)} largura={440} />
    </div>
  );
}
