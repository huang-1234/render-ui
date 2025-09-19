import React, { createContext, useContext, useEffect } from 'react';
import { createGlobalStyle } from 'styled-components';
import { useThemeStore } from '../../store/themeStore';
import { Theme, ThemeContextValue } from '../../types/theme';

// 全局样式
const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  :root {
    ${({ theme }) => 
      Object.entries(theme.cssVars)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n    ')
    }
  }

  * {
    box-sizing: border-box;
  }

  .lobe-agent-chat-window {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.background};
    
    /* 滚动条样式 */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    ::-webkit-scrollbar-track {
      background: ${({ theme }) => theme.colors.surface};
      border-radius: ${({ theme }) => theme.radii.sm};
    }
    
    ::-webkit-scrollbar-thumb {
      background: ${({ theme }) => theme.colors.border};
      border-radius: ${({ theme }) => theme.radii.sm};
      
      &:hover {
        background: ${({ theme }) => theme.colors.textSecondary};
      }
    }
  }

  /* 动画类 */
  .lobe-agent-fade-in {
    animation: lobeAgentFadeIn ${({ theme }) => theme.transitions.duration.normal} ${({ theme }) => theme.transitions.easing.easeOut};
  }

  .lobe-agent-slide-up {
    animation: lobeAgentSlideUp ${({ theme }) => theme.transitions.duration.normal} ${({ theme }) => theme.transitions.easing.easeOut};
  }

  .lobe-agent-pulse {
    animation: lobeAgentPulse 2s infinite;
  }

  @keyframes lobeAgentFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes lobeAgentSlideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes lobeAgentPulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }

  /* 工具提示样式 */
  .lobe-agent-tooltip {
    position: relative;
    
    &::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: ${({ theme }) => theme.colors.overlay};
      color: white;
      padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
      border-radius: ${({ theme }) => theme.radii.sm};
      font-size: ${({ theme }) => theme.typography.fontSize.xs};
      white-space: nowrap;
      opacity: 0;
      pointer-events: none;
      transition: opacity ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeOut};
      z-index: ${({ theme }) => theme.zIndex.tooltip};
    }
    
    &:hover::after {
      opacity: 1;
    }
  }

  /* 按钮基础样式 */
  .lobe-agent-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: ${({ theme }) => theme.spacing.xs};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    border: none;
    border-radius: ${({ theme }) => theme.radii.md};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
    cursor: pointer;
    transition: all ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeOut};
    text-decoration: none;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &.primary {
      background: ${({ theme }) => theme.colors.primary};
      color: white;
      
      &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    }
    
    &.secondary {
      background: ${({ theme }) => theme.colors.surface};
      color: ${({ theme }) => theme.colors.text};
      border: 1px solid ${({ theme }) => theme.colors.border};
      
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.border};
      }
    }
    
    &.ghost {
      background: transparent;
      color: ${({ theme }) => theme.colors.textSecondary};
      
      &:hover:not(:disabled) {
        background: ${({ theme }) => theme.colors.surface};
        color: ${({ theme }) => theme.colors.text};
      }
    }
    
    &.danger {
      background: ${({ theme }) => theme.colors.error};
      color: white;
      
      &:hover:not(:disabled) {
        opacity: 0.9;
      }
    }
  }

  /* 输入框基础样式 */
  .lobe-agent-input {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    transition: border-color ${({ theme }) => theme.transitions.duration.fast} ${({ theme }) => theme.transitions.easing.easeOut};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
    
    &::placeholder {
      color: ${({ theme }) => theme.colors.textSecondary};
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
`;

// 主题上下文
const ThemeContext = createContext<ThemeContextValue | null>(null);

// 主题提供者组件
export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystemTheme?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme,
  enableSystemTheme = true,
}) => {
  const themeStore = useThemeStore();

  useEffect(() => {
    // 设置默认主题
    if (defaultTheme && themeStore.availableThemes[defaultTheme]) {
      themeStore.setTheme(defaultTheme);
    }

    // 监听系统主题变化
    if (enableSystemTheme && typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e: MediaQueryListEvent) => {
        const systemTheme = e.matches ? 'dark' : 'light';
        if (themeStore.availableThemes[systemTheme]) {
          themeStore.setTheme(systemTheme);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => {
        mediaQuery.removeEventListener('change', handleChange);
      };
    }
  }, [defaultTheme, enableSystemTheme, themeStore]);

  return (
    <ThemeContext.Provider value={themeStore}>
      <GlobalStyles theme={themeStore.currentTheme} />
      <div 
        style={themeStore.currentTheme.cssVars as React.CSSProperties}
        data-theme={themeStore.themeName}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// 主题钩子
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 主题切换器组件
export interface ThemeToggleProps {
  className?: string;
  style?: React.CSSProperties;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, style }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className={`lobe-agent-button ghost ${className || ''}`}
      style={style}
      onClick={toggleTheme}
      data-tooltip={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {isDark ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  );
};