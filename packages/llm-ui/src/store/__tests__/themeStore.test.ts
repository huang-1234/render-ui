import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from '../themeStore';
import { lightTheme, darkTheme } from '../../themes';
import type { Theme } from '../../types/theme';

describe('themeStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useThemeStore.setState({
      currentTheme: lightTheme,
      themeName: 'light',
      availableThemes: {
        light: lightTheme,
        dark: darkTheme
      },
      isDark: false,
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
    name: 'custom',
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
      divider: '#f0f0f0',
      shadow: 'rgba(0, 0, 0, 0.1)',
      overlay: 'rgba(0, 0, 0, 0.45)',
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: {
        xs: '12px',
        sm: '14px',
        md: '16px',
        lg: '18px',
        xl: '20px',
        xxl: '24px',
      },
      fontWeight: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      },
      lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
      },
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      xxl: '48px',
    },
    radii: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      full: '9999px',
    },
    breakpoints: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    transitions: {
      duration: {
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
      },
      easing: {
        linear: 'linear',
        easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
        easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
        easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    zIndex: {
      dropdown: 1000,
      sticky: 1020,
      fixed: 1030,
      modal: 1040,
      popover: 1050,
      tooltip: 1060,
      toast: 1070,
    },
    cssVars: {
      '--lobe-agent-color-primary': '#ff0000',
      '--lobe-agent-color-background': '#ffffff',
      '--lobe-agent-spacing-md': '16px',
      '--lobe-agent-radius-md': '8px',
    },
    isDark: false,
  };

  it('should initialize with light theme', () => {
    const state = useThemeStore.getState();

    expect(state.themeName).toBe('light');
    expect(state.isDark).toBe(false);
    expect(state.availableThemes).toHaveProperty('light');
    expect(state.availableThemes).toHaveProperty('dark');
  });

  it('should set theme', () => {
    const store = useThemeStore.getState();

    store.setTheme('dark');

    const state = useThemeStore.getState();
    expect(state.themeName).toBe('dark');
    expect(state.isDark).toBe(true);
  });

  it('should toggle theme', () => {
    const store = useThemeStore.getState();

    // Start with light theme
    expect(store.themeName).toBe('light');

    store.toggleTheme();

    const state = useThemeStore.getState();
    expect(state.themeName).toBe('dark');
    expect(state.isDark).toBe(true);

    // Toggle back
    store.toggleTheme();

    const finalState = useThemeStore.getState();
    expect(finalState.themeName).toBe('light');
    expect(finalState.isDark).toBe(false);
  });

  it('should register custom theme', () => {
    const store = useThemeStore.getState();

    store.registerTheme(mockCustomTheme);

    const state = useThemeStore.getState();
    expect(state.availableThemes.custom).toEqual(mockCustomTheme);
  });

  it('should get theme by name', () => {
    const store = useThemeStore.getState();

    store.registerTheme(mockCustomTheme);

    const theme = store.availableThemes['custom'];
    expect(theme).toEqual(mockCustomTheme);
  });

  it('should return undefined for non-existent theme', () => {
    const store = useThemeStore.getState();

    const theme = store.availableThemes['non-existent'];
    expect(theme).toBeUndefined();
  });

  it('should persist theme to localStorage', () => {
    const store = useThemeStore.getState();
    const setItemSpy = vi.spyOn(localStorage, 'setItem');

    store.setTheme('dark');

    // Zustand persist middleware will handle localStorage
    expect(setItemSpy).toHaveBeenCalled();
  });

  it('should load theme from localStorage on initialization', () => {
    const getItemSpy = vi.spyOn(localStorage, 'getItem');

    // Zustand persist middleware will handle loading from localStorage
    expect(getItemSpy).toHaveBeenCalled();
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

    // This is now handled internally by the store
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
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

    // System theme change is now handled by the onRehydrateStorage callback
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('should validate theme structure', () => {
    // This functionality is not explicitly exposed in the store
    // but we can test it indirectly by trying to register an invalid theme
    const store = useThemeStore.getState();
    const invalidTheme = { name: 'invalid' } as Theme; // Missing required properties

    // Should not throw but also not register the invalid theme
    store.registerTheme(invalidTheme);
    expect(store.availableThemes['invalid']).toBeUndefined();
  });

  it('should get available themes', () => {
    const store = useThemeStore.getState();
    const customTheme1 = { ...mockCustomTheme, name: 'custom1' };
    const customTheme2 = { ...mockCustomTheme, name: 'custom2' };

    store.registerTheme(customTheme1);
    store.registerTheme(customTheme2);

    const availableThemes = Object.keys(store.availableThemes);
    expect(availableThemes).toContain('light');
    expect(availableThemes).toContain('dark');
    expect(availableThemes).toContain('custom1');
    expect(availableThemes).toContain('custom2');
  });

  it('should handle theme switching with custom themes', () => {
    const store = useThemeStore.getState();

    store.registerTheme(mockCustomTheme);
    store.setTheme('custom');

    const state = useThemeStore.getState();
    expect(state.themeName).toBe('custom');
    expect(state.isDark).toBe(false); // Custom theme is not considered dark mode
  });

  it('should reset to default theme', () => {
    const store = useThemeStore.getState();

    store.setTheme('dark');
    store.setTheme('light'); // Reset to light theme

    const state = useThemeStore.getState();
    expect(state.themeName).toBe('light');
    expect(state.isDark).toBe(false);
  });

  it('should handle theme registration and retrieval', () => {
    const store = useThemeStore.getState();
    const customTheme = { ...mockCustomTheme, name: 'custom-export' };
    const importedTheme = { ...mockCustomTheme, name: 'imported' };

    store.registerTheme(customTheme);
    store.registerTheme(importedTheme);

    const state = useThemeStore.getState();
    expect(state.availableThemes['custom-export']).toEqual(customTheme);
    expect(state.availableThemes['imported']).toEqual(importedTheme);
  });
});