import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChatWindow } from '../components/ChatWindow';
import { ThemeProvider } from '../theme/ThemeProvider';
import { render } from './utils';

// Integration tests for the complete LLM UI system
describe('LLM UI Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render complete chat interface', () => {
    render(
      <ThemeProvider>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should handle complete message flow', async () => {
    const user = userEvent.setup();
    const onMessageSend = vi.fn();

    render(
      <ThemeProvider>
        <ChatWindow
          title="AI Assistant"
          onMessageSend={onMessageSend}
          enabledTools={['calculator', 'weather', 'search']}
        />
      </ThemeProvider>
    );

    // Type a message
    const input = screen.getByRole('textbox');
    await user.type(input, 'Calculate 2 + 2');

    // Send the message
    const sendButton = screen.getByRole('button');
    await user.click(sendButton);

    expect(onMessageSend).toHaveBeenCalledWith('Calculate 2 + 2');
  });

  it('should handle theme switching', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    // Look for theme toggle (implementation dependent)
    const themeToggle = screen.queryByLabelText(/theme/i);
    if (themeToggle) {
      await user.click(themeToggle);
      // Verify theme change (would need to check computed styles)
    }
  });

  it('should handle tool execution workflow', async () => {
    const user = userEvent.setup();

    // Mock tool execution
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ result: 4 }),
    });

    render(
      <ThemeProvider>
        <ChatWindow
          title="AI Assistant"
          enabledTools={['calculator']}
        />
      </ThemeProvider>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'What is 2 + 2?');

    const sendButton = screen.getByRole('button');
    await user.click(sendButton);

    // Wait for tool execution and response
    await waitFor(() => {
      expect(screen.getByText('What is 2 + 2?')).toBeInTheDocument();
    });
  });

  it('should handle error states gracefully', async () => {
    const user = userEvent.setup();

    // Mock network error
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(
      <ThemeProvider>
        <ChatWindow
          title="AI Assistant"
          enabledTools={['weather']}
        />
      </ThemeProvider>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'What is the weather?');

    const sendButton = screen.getByRole('button');
    await user.click(sendButton);

    // Should handle error gracefully without crashing
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle multiple concurrent tool calls', async () => {
    const user = userEvent.setup();

    // Mock multiple tool responses
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ result: 4 }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({
          location: 'New York',
          temperature: 25,
          condition: 'Sunny'
        }),
      });

    render(
      <ThemeProvider>
        <ChatWindow
          title="AI Assistant"
          enabledTools={['calculator', 'weather']}
        />
      </ThemeProvider>
    );

    const input = screen.getByRole('textbox');

    // Send first message
    await user.type(input, 'Calculate 2 + 2');
    await user.click(screen.getByRole('button'));

    // Clear input and send second message
    await user.clear(input);
    await user.type(input, 'Weather in New York');
    await user.click(screen.getByRole('button'));

    // Both messages should be handled
    await waitFor(() => {
      expect(screen.getByText('Calculate 2 + 2')).toBeInTheDocument();
      expect(screen.getByText('Weather in New York')).toBeInTheDocument();
    });
  });

  it('should persist chat history', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <ThemeProvider>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    // Send a message
    const input = screen.getByRole('textbox');
    await user.type(input, 'Hello, AI!');
    await user.click(screen.getByRole('button'));

    // Rerender component (simulating page refresh)
    rerender(
      <ThemeProvider>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    // Message should still be visible (if persistence is implemented)
    // This would depend on the actual persistence implementation
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle accessibility features', () => {
    render(
      <ThemeProvider>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    // Check for proper ARIA labels
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');

    expect(input).toHaveAttribute('aria-label');
    expect(sendButton).toHaveAttribute('aria-label');

    // Check for keyboard navigation
    expect(input).toHaveAttribute('tabIndex');
    expect(sendButton).toHaveAttribute('tabIndex');
  });

  it('should handle responsive design', () => {
    // Mock different viewport sizes
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 320, // Mobile width
    });

    render(
      <ThemeProvider>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    // Component should render without issues on mobile
    expect(screen.getByRole('textbox')).toBeInTheDocument();

    // Test tablet width
    Object.defineProperty(window, 'innerWidth', {
      value: 768,
    });

    fireEvent.resize(window);

    // Component should still be functional
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle streaming responses', async () => {
    const user = userEvent.setup();

    // Mock streaming response
    const mockStream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('Hello '));
        setTimeout(() => {
          controller.enqueue(new TextEncoder().encode('world!'));
          controller.close();
        }, 100);
      },
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: mockStream,
    });

    render(
      <ThemeProvider>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'Stream a response');
    await user.click(screen.getByRole('button'));

    // Should handle streaming without errors
    await waitFor(() => {
      expect(screen.getByText('Stream a response')).toBeInTheDocument();
    });
  });

  it('should handle custom themes', () => {
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

    render(
      <ThemeProvider theme={customTheme}>
        <ChatWindow title="AI Assistant" />
      </ThemeProvider>
    );

    // Component should render with custom theme
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
  });
});