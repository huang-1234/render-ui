import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Theme, ThemeContextValue } from '../types/theme';
import { lightTheme, darkTheme } from '../themes';

interface ThemeStore extends ThemeContextValue {}

const applyThemeVariables = (theme: Theme) => {
  const root = document.documentElement;
  Object.entries(theme.cssVars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

const detectSystemTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      currentTheme: lightTheme,
      themeName: 'light',
      availableThemes: {
        light: lightTheme,
        dark: darkTheme,
      },
      isDark: false,

      setTheme: (themeName: string) => {
        const theme = get().availableThemes[themeName];
        if (theme) {
          set({
            currentTheme: theme,
            themeName,
            isDark: theme.isDark || false,
          });
          applyThemeVariables(theme);
        }
      },

      registerTheme: (theme: Theme) => {
        set((state) => ({
          availableThemes: {
            ...state.availableThemes,
            [theme.name]: theme,
          }
        }));
      },

      unregisterTheme: (themeName: string) => {
        const { availableThemes, themeName: currentThemeName } = get();
        if (themeName === currentThemeName) {
          console.warn(`Cannot unregister currently active theme: ${themeName}`);
          return;
        }
        
        const newThemes = { ...availableThemes };
        delete newThemes[themeName];
        
        set({ availableThemes: newThemes });
      },

      toggleTheme: () => {
        const { themeName, availableThemes } = get();
        const newThemeName = themeName === 'light' ? 'dark' : 'light';
        
        if (availableThemes[newThemeName]) {
          get().setTheme(newThemeName);
        }
      },
    }),
    {
      name: 'lobe-agent-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // 应用主题变量到DOM
          applyThemeVariables(state.currentTheme);
          
          // 监听系统主题变化
          if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = (e: MediaQueryListEvent) => {
              const systemTheme = e.matches ? 'dark' : 'light';
              if (state.availableThemes[systemTheme]) {
                state.setTheme(systemTheme);
              }
            };
            
            mediaQuery.addEventListener('change', handleChange);
            
            // 清理函数
            return () => {
              mediaQuery.removeEventListener('change', handleChange);
            };
          }
        }
      },
    }
  )
);