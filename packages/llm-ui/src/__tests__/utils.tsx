import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../theme/ThemeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };

// Mock data generators
export const createMockMessage = (overrides = {}) => ({
  id: 'test-message-1',
  content: 'Test message content',
  role: 'user' as const,
  timestamp: Date.now(),
  ...overrides,
});

export const createMockTool = (overrides = {}) => ({
  id: 'test-tool',
  name: 'Test Tool',
  description: 'A test tool for testing',
  category: 'utility' as const,
  execute: vi.fn().mockResolvedValue({ result: 'test result' }),
  ...overrides,
});

export const createMockToolCall = (overrides = {}) => ({
  id: 'test-tool-call-1',
  toolId: 'test-tool',
  name: 'test-tool',
  arguments: { input: 'test input' },
  status: 'pending' as const,
  timestamp: Date.now(),
  ...overrides,
});

// Test utilities
export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0));

export const mockFetch = (response: any, status = 200) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  });
};

export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
  };
};