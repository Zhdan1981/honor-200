export interface Theme {
  id: string;
  name: string;
  isDark: boolean;
  colors: {
    '--color-background': string; // r, g, b
    '--color-card': string; // r, g, b
    '--color-card-hover': string; // r, g, b
    '--color-text-primary': string; // r, g, b
    '--color-text-secondary': string; // r, g, b
    '--color-text-accent': string; // r, g, b
    '--color-border': string; // r, g, b
    '--color-input-bg': string; // r, g, b
    '--color-focus-ring': string; // r, g, b
    '--color-button-primary-bg': string; // r, g, b
    '--color-button-primary-text': string; // r, g, b
    '--color-nav-bg': string; // r, g, b
    '--color-nav-active': string; // r, g, b
    '--color-nav-inactive': string; // r, g, b
  };
}

// Helper to convert hex to "r, g, b"
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
};


export const themes: Theme[] = [
  // 5 Dark Themes
  {
    id: 'dark-graphite', name: 'Графит', isDark: true, colors: {
      '--color-background': hexToRgb('#111827'),
      '--color-card': hexToRgb('#1F2937'),
      '--color-card-hover': hexToRgb('#374151'),
      '--color-text-primary': hexToRgb('#F9FAFB'),
      '--color-text-secondary': hexToRgb('#9CA3AF'),
      '--color-text-accent': hexToRgb('#34D399'),
      '--color-border': hexToRgb('#374151'),
      '--color-input-bg': hexToRgb('#374151'),
      '--color-focus-ring': hexToRgb('#3B82F6'),
      '--color-button-primary-bg': hexToRgb('#3B82F6'),
      '--color-button-primary-text': hexToRgb('#FFFFFF'),
      '--color-nav-bg': hexToRgb('#000000'),
      '--color-nav-active': hexToRgb('#3B82F6'),
      '--color-nav-inactive': hexToRgb('#9CA3AF'),
    },
  },
  {
    id: 'dark-ocean', name: 'Океан', isDark: true, colors: {
      '--color-background': hexToRgb('#0a192f'),
      '--color-card': hexToRgb('#172a45'),
      '--color-card-hover': hexToRgb('#303C55'),
      '--color-text-primary': hexToRgb('#e6f1ff'),
      '--color-text-secondary': hexToRgb('#8892b0'),
      '--color-text-accent': hexToRgb('#64ffda'),
      '--color-border': hexToRgb('#303C55'),
      '--color-input-bg': hexToRgb('#303C55'),
      '--color-focus-ring': hexToRgb('#64ffda'),
      '--color-button-primary-bg': hexToRgb('#64ffda'),
      '--color-button-primary-text': hexToRgb('#0a192f'),
      '--color-nav-bg': hexToRgb('#081424'),
      '--color-nav-active': hexToRgb('#64ffda'),
      '--color-nav-inactive': hexToRgb('#8892b0'),
    },
  },
  {
    id: 'dark-violet', name: 'Фиалка', isDark: true, colors: {
      '--color-background': hexToRgb('#1E1B4B'),
      '--color-card': hexToRgb('#312E81'),
      '--color-card-hover': hexToRgb('#4338CA'),
      '--color-text-primary': hexToRgb('#EEF2FF'),
      '--color-text-secondary': hexToRgb('#A5B4FC'),
      '--color-text-accent': hexToRgb('#A78BFA'),
      '--color-border': hexToRgb('#4338CA'),
      '--color-input-bg': hexToRgb('#4338CA'),
      '--color-focus-ring': hexToRgb('#A78BFA'),
      '--color-button-primary-bg': hexToRgb('#A78BFA'),
      '--color-button-primary-text': hexToRgb('#1E1B4B'),
      '--color-nav-bg': hexToRgb('#17143a'),
      '--color-nav-active': hexToRgb('#A78BFA'),
      '--color-nav-inactive': hexToRgb('#A5B4FC'),
    },
  },
  {
    id: 'dark-forest', name: 'Лес', isDark: true, colors: {
      '--color-background': hexToRgb('#042f2e'),
      '--color-card': hexToRgb('#064e3b'),
      '--color-card-hover': hexToRgb('#057a55'),
      '--color-text-primary': hexToRgb('#d1fae5'),
      '--color-text-secondary': hexToRgb('#6ee7b7'),
      '--color-text-accent': hexToRgb('#34d399'),
      '--color-border': hexToRgb('#057a55'),
      '--color-input-bg': hexToRgb('#057a55'),
      '--color-focus-ring': hexToRgb('#34d399'),
      '--color-button-primary-bg': hexToRgb('#34d399'),
      '--color-button-primary-text': hexToRgb('#042f2e'),
      '--color-nav-bg': hexToRgb('#032221'),
      '--color-nav-active': hexToRgb('#34d399'),
      '--color-nav-inactive': hexToRgb('#6ee7b7'),
    },
  },
   {
    id: 'dark-rose', name: 'Роза', isDark: true, colors: {
      '--color-background': hexToRgb('#4a044e'),
      '--color-card': hexToRgb('#701a75'),
      '--color-card-hover': hexToRgb('#86198f'),
      '--color-text-primary': hexToRgb('#fdf2f8'),
      '--color-text-secondary': hexToRgb('#fbcfe8'),
      '--color-text-accent': hexToRgb('#f472b6'),
      '--color-border': hexToRgb('#86198f'),
      '--color-input-bg': hexToRgb('#86198f'),
      '--color-focus-ring': hexToRgb('#f472b6'),
      '--color-button-primary-bg': hexToRgb('#f472b6'),
      '--color-button-primary-text': hexToRgb('#4a044e'),
      '--color-nav-bg': hexToRgb('#3b033e'),
      '--color-nav-active': hexToRgb('#f472b6'),
      '--color-nav-inactive': hexToRgb('#fbcfe8'),
    },
  },

  // 5 Light Themes
  {
    id: 'light-day', name: 'День', isDark: false, colors: {
      '--color-background': hexToRgb('#F3F4F6'),
      '--color-card': hexToRgb('#FFFFFF'),
      '--color-card-hover': hexToRgb('#E5E7EB'),
      '--color-text-primary': hexToRgb('#111827'),
      '--color-text-secondary': hexToRgb('#6B7280'),
      '--color-text-accent': hexToRgb('#10B981'),
      '--color-border': hexToRgb('#D1D5DB'),
      '--color-input-bg': hexToRgb('#E5E7EB'),
      '--color-focus-ring': hexToRgb('#2563EB'),
      '--color-button-primary-bg': hexToRgb('#2563EB'),
      '--color-button-primary-text': hexToRgb('#FFFFFF'),
      '--color-nav-bg': hexToRgb('#FFFFFF'),
      '--color-nav-active': hexToRgb('#2563EB'),
      '--color-nav-inactive': hexToRgb('#6B7280'),
    },
  },
  {
    id: 'light-mint', name: 'Мята', isDark: false, colors: {
      '--color-background': hexToRgb('#f0fdfa'),
      '--color-card': hexToRgb('#ffffff'),
      '--color-card-hover': hexToRgb('#ccfbf1'),
      '--color-text-primary': hexToRgb('#0f766e'),
      '--color-text-secondary': hexToRgb('#14b8a6'),
      '--color-text-accent': hexToRgb('#0d9488'),
      '--color-border': hexToRgb('#99f6e4'),
      '--color-input-bg': hexToRgb('#ccfbf1'),
      '--color-focus-ring': hexToRgb('#14b8a6'),
      '--color-button-primary-bg': hexToRgb('#14b8a6'),
      '--color-button-primary-text': hexToRgb('#ffffff'),
      '--color-nav-bg': hexToRgb('#ffffff'),
      '--color-nav-active': hexToRgb('#0f766e'),
      '--color-nav-inactive': hexToRgb('#14b8a6'),
    },
  },
  {
    id: 'light-peach', name: 'Персик', isDark: false, colors: {
      '--color-background': hexToRgb('#fff7ed'),
      '--color-card': hexToRgb('#ffffff'),
      '--color-card-hover': hexToRgb('#ffedd5'),
      '--color-text-primary': hexToRgb('#9a3412'),
      '--color-text-secondary': hexToRgb('#fb923c'),
      '--color-text-accent': hexToRgb('#f97316'),
      '--color-border': hexToRgb('#fed7aa'),
      '--color-input-bg': hexToRgb('#ffedd5'),
      '--color-focus-ring': hexToRgb('#f97316'),
      '--color-button-primary-bg': hexToRgb('#f97316'),
      '--color-button-primary-text': hexToRgb('#ffffff'),
      '--color-nav-bg': hexToRgb('#ffffff'),
      '--color-nav-active': hexToRgb('#9a3412'),
      '--color-nav-inactive': hexToRgb('#fb923c'),
    },
  },
  {
    id: 'light-sky', name: 'Небо', isDark: false, colors: {
      '--color-background': hexToRgb('#f0f9ff'),
      '--color-card': hexToRgb('#ffffff'),
      '--color-card-hover': hexToRgb('#e0f2fe'),
      '--color-text-primary': hexToRgb('#0369a1'),
      '--color-text-secondary': hexToRgb('#38bdf8'),
      '--color-text-accent': hexToRgb('#0ea5e9'),
      '--color-border': hexToRgb('#bae6fd'),
      '--color-input-bg': hexToRgb('#e0f2fe'),
      '--color-focus-ring': hexToRgb('#0ea5e9'),
      '--color-button-primary-bg': hexToRgb('#0ea5e9'),
      '--color-button-primary-text': hexToRgb('#ffffff'),
      '--color-nav-bg': hexToRgb('#ffffff'),
      '--color-nav-active': hexToRgb('#0369a1'),
      '--color-nav-inactive': hexToRgb('#38bdf8'),
    },
  },
  {
    id: 'light-lavender', name: 'Лаванда', isDark: false, colors: {
      '--color-background': hexToRgb('#f5f3ff'),
      '--color-card': hexToRgb('#ffffff'),
      '--color-card-hover': hexToRgb('#ede9fe'),
      '--color-text-primary': hexToRgb('#6d28d9'),
      '--color-text-secondary': hexToRgb('#a78bfa'),
      '--color-text-accent': hexToRgb('#8b5cf6'),
      '--color-border': hexToRgb('#ddd6fe'),
      '--color-input-bg': hexToRgb('#ede9fe'),
      '--color-focus-ring': hexToRgb('#8b5cf6'),
      '--color-button-primary-bg': hexToRgb('#8b5cf6'),
      '--color-button-primary-text': hexToRgb('#ffffff'),
      '--color-nav-bg': hexToRgb('#ffffff'),
      '--color-nav-active': hexToRgb('#6d28d9'),
      '--color-nav-inactive': hexToRgb('#a78bfa'),
    },
  },
];