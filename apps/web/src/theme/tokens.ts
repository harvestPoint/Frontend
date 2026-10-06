// apps/web/src/theme/tokens.ts — fonte única de estilo do HarvestPoint
// Valores do redesign v2, direção "1b Campo" (aprovada) — ver
// especificacao.md / APLICAR.md do pacote de redesign. temp-min e area
// são tokens novos desta rodada; radius/pad/gap/row controlam a "forma"
// (cantos mais abertos, mais respiro, linha de tabela mais alta).
export const theme = {
  colors: {
    light: {
      bg: '#F5F2EA', surface: '#FFFDF8', surface2: '#EFEBE0', elevated: '#FFFDF8',
      border: '#E3DDCF', text: '#221F18', text2: '#6A6455', text3: '#8A8474', text4: '#33352E',
      inputBorder: '#D8D1C0', iconDisabled: '#B5B7AC',
      accent: '#5C7F62', accentHover: '#4A6950', accentSoft: '#E6EEE3', accentSofter: '#F1F5F1',
      sucessoBorder: '#CFE0D2',
      critico: '#AE4638', criticoBg: '#F9E7E2',
      atencao: '#8C5A1E', atencaoBg: '#F8EEDC', atencaoBorder: '#EFDCC0',
      info: '#46789F', infoBg: '#E8F0F5',
      temp: '#B8612E', tempMin: '#5B8AA6', umidSolo: '#9C7B4F', precip: '#5B8AA6',
      accentBand: 'rgba(92,127,98,.14)', area: 'transparent',
      umidAr: '#46789F', faixaAspersor: 'rgba(70,120,159,.14)', scrim: 'rgba(34,31,24,.4)', onAccent: '#FFFFFF',
    },
    dark: {
      bg: '#13110D', surface: '#1B1914', surface2: '#1C1E17', elevated: '#20221A',
      border: '#2F2B22', text: '#EEEAE0', text2: '#9B9C8F', text3: '#7D7F73', text4: '#D9DAD0',
      inputBorder: '#33362B', iconDisabled: '#4A4C3F',
      accent: '#93B69A', accentHover: '#A9C9AE', accentSoft: '#1B2A1E', accentSofter: '#151C16',
      sucessoBorder: '#24382A',
      critico: '#E28A7B', criticoBg: '#2A1714',
      atencao: '#E0B074', atencaoBg: '#2A2013', atencaoBorder: '#3D2F1C',
      info: '#7FA8C9', infoBg: '#16222B',
      temp: '#E2895A', tempMin: '#7FB0C9', umidSolo: '#C9A876', precip: '#7FB0C9',
      accentBand: 'rgba(143,181,150,.12)', area: 'transparent',
      umidAr: '#7FA8C9', faixaAspersor: 'rgba(127,168,201,.16)', scrim: 'rgba(0,0,0,.55)', onAccent: '#13110D',
    },
  },
  font: {
    display: '"Plus Jakarta Sans", Inter, system-ui, sans-serif',
    sans: 'Inter, system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, monospace',
  },
  layout: {
    sidebar: '264px', topbar: '64px', content: '1440px',
  },
  shape: {
    radius: '18px', radiusSm: '12px', pad: '24px', gap: '16px', row: '52px',
  },
} as const;
export default theme;
