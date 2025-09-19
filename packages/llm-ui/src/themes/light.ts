import { Theme } from '../types/theme';
import { baseTheme } from './base';

export const lightTheme: Theme = {
  ...baseTheme,
  name: 'light',
  isDark: false,
  
  colors: {
    primary: '#1677ff',
    secondary: '#722ed1',
    success: '#52c41a',
    warning: '#faad14',
    error: '#ff4d4f',
    info: '#1890ff',
    background: '#ffffff',
    surface: '#fafafa',
    text: '#1f1f1f',
    textSecondary: '#666666',
    border: '#e5e5e5',
    divider: '#f0f0f0',
    shadow: 'rgba(0, 0, 0, 0.1)',
    overlay: 'rgba(0, 0, 0, 0.45)',
  },
  
  cssVars: {
    '--lobe-agent-color-primary': '#1677ff',
    '--lobe-agent-color-secondary': '#722ed1',
    '--lobe-agent-color-success': '#52c41a',
    '--lobe-agent-color-warning': '#faad14',
    '--lobe-agent-color-error': '#ff4d4f',
    '--lobe-agent-color-info': '#1890ff',
    '--lobe-agent-color-background': '#ffffff',
    '--lobe-agent-color-surface': '#fafafa',
    '--lobe-agent-color-text': '#1f1f1f',
    '--lobe-agent-color-textSecondary': '#666666',
    '--lobe-agent-color-border': '#e5e5e5',
    '--lobe-agent-color-divider': '#f0f0f0',
    '--lobe-agent-color-shadow': 'rgba(0, 0, 0, 0.1)',
    '--lobe-agent-color-overlay': 'rgba(0, 0, 0, 0.45)',
    
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