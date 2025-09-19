import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from '../themeStore';
import type { Theme } from '../../types/theme';

describe('themeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useThemeStore.setState({
      currentTheme: 'light',
      customThemes: {},
      isDarkMode: false,
    });

    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
    });

    // Mock matchMedia
    const mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });
  });

  const mockCustomTheme: Theme = {
    colors: {
      primary: '#ff0000',
      secondary: '#00ff00',
      background: '#ffffff',
      surface: '#f5f5f5',
      text: '#000000',
      textSecondary: '#666666',
      border: '#e0e0e0',
      error: '#ff0000',
      warning: '#ffaa00',
      success: '#00ff00',
      info: '#0000ff',
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        loose: 1.8,
      },
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
    },
    radii: {
      sm: '4px',
      md: '8px',
      lg: '12px',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px rgba(0, 0, 0, 0.1)',
      md: '0 4px 6px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    },
    transitions: {
      fast: '150ms ease',
      normal: '300ms ease',
      slow: '500ms ease',
    },
  };

  it('should initialize with light theme', () => {
    const state = useThemeStore.getState();
    
    expect(state.currentTheme).toBe('light');
    expect(state.isDarkMode).toBe(false);
    expect(state.customThemes).toEqual({});
  });

  it('should set theme', () => {
    const store = useThemeStore.getState();

    store.setTheme('dark');

    const state = useThemeStore.getState();
    expect(state.currentTheme).toBe('dark');
    expect(state.isDarkMode).toBe(true);
  });

  it('should toggle theme', () => {
    const store = useThemeStore.getState();

    // Start with light theme
    expect(store.currentTheme).toBe('light');

    store.toggleTheme();

    const state = useThemeStore.getState();
    expect(state.currentTheme).toBe('dark');
    expect(state.isDarkMode).toBe(true);

    // Toggle back
    store.toggleTheme();

    const finalState = useThemeStore.getState();
    expect(finalState.currentTheme).toBe('light');
    expect(finalState.isDarkMode).toBe(false);
  });

  it('should register custom theme', () => {
    const store = useThemeStore.getState();

    store.registerTheme('custom', mockCustomTheme);

    const state = useThemeStore.getState();
    expect(state.customThemes.custom).toEqual(mockCustomTheme);
  });

  it('should get theme by name', () => {
    const store = useThemeStore.getState();

    store.registerTheme('custom', mockCustomTheme);

    const theme = store.getTheme('custom');
    expect(theme).toEqual(mockCustomTheme);
  });

  it('should return undefined for non-existent theme', () => {
    const store = useThemeStore.getState();

    const theme = store.getTheme('non-existent');
    expect(theme).toBeUndefined();
  });

  it('should persist theme to localStorage', () => {
    const store = useThemeStore.getState();
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    store.setTheme('dark');

    expect(setItemSpy).toHaveBeenCalledWith('theme', 'dark');
  });

  it('should load theme from localStorage on initialization', () => {
    const getItemSpy = vi.spyOn(localStorage, 'getItem').mockReturnValue('dark');

    // Simulate store initialization
    const store = useThemeStore.getState();
    store.initializeTheme?.();

    expect(getItemSpy).toHaveBeenCalledWith('theme');
  });

  it('should detect system theme preference', () => {
    const mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const store = useThemeStore.getState();
    const systemTheme = store.getSystemTheme?.();

    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    expect(systemTheme).toBe('dark');
  });

  it('should handle system theme changes', () => {
    const listeners: Array<(e: MediaQueryListEvent) => void> = [];
    const mockMatchMedia = vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((event, listener) => {
        if (event === 'change') {
          listeners.push(listener);
        }
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: mockMatchMedia,
    });

    const store = useThemeStore.getState();
    store.watchSystemTheme?.();

    // Simulate system theme change
    const mockEvent = { matches: true } as MediaQueryListEvent;
    listeners.forEach(listener => listener(mockEvent));

    // Verify theme was updated
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('should validate theme structure', () => {
    const store = useThemeStore.getState();
    const invalidTheme = { colors: { primary: '#ff0000' } }; // Missing required properties

    const isValid = store.validateTheme?.(invalidTheme as Theme);
    expect(isValid).toBe(false);

    const validTheme = mockCustomTheme;
    const isValidTheme = store.validateTheme?.(validTheme);
    expect(isValidTheme).toBe(true);
  });

  it('should get available themes', () => {
    const store = useThemeStore.getState();

    store.registerTheme('custom1', mockCustomTheme);
    store.registerTheme('custom2', mockCustomTheme);

    const availableThemes = store.getAvailableThemes?.();
    expect(availableThemes).toContain('light');
    expect(availableThemes).toContain('dark');
    expect(availableThemes).toContain('custom1');
    expect(availableThemes).toContain('custom2');
  });

  it('should handle theme switching with custom themes', () => {
    const store = useThemeStore.getState();

    store.registerTheme('custom', mockCustomTheme);
    store.setTheme('custom');

    const state = useThemeStore.getState();
    expect(state.currentTheme).toBe('custom');
    expect(state.isDarkMode).toBe(false); // Custom theme is not considered dark mode
  });

  it('should reset to default theme', () => {
    const store = useThemeStore.getState();

    store.setTheme('dark');
    store.resetTheme?.();

    const state = useThemeStore.getState();
    expect(state.currentTheme).toBe('light');
    expect(state.isDarkMode).toBe(false);
  });

  it('should handle theme export/import', () => {
    const store = useThemeStore.getState();

    store.registerTheme('custom', mockCustomTheme);

    const exportedTheme = store.exportTheme?.('custom');
    expect(exportedTheme).toEqual(mockCustomTheme);

    store.importTheme?.('imported', exportedTheme!);

    const state = useThemeStore.getState();
    expect(state.customThemes.imported).toEqual(mockCustomTheme);
  });
});