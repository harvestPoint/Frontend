// apps/web/src/theme/tokens.ts — fonte única de estilo do HarvestPoint
// Valores extraídos diretamente do export aprovado no Claude Design
// (HarvestPoint.dc.html) — não são mais uma proposta, são o que já está no ar.
export const theme = {
  colors: {
    light: {
      bg: '#F7F7F4', surface: '#FFFFFF', surface2: '#F1F1EC', elevated: '#FFFFFF',
      border: '#E7E5DE', text: '#1F211D', text2: '#6B6D63', text3: '#8B8D82', text4: '#33352E',
      inputBorder: '#D6D4CB', iconDisabled: '#B5B7AC',
      accent: '#6B8F71', accentHover: '#55735C', accentSoft: '#E7EFE7', accentSofter: '#F1F5F1',
      sucessoBorder: '#CFE0D2',
      critico: '#B14C40', criticoBg: '#FBEAE7',
      atencao: '#B07A34', atencaoBg: '#FBF1E4', atencaoBorder: '#EFDCC0',
      info: '#4C7EA8', infoBg: '#EAF1F7',
      temp: '#C2703C', umidSolo: '#9C7B4F', precip: '#5B8AA6',
      accentBand: 'rgba(107,143,113,.08)',
    },
    dark: {
      bg: '#0B0C0A', surface: '#131410', surface2: '#1C1E17', elevated: '#20221A',
      border: '#2A2C22', text: '#ECEBE4', text2: '#9B9C8F', text3: '#7D7F73', text4: '#D9DAD0',
      inputBorder: '#33362B', iconDisabled: '#4A4C3F',
      accent: '#8FB596', accentHover: '#A9C9AE', accentSoft: '#1B2A1E', accentSofter: '#151C16',
      sucessoBorder: '#24382A',
      critico: '#E2897D', criticoBg: '#2A1714',
      atencao: '#E0B074', atencaoBg: '#2A2013', atencaoBorder: '#3D2F1C',
      info: '#7FA8C9', infoBg: '#16222B',
      temp: '#E2895A', umidSolo: '#C9A876', precip: '#7FB0C9',
      accentBand: 'rgba(143,181,150,.12)',
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
} as const;
export default theme;
