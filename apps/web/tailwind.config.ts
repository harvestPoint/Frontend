// ============================================================================
// Tailwind Config — a maior parte das telas migradas usa var(--hp-*) via
// style inline (fiel ao design aprovado no Claude Design). Esta config fica
// mínima e não quebra caso alguma tela nova prefira usar classes Tailwind.
// ============================================================================
import type { Config } from 'tailwindcss';
import { theme } from './src/theme/tokens';

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          accent: theme.colors.light.accent,
          'accent-hover': theme.colors.light.accentHover,
          'accent-soft': theme.colors.light.accentSoft,
        },
      },
      fontFamily: {
        display: theme.font.display.split(',').map((f) => f.trim()),
        sans: theme.font.sans.split(',').map((f) => f.trim()),
        mono: theme.font.mono.split(',').map((f) => f.trim()),
      },
    },
  },
  plugins: [],
};

export default config;
