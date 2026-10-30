// Detalhe do lote. Antes era um protótipo com números fixos (31,9 °C,
// "dia 98 de 120", gráfico desenhado à mão); agora tudo vem de GET /lotes/:id
// e da cultura do lote (para os limites de temperatura e umidade).
import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  formatDate,
  formatDateTime,
  getLote,
  listCulturas,
  readApiError,
  statusLoteLabel,
  type Cultura,
  type Lote,
} from '@/lib/api';
import { fmtNum } from '@/lib/uiHelpers';

const cartao: CSSProperties = { background: 'var(--hp-surface)', border: '1px solid var(--hp-border)', borderRadius: '16px', padding: '20px' };
const sobrelinha: CSSProperties = { fontSize: '11px', fontWeight: 700, letterSpacing: '.08em', color: 'var(--hp-text-3)' };
const icone = (nome: string, extra?: CSSProperties) => (
  <span aria-hidden="true" style={{ fontFamily: "'Material Symbols Outlined'", fontSize: '18px', lineHeight: '1', ...extra }}>{nome}</span>
);

type Aba = 'leituras' | 'alertas';

/** Compara o valor com a faixa da cultura: acima / dentro / abaixo */
function Faixa({ valor, min, max }: { valor?: number | null; min?: number; max?: number }) {
  if (valor == null) return null;
  if (min == null || max == null) return <span style={{ fontSize: '12px', color: 'var(--hp-text-3)' }}>sem faixa</span>;
  if (valor > max) return <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hp-critico)' }}>▲ acima</span>;
  if (valor < min) return <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hp-atencao)' }}>▼ abaixo</span>;
  return <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--hp-accent)' }}>✓ dentro</span>;
}

/** Gráfico simples das últimas leituras (temperatura e umidade), da mais antiga à mais nova */
function GraficoLeituras({ lote, cultura }: { lote: Lote; cultura?: Cultura }) {
  const pontos = useMemo(() => [...(lote.leituras ?? [])].reverse(), [lote.leituras]);
  if (pontos.length < 2) {
    return <div style={{ fontSize: '13px', color: 'var(--hp-text-2)', padding: '24px 0' }}>Ainda não há leituras suficientes para o gráfico (mínimo de 2).</div>;
  }
  const W = 900, H = 260, X0 = 40, X1 = 860, Y0 = 20, Y1 = 220;
  const x = (i: number) => X0 + (i * (X1 - X0)) / (pontos.length - 1);
  const temps = pontos.map((p) => p.temperatura);
  const tMin = Math.min(...temps, cultura?.temperatura_min ?? Infinity) - 2;
  const tMax = Math.max(...temps, cultura?.temperatura_max ?? -Infinity) + 2;
  const yT = (t: number) => Y1 - ((t - tMin) / (tMax - tMin || 1)) * (Y1 - Y0);
  const yU = (u: number) => Y1 - (u / 100) * (Y1 - Y0);
  const linha = (f: (i: number) => number) => pontos.map((_, i) => `${x(i).toFixed(1)},${f(i).toFixed(1)}`).join(' ');
  const hora = (iso: string) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const marcas = [0, Math.floor((pontos.length - 1) / 2), pontos.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} role="img" aria-label={`Temperatura e umidade das últimas ${pontos.length} leituras`} style={{ width: '100%', height: 'auto', marginTop: '12px' }}>
      {cultura ? (
        <>
          <rect x={X0} y={yT(cultura.temperatura_max)} width={X1 - X0} height={Math.max(0, yT(cultura.temperatura_min) - yT(cultura.temperatura_max))} fill="var(--hp-accent-band)" />
          <line x1={X0} x2={X1} y1={yT(cultura.temperatura_max)} y2={yT(cultura.temperatura_max)} stroke="var(--hp-accent)" strokeDasharray="5 5" />
          <text x={X0 + 4} y={yT(cultura.temperatura_max) - 6} style={{ font: '600 12px Inter, sans-serif', fill: 'var(--hp-accent)' }}>
            limite {cultura.nome.toLowerCase()} {fmtNum(cultura.temperatura_max)} °C
          </text>
        </>
      ) : null}
      <polyline points={linha((i) => yU(pontos[i].umidade))} fill="none" stroke="var(--hp-info)" strokeWidth="2" strokeLinejoin="round" />
      <polyline points={linha((i) => yT(pontos[i].temperatura))} fill="none" stroke="var(--hp-temp)" strokeWidth="2.5" strokeLinejoin="round" />
      {marcas.map((i) => (
        <text key={i} x={x(i)} y={H + 16} textAnchor={i === 0 ? 'start' : i === pontos.length - 1 ? 'end' : 'middle'} style={{ font: '400 12px Inter, sans-serif', fill: 'var(--hp-text-2)' }}>
          {hora(pontos[i].data_hora)}
        </text>
      ))}
    </svg>
  );
}

export default function LoteDetalhePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [lote, setLote] = useState<Lote | null>(null);
  const [culturas, setCulturas] = useState<Cultura[]>([]);
  const [erro, setErro] = useState('');
  const [aba, setAba] = useState<Aba>('leituras');
  const [agora] = useState(() => Date.now()); // fixo durante a visita, para o "dia N" não oscilar

  useEffect(() => {
    if (!id) return;
    setErro('');
    getLote(id)
      .then(setLote)
      .catch((err) => setErro(readApiError(err).status === 404 ? 'Lote não encontrado.' : readApiError(err).message || 'Não foi possível carregar o lote.'));
    listCulturas().then(setCulturas).catch(() => setCulturas([]));
  }, [id]);

  const cultura = culturas.find((c) => c.id === lote?.cultura_id);
  const alertasAbertos = (lote?.alertas_recentes ?? []).filter((a) => !a.resolvido);
  const rec = lote?.recomendacao_atual;
  const diasPlantio = lote?.data_plantio ? Math.max(0, Math.floor((agora - new Date(`${lote.data_plantio}T00:00:00`).getTime()) / 86400000)) : null;
  const ciclo = cultura?.ciclo_medio_dias ?? rec?.ciclo_medio_dias;
  const progresso = diasPlantio != null && ciclo ? Math.min(100, Math.round((diasPlantio / ciclo) * 100)) : null;

  const voltar = (
    <button type="button" onClick={() => navigate('/lotes')} style={{ alignSelf: 'flex-start', border: 'none', background: 'transparent', padding: 0, fontSize: '13px', fontWeight: 600, color: 'var(--hp-accent)', cursor: 'pointer' }}>
      ‹ Lotes
    </button>
  );

  if (erro) {
    return (
      <>
        {voltar}
        <div role="alert" style={{ ...cartao, color: 'var(--hp-critico)', background: 'var(--hp-critico-bg)' }}>{erro}</div>
      </>
    );
  }
  if (!lote) {
    return (
      <>
        {voltar}
        <div style={{ fontSize: '14px', color: 'var(--hp-text-2)' }}>Carregando lote...</div>
      </>
    );
  }

  const abaBtn = (valor: Aba, rotulo: string) => (
    <button
      type="button"
      role="tab"
      aria-selected={aba === valor}
      onClick={() => setAba(valor)}
      style={{ padding: '12px 2px', border: 'none', borderBottom: `2px solid ${aba === valor ? 'var(--hp-accent)' : 'transparent'}`, background: 'transparent', fontSize: '13px', fontWeight: 600, color: aba === valor ? 'var(--hp-text)' : 'var(--hp-text-2)', cursor: 'pointer' }}
    >
      {rotulo}
    </button>
  );

  return (
    <>
      {voltar}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: '0', fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '28px', lineHeight: '34px', fontWeight: '700', letterSpacing: '-.01em' }}>
              {lote.codigo} · {lote.cultura}
            </h1>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '24px', padding: '0 10px', borderRadius: '12px', background: 'var(--hp-accent-soft)', color: 'var(--hp-accent)', fontSize: '12px', fontWeight: '600' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--hp-accent)' }} />
              {statusLoteLabel(lote.status)}
            </span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '6px' }}>
            {lote.propriedade} · {fmtNum(lote.area_ha ?? 0)} ha · plantio {formatDate(lote.data_plantio)} · sensor {lote.sensor_vinculado || '—'}
          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate(`/lotes?editar=${lote.id}`)}
          style={{ height: '40px', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--hp-surface)', color: 'var(--hp-text)', border: '1px solid var(--hp-input-border)', borderRadius: '12px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
        >
          {icone('edit')}
          Editar
        </button>
      </div>

      {alertasAbertos.length > 0 ? (
        <div role="status" style={{ background: 'var(--hp-critico-bg)', borderLeft: '3px solid var(--hp-critico)', borderRadius: '16px', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          {icone('warning', { fontSize: '22px', color: 'var(--hp-critico)' })}
          <div style={{ flex: 1, minWidth: '220px', fontSize: '14px', lineHeight: '20px', color: 'var(--hp-text)' }}>
            <b>{alertasAbertos.length} alerta(s) em aberto.</b> {alertasAbertos[0].mensagem}
          </div>
          <button type="button" onClick={() => navigate('/alertas')} style={{ height: '36px', padding: '0 14px', border: 'none', borderRadius: '10px', background: 'var(--hp-accent)', color: '#FFFFFF', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            Ver alertas
          </button>
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        <div style={cartao}>
          <div style={sobrelinha}>CICLO DA CULTURA</div>
          {diasPlantio == null ? (
            <div style={{ fontSize: '14px', color: 'var(--hp-text-2)', marginTop: '14px' }}>Sem data de plantio cadastrada. Use “Editar” para informar.</div>
          ) : (
            <>
              <div style={{ height: '8px', borderRadius: '4px', background: 'var(--hp-surface-2)', marginTop: '14px' }}>
                <div style={{ width: `${progresso ?? 0}%`, height: '8px', borderRadius: '4px', background: 'var(--hp-accent)' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: '10px', gap: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600' }}>
                  dia {diasPlantio}{ciclo ? (diasPlantio >= ciclo ? ` · ciclo de ${ciclo} dias` : ` de ${ciclo}`) : ' desde o plantio'}
                </span>
                {ciclo ? (
                  <span style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
                    {diasPlantio >= ciclo ? 'ciclo completo' : `faltam ~${ciclo - diasPlantio} dias`}
                  </span>
                ) : null}
              </div>
            </>
          )}
          <div style={{ fontSize: '14px', color: 'var(--hp-text-4)', marginTop: '6px' }}>
            {rec ? `Colheita estimada ${formatDate(rec.data_inicio)} – ${formatDate(rec.data_fim)} (${fmtNum(rec.grau_confianca, 0)} % de confiança)` : 'Ainda sem recomendação de colheita para este lote.'}
          </div>
        </div>

        <div style={cartao}>
          <div style={sobrelinha}>CONDIÇÕES AGORA</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
            {[
              { rotulo: 'Temperatura do ar', valor: lote.ultima_temperatura, unidade: '°C', min: cultura?.temperatura_min, max: cultura?.temperatura_max },
              { rotulo: 'Umidade do ar', valor: lote.ultima_umidade, unidade: '%', min: cultura?.umidade_min, max: cultura?.umidade_max },
            ].map((l) => (
              <div key={l.rotulo} style={{ display: 'grid', gridTemplateColumns: '1fr auto 84px', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '13px', color: 'var(--hp-text-4)' }}>{l.rotulo}</span>
                <span style={{ fontSize: '20px', fontWeight: '700', fontVariantNumeric: 'tabular-nums', textAlign: 'right' }}>
                  {l.valor != null ? `${fmtNum(l.valor)} ${l.unidade}` : '—'}
                </span>
                <span style={{ textAlign: 'right' }}><Faixa valor={l.valor} min={l.min} max={l.max} /></span>
              </div>
            ))}
            <div style={{ fontSize: '12px', color: 'var(--hp-text-2)' }}>
              {lote.ultima_leitura_em ? `Última leitura em ${formatDateTime(lote.ultima_leitura_em)}` : 'Nenhuma leitura recebida ainda.'}
              {cultura ? ` · faixa ${fmtNum(cultura.temperatura_min)}–${fmtNum(cultura.temperatura_max)} °C, ${fmtNum(cultura.umidade_min, 0)}–${fmtNum(cultura.umidade_max, 0)} %` : ''}
            </div>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="Dados do lote" style={{ display: 'flex', alignItems: 'center', gap: '24px', borderBottom: '1px solid var(--hp-border)' }}>
        {abaBtn('leituras', `Leituras (${lote.leituras?.length ?? 0})`)}
        {abaBtn('alertas', `Alertas (${lote.alertas_recentes?.length ?? 0})`)}
      </div>

      {aba === 'leituras' ? (
        <div role="tabpanel" style={cartao}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', Inter, sans-serif", fontSize: '16px', lineHeight: '22px', fontWeight: '600' }}>
            Últimas leituras do lote
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)' }}>
              <span style={{ width: '10px', height: '3px', background: 'var(--hp-temp)', borderRadius: '2px' }} /> Temperatura
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--hp-text-4)' }}>
              <span style={{ width: '10px', height: '3px', background: 'var(--hp-info)', borderRadius: '2px' }} /> Umidade do ar
            </span>
          </div>
          <GraficoLeituras lote={lote} cultura={cultura} />
          {(lote.leituras?.length ?? 0) > 0 ? (
            <div style={{ overflowX: 'auto', borderTop: '1px solid var(--hp-border)', marginTop: '12px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ height: '40px', color: 'var(--hp-text-2)', textAlign: 'left' }}>
                    <th style={{ padding: '0 8px', fontWeight: 600 }}>Data/hora</th>
                    <th style={{ padding: '0 8px', fontWeight: 600 }}>Sensor</th>
                    <th style={{ padding: '0 8px', fontWeight: 600, textAlign: 'right' }}>Temperatura</th>
                    <th style={{ padding: '0 8px', fontWeight: 600, textAlign: 'right' }}>Umidade</th>
                  </tr>
                </thead>
                <tbody>
                  {lote.leituras!.map((l) => (
                    <tr key={l.id} style={{ height: '40px', borderTop: '1px solid var(--hp-border)' }}>
                      <td style={{ padding: '0 8px' }}>{formatDateTime(l.data_hora)}</td>
                      <td style={{ padding: '0 8px', color: 'var(--hp-text-2)' }}>{l.sensor_codigo}</td>
                      <td style={{ padding: '0 8px', textAlign: 'right' }}>{fmtNum(l.temperatura)} °C</td>
                      <td style={{ padding: '0 8px', textAlign: 'right' }}>{fmtNum(l.umidade)} %</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      ) : (
        <div role="tabpanel" style={{ ...cartao, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {(lote.alertas_recentes?.length ?? 0) === 0 ? (
            <div style={{ fontSize: '13px', color: 'var(--hp-text-2)' }}>Nenhum alerta registrado para este lote.</div>
          ) : (
            lote.alertas_recentes!.map((a) => (
              <div key={a.id} style={{ border: '1px solid var(--hp-border)', borderLeft: `3px solid ${a.resolvido ? 'var(--hp-border)' : 'var(--hp-critico)'}`, borderRadius: '12px', padding: '12px 14px' }}>
                <div style={{ fontSize: '13px', lineHeight: '19px' }}>{a.mensagem}</div>
                <div style={{ fontSize: '12px', color: 'var(--hp-text-2)', marginTop: '4px' }}>
                  {formatDateTime(a.data_hora)} · {a.sensor_codigo} · {a.resolvido ? 'resolvido' : 'em aberto'}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
