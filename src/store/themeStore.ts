import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from './mmkv';
import { Colors } from '../theme/colors';

type Mode = 'dark' | 'light';

export interface ThemeColors {
  bg: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  borderFaint: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
}

interface ThemeState {
  mode: Mode;
  setMode: (mode: Mode) => void;
  setTheme: (mode: Mode) => void;
  toggle: () => void;
  toggleTheme: () => void;
  isDark: () => boolean;
  colors: () => ThemeColors;
}

const darkColors: ThemeColors = {
  bg: Colors.dark.bg,
  surface: Colors.dark.surface,
  surface2: Colors.dark.surface2,
  surface3: Colors.dark.surface3,
  border: Colors.dark.border,
  borderFaint: Colors.dark.borderFaint,
  textPrimary: Colors.text.primary,
  textSecondary: Colors.text.secondary,
  textTertiary: Colors.text.tertiary,
};

const lightColors: ThemeColors = {
  bg: Colors.light.bg,
  surface: Colors.light.surface,
  surface2: Colors.light.surface2,
  surface3: Colors.light.surface3,
  border: Colors.light.border,
  borderFaint: Colors.light.borderFaint,
  textPrimary: Colors.text.primaryL,
  textSecondary: Colors.text.secondaryL,
  textTertiary: Colors.text.tertiary,
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      setMode: (mode: Mode) => set({ mode }),
      setTheme: (mode: Mode) => set({ mode }),
      toggle: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
      toggleTheme: () => set({ mode: get().mode === 'dark' ? 'light' : 'dark' }),
      isDark: () => get().mode === 'dark',
      colors: () => (get().mode === 'dark' ? darkColors : lightColors),
    }),
    {
      name: 'theme-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({ mode: state.mode }),
    },
  ),
);
