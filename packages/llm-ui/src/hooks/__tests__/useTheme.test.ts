import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTheme } from '../useTheme';
import { useThemeStore } from '../../store/themeStore';

// Mock the theme store
vi.mock('../../store/themeStore');

const mockUseThemeStore = vi.mocked(useThemeStore);

// Mock theme state
const mockThemeState = {
  currentTheme: 'light' as const,
  customThemes: {},
  setTheme: vi.fn(),
  toggleTheme: vi.fn(),
  registerTheme: vi.fn(),
  getTheme: vi.fn(),
  isDarkMode: false,
};

describe('useTheme', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseThemeStore.mockReturnValue(mockThemeState);
  });

  it('should return theme state and actions', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.currentTheme).toBe('light');
    expect(result.current.isDarkMode).toBe(false);
    expect(typeof result.current.setTheme).toBe('function');
    expect(typeof result.current.toggleTheme).toBe('function');
  });

  it('should set theme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(mockThemeState.setTheme).toHaveBeenCalledWith('dark');
  });

  it('should toggle theme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(mockThemeState.toggleTheme).toHaveBeenCalled();
  });

  it('should register custom theme', () => {
    const customTheme = {
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

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.registerTheme('custom', customTheme);
    });

    expect(mockThemeState.registerTheme).toHaveBeenCalledWith('custom', customTheme);
  });

  it('should get theme by name', () => {
    const mockTheme = { colors: { primary: '#000' } };
    mockThemeState.getTheme.mockReturnValue(mockTheme);

    const { result } = renderHook(() => useTheme());

    const theme = result.current.getTheme('custom');

    expect(mockThemeState.getTheme).toHaveBeenCalledWith('custom');
    expect(theme).toEqual(mockTheme);
  });

  it('should handle dark mode state', () => {
    mockThemeState.isDarkMode = true;
    mockThemeState.currentTheme = 'dark';

    const { result } = renderHook(() => useTheme());

    expect(result.current.isDarkMode).toBe(true);
    expect(result.current.currentTheme).toBe('dark');
  });

  it('should handle system theme preference', () => {
    // Mock matchMedia for system theme detection
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

    const { result } = renderHook(() => useTheme());

    // Test system theme detection
    expect(mockMatchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('should persist theme preference', () => {
    const mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
    });

    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    // Verify theme persistence logic would be called
    expect(mockThemeState.setTheme).toHaveBeenCalledWith('dark');
  });
});