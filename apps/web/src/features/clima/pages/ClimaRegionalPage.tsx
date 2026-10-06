// src/features/clima/pages/ClimaRegionalPage.tsx
// Tela nova — Clima Regional (/clima). Previsão de 16 dias por propriedade,
// no mesmo estilo das telas geradas a partir do Claude Design (ver adendo
// "HarvestPoint-Clima-Mercado-Telas.pdf", §6). Revise os TODOs do mock em
// features/clima/data/previsaoMock.ts antes de ligar em dado real.
import { useState } from 'react';
import PrevisaoRegua from '../components/PrevisaoRegua';
import { fonteClima, previsaoPropriedades } from '../data/previsaoMock';
import { fmtNum } from '@/lib/uiHelpers';

const DIAS_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
function formatDiaLabel(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return DIAS_SEMANA[d.getDay()];
}

export default function ClimaRegionalPage() {
  const [propriedadeId, setPropriedadeId] = useState(previsaoPropriedades[0].id);
  const [menuAberto, setMenuAberto] = useState(false);

  const propriedade = previsaoPropriedades.find((p) => p.id === propriedadeId) ?? previsaoPropriedades[0];
  const hoje = propriedade.dias[0];
  const semana = propriedade.dias.slice(0, 7);
  const diasRiscoSemana = semana.filter((d) => d.temperaturaMax > propriedade.faixaIdeal.max).length;
  const proximaChuvaSemana = semana.find((d) => d.chanceChuvaPercentual >= 40);
  const chuvaForteSemana = semana.find((d) => d.chanceChuvaPercentual >= 60);
  const hojeEmRisco = hoje.temperaturaMax > propriedade.faixaIdeal.max;
  // Janela seca: primeira sequência de 2+ dias com chuva < 20 % e vento
  // < 15 km/h — boa para pulverização e carregamento.
  const janelaSeca = (() => {
    let ini = -1;
    for (let i = 1; i <= semana.length; i++) {
      const d = semana[i];
      const seco = d && d.chanceChuvaPercentual < 20 && d.ventoKmh < 15;
      if (seco && ini < 0) ini = i;
      if (!seco && ini >= 0) {
        if (i - ini >= 2) return { de: semana[ini], ate: semana[i - 1] };
        ini = -1;
      }
    }
    return null;
  })();

  // TODO: "impacto na operação" ainda é heurística local (deriva do próprio
  // mock de 7 dias); quando o backend de recomendação existir, substituir
  // por uma resposta real do serviço de decisão agroclimática.
  const impacto = {
    irrigacao: diasRiscoSemana > 0
      ? `Reduzir em ${diasRiscoSemana > 1 ? 'dias' : 'dia'} de risco térmico`
      : proximaChuvaSemana
        ? `Suspender em ${formatDiaLabel(proximaChuvaSemana.data)}`
        : 'Manter rotina normal',
    pulverizacao: proximaChuvaSemana
      ? `Evitar antes de ${formatDiaLabel(proximaChuvaSemana.data)}`
      : '✓ sem restrição esta semana',
    colheita: hojeEmRisco || diasRiscoSemana > 0
      ? 'Evitar horário mais quente'
      : '✓ sem impacto previsto',
    carregamento: chuvaForteSemana
      ? `Risco de atraso em ${formatDiaLabel(chuvaForteSemana.data)}`
      : '✓ sem risco previsto',
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '26px', lineHeight: '32px', fontWeight: 700, letterSpacing: '-.01em' }}>
            Clima Regional
          </h1>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)', display: 'block' }} />
            {fonteClima.nome} · atualizado há {fonteClima.atualizadoHaMin} min · próxima atualização em {fonteClima.proximaAtualizacaoMin} min
          </div>
        </div>
        <div style={{ position: 'relative' }}>
          <div
            style={{ height: '40px', padding: '0 14px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', border: '1px solid var(--hp-input-border)', borderRadius: 'var(--hp-radius-sm)', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
            onClick={() => setMenuAberto((v) => !v)}
          >
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1, color: 'var(--hp-text-2)' }}>location_on</span>
            {propriedade.nome}
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1, color: 'var(--hp-text-2)' }}>expand_more</span>
          </div>
          {menuAberto && (
            <div style={{ position: 'absolute', top: '46px', right: 0, width: '220px', background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '12px', boxShadow: '0 8px 24px rgba(22,21,15,.12)', padding: '6px', zIndex: 20 }}>
              {previsaoPropriedades.map((p) => (
                <div
                  key={p.id}
                  style={{ padding: '10px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' }}
                  onClick={() => { setPropriedadeId(p.id); setMenuAberto(false); }}
                >
                  {p.nome}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr) minmax(0,1.2fr)', gap: 'var(--hp-gap)', alignItems: 'stretch' }}>
        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: hojeEmRisco ? 'var(--hp-critico)' : 'var(--hp-accent)', display: 'block' }} />
            <span style={{ fontSize: '13px', lineHeight: '16px', fontWeight: 600 }}>Hoje</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '10px' }}>
            <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '32px', lineHeight: 1, color: hoje.chanceChuvaPercentual >= 40 ? 'var(--hp-info)' : 'var(--hp-atencao)' }}>
              {hoje.chanceChuvaPercentual >= 40 ? 'rainy' : 'wb_sunny'}
            </span>
            <span style={{ fontSize: '40px', lineHeight: '44px', fontWeight: 700, letterSpacing: '-.02em', fontVariantNumeric: 'tabular-nums', color: hojeEmRisco ? 'var(--hp-critico)' : 'var(--hp-text)' }}>
              {fmtNum(hoje.temperaturaMax, 0)}°
            </span>
            <span style={{ fontSize: '16px', color: 'var(--hp-text-2)', fontVariantNumeric: 'tabular-nums' }}>/ {fmtNum(hoje.temperaturaMin, 0)}°</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', fontSize: '12px', color: 'var(--hp-text-2)' }}>
            {[
              ['Chuva', `${hoje.chanceChuvaPercentual} %`],
              ['Umidade do ar', `${hoje.umidadeArPercentual} %`],
              ['Vento', `${hoje.ventoKmh} km/h`],
              ['Evapotransp.', `${fmtNum(hoje.evapotranspiracaoMm)} mm`],
            ].map(([rotulo, valor]) => (
              <div key={rotulo}>
                {rotulo}
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--hp-text)', fontVariantNumeric: 'tabular-nums' }}>{valor}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: '12px', fontWeight: 600, color: hojeEmRisco ? 'var(--hp-critico)' : 'var(--hp-accent-hover)', marginTop: 'auto', paddingTop: '10px' }}>
            {hojeEmRisco
              ? `▲ acima do ideal para ${propriedade.faixaIdeal.cultura.toLowerCase()}`
              : `✓ ideal p/ ${propriedade.faixaIdeal.cultura.toLowerCase()} · sem alerta`}
          </div>
        </div>

        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' }}>
            RESUMO 7 DIAS
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1, color: diasRiscoSemana > 0 ? 'var(--hp-critico)' : 'var(--hp-accent-hover)', flexShrink: 0 }}>thermostat</span>
              <span style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--hp-text-4)' }}>
                {diasRiscoSemana > 0
                  ? <><strong>{diasRiscoSemana} dia{diasRiscoSemana > 1 ? 's' : ''} acima de {propriedade.faixaIdeal.max} °C</strong> nesta semana.</>
                  : `Nenhum dia com risco de estresse térmico p/ ${propriedade.faixaIdeal.cultura.toLowerCase()} esta semana.`}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1, color: 'var(--hp-info)', flexShrink: 0 }}>rainy</span>
              <span style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--hp-text-4)' }}>
                {proximaChuvaSemana
                  ? <><strong>Chuva provável em {formatDiaLabel(proximaChuvaSemana.data)}</strong> — {proximaChuvaSemana.chanceChuvaPercentual} % de chance.</>
                  : 'Nenhuma chuva relevante prevista nos próximos 7 dias.'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <span style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: 1, color: 'var(--hp-text-2)', flexShrink: 0 }}>air</span>
              <span style={{ fontSize: '13px', lineHeight: '19px', color: 'var(--hp-text-4)' }}>
                {janelaSeca
                  ? <><strong>Janela seca {formatDiaLabel(janelaSeca.de.data)}–{formatDiaLabel(janelaSeca.ate.data)}</strong> — chuva abaixo de 20 % e vento abaixo de 15 km/h.</>
                  : 'Sem janela seca de 2 dias ou mais nesta semana.'}
              </span>
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' }}>
            IMPACTO NA OPERAÇÃO
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '13px', lineHeight: '19px' }}>
            <span>Irrigação</span>
            <span style={{ fontWeight: 600, textAlign: 'right', color: impacto.irrigacao.startsWith('✓') ? 'var(--hp-accent-hover)' : 'var(--hp-atencao)' }}>{impacto.irrigacao}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '13px', lineHeight: '19px' }}>
            <span>Pulverização</span>
            <span style={{ fontWeight: 600, textAlign: 'right', color: impacto.pulverizacao.startsWith('✓') ? 'var(--hp-accent-hover)' : 'var(--hp-atencao)' }}>{impacto.pulverizacao}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '13px', lineHeight: '19px' }}>
            <span>Colheita</span>
            <span style={{ fontWeight: 600, textAlign: 'right', color: impacto.colheita.startsWith('✓') ? 'var(--hp-accent-hover)' : 'var(--hp-atencao)' }}>{impacto.colheita}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '13px', lineHeight: '19px' }}>
            <span>Carregamento</span>
            <span style={{ fontWeight: 600, textAlign: 'right', color: impacto.carregamento.startsWith('✓') ? 'var(--hp-accent-hover)' : 'var(--hp-atencao)' }}>{impacto.carregamento}</span>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', padding: 'var(--hp-pad)' }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: 700, marginBottom: '12px' }}>
          Régua de previsão
        </div>
        <PrevisaoRegua dias={propriedade.dias} faixaIdeal={propriedade.faixaIdeal} />
      </div>

      {previsaoPropriedades.length > 1 && (
        <div style={{ background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: 'var(--hp-radius)', overflow: 'hidden' }}>
          <div style={{ padding: '14px var(--hp-pad)', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', fontWeight: 700, borderBottom: '1px solid var(--hp-border)' }}>
            Por propriedade
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.4fr', alignItems: 'center', height: '40px', padding: '0 var(--hp-pad)', background: 'var(--hp-surface-2)', fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' }}>
            <span>PROPRIEDADE</span>
            <span style={{ textAlign: 'right' }}>MÁX. SEMANA</span>
            <span style={{ textAlign: 'right' }}>DIAS DE RISCO</span>
            <span style={{ textAlign: 'right' }}>CHUVA</span>
            <span style={{ textAlign: 'right' }}>SITUAÇÃO</span>
          </div>
          {previsaoPropriedades.map((p) => {
            const sem = p.dias.slice(0, 7);
            const maxSemana = Math.max(...sem.map((d) => d.temperaturaMax));
            const diasRisco = sem.filter((d) => d.temperaturaMax > p.faixaIdeal.max).length;
            const chuvaAcumulada = sem.reduce((acc, d) => acc + d.precipitacaoMm, 0);
            const emRisco = diasRisco > 0;
            return (
              <div
                key={p.id}
                style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.4fr', alignItems: 'center', height: 'var(--hp-row)', padding: '0 var(--hp-pad)', borderTop: '1px solid var(--hp-border)', fontSize: '14px', fontVariantNumeric: 'tabular-nums', cursor: 'pointer' }}
                onClick={() => setPropriedadeId(p.id)}
              >
                <span style={{ fontWeight: 600 }}>{p.nome} · {p.municipio}</span>
                <span style={{ textAlign: 'right' }}>{fmtNum(maxSemana, 0)} °C</span>
                <span style={{ textAlign: 'right' }}>{diasRisco}</span>
                <span style={{ textAlign: 'right' }}>{fmtNum(chuvaAcumulada, 0)} mm</span>
                <span style={{ textAlign: 'right' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: emRisco ? 'var(--hp-critico-bg)' : 'var(--hp-accent-soft)', color: emRisco ? 'var(--hp-critico)' : 'var(--hp-accent-hover)', fontSize: '12px', fontWeight: 600 }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: emRisco ? 'var(--hp-critico)' : 'var(--hp-accent)' }} />
                    {emRisco ? 'estresse térmico' : 'dentro da faixa'}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
