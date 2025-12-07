
export const EBBINGHAUS_INTERVALS = [1, 2, 4, 7, 15, 30]; // Days

// Define palettes: 
// dark: The deep background color (replaces white areas)
// appBg: Even deeper background (replaces body bg)
// light: The bright accent color (replaces original colored areas)
// border: The border color (usually the accent in dark mode for high contrast)
// text: Text color on dark backgrounds
export const PALETTES: Record<string, { dark: string; appBg: string; light: string; border: string; text: string }> = {
  amber: { 
    appBg: '#2a1b00', 
    dark: '#451a03', 
    light: '#d97706', // Amber-600
    border: '#d97706', 
    text: '#fffbeb' 
  },
  lime: { 
    appBg: '#101f00', 
    dark: '#1a2e05', 
    light: '#65a30d', // Lime-600
    border: '#65a30d',
    text: '#f7fee7' 
  },
  pink: { 
    appBg: '#2b0515', 
    dark: '#500724', 
    light: '#db2777', // Pink-600
    border: '#db2777',
    text: '#fdf2f8' 
  },
  sky: { 
    appBg: '#021826', 
    dark: '#0c4a6e', 
    light: '#0284c7', // Sky-600
    border: '#0284c7',
    text: '#f0f9ff' 
  },
  violet: { 
    appBg: '#15052e', 
    dark: '#2e1065', 
    light: '#7c3aed', // Violet-600
    border: '#7c3aed',
    text: '#f5f3ff' 
  },
  orange: { 
    appBg: '#2b0e02', 
    dark: '#431407', 
    light: '#ea580c', // Orange-600
    border: '#ea580c',
    text: '#fff7ed' 
  },
  teal: { 
    appBg: '#011f1e', 
    dark: '#042f2e', 
    light: '#0d9488', // Teal-600
    border: '#0d9488',
    text: '#f0fdfa' 
  },
  rose: { 
    appBg: '#2b030d', 
    dark: '#4c0519', 
    light: '#e11d48', // Rose-600
    border: '#e11d48',
    text: '#fff1f2' 
  },
};

// These are used for the ThemeSwitcher PREVIEW buttons to show actual colors
export const PREVIEW_COLORS: Record<string, string> = {
  amber: 'bg-[#d97706]',
  lime: 'bg-[#65a30d]',
  pink: 'bg-[#db2777]',
  sky: 'bg-[#0284c7]',
  violet: 'bg-[#7c3aed]',
  orange: 'bg-[#ea580c]',
  teal: 'bg-[#0d9488]',
  rose: 'bg-[#e11d48]',
};

// Map old keys to the generic variable class for the app components
export const THEME_COLORS: Record<string, string> = {
  amber: 'bg-nb-theme',
  lime: 'bg-nb-theme',
  pink: 'bg-nb-theme',
  sky: 'bg-nb-theme',
  violet: 'bg-nb-theme',
  orange: 'bg-nb-theme',
  teal: 'bg-nb-theme',
  rose: 'bg-nb-theme',
};

export const ICONS = {
  vocab: 'book',
  algo: 'code',
  custom: 'star',
  heart: 'heart',
  coffee: 'coffee',
  gym: 'activity',
};
