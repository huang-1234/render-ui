import { Theme } from '../types/theme';
import { baseTheme } from './base';

export const darkTheme: Theme = {
  ...baseTheme,
  name: 'dark',
  isDark: true,
  
  colors: {
    primary: '#1668dc',
    secondary: '#531dab',
    success: '#389e0d',
    warning: '#d48806',
    error: '#cf1322',
    info: '#0958d9',
    background: '#1f1f1f',
    surface: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#a6a6a6',
    border: '#404040',
    divider: '#333333',
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.65)',
  },
  
  cssVars: {
    '--lobe-agent-color-primary': '#1668dc',
    '--lobe-agent-color-secondary': '#531dab',
    '--lobe-agent-color-success': '#389e0d',
    '--lobe-agent-color-warning': '#d48806',
    '--lobe-agent-color-error': '#cf1322',
    '--lobe-agent-color-info': '#0958d9',
    '--lobe-agent-color-background': '#1f1f1f',
    '--lobe-agent-color-surface': '#2a2a2a',
    '--lobe-agent-color-text': '#ffffff',
    '--lobe-agent-color-textSecondary': '#a6a6a6',
    '--lobe-agent-color-border': '#404040',
    '--lobe-agent-color-divider': '#333333',
    '--lobe-agent-color-shadow': 'rgba(0, 0, 0, 0.3)',
    '--lobe-agent-color-overlay': 'rgba(0, 0, 0, 0.65)',
    
    '--lobe-agent-spacing-xs': '4px',
    '--lobe-agent-spacing-sm': '8px',
    '--lobe-agent-spacing-md': '16px',
    '--lobe-agent-spacing-lg': '24px',
    '--lobe-agent-spacing-xl': '32px',
    '--lobe-agent-spacing-xxl': '48px',
    
    '--lobe-agent-radius-none': '0',
    '--lobe-agent-radius-sm': '4px',
    '--lobe-agent-radius-md': '8px',
    '--lobe-agent-radius-lg': '12px',
    '--lobe-agent-radius-xl': '16px',
    '--lobe-agent-radius-full': '9999px',
  },
};