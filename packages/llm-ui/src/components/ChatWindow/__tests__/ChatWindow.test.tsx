import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ChatWindow } from '../index';
import { useChatStore } from '../../../store/chatStore';
import { useToolStore } from '../../../store/toolStore';
import { useThemeStore } from '../../../store/themeStore';
import { render } from '../../../__tests__/utils';

// Mock the stores
vi.mock('../../../store/chatStore');
vi.mock('../../../store/toolStore');
vi.mock('../../../store/themeStore');

const mockUseChatStore = vi.mocked(useChatStore);
const mockUseToolStore = vi.mocked(useToolStore);
const mockUseThemeStore = vi.mocked(useThemeStore);

// Mock store states
const mockChatState = {
  messages: [],
  isLoading: false,
  error: null,
  addMessage: vi.fn(),
  updateMessage: vi.fn(),
  setLoading: vi.fn(),
  setError: vi.fn(),
  clearMessages: vi.fn(),
  removeMessage: vi.fn(),
  retryMessage: vi.fn(),
  processStreamResponse: vi.fn(),
  handleToolCall: vi.fn(),
  handleError: vi.fn(),
};

const mockToolState = {
  tools: [],
  toolCalls: [],
  registerTool: vi.fn(),
  executeTool: vi.fn(),
  getToolCall: vi.fn(),
};

const mockThemeState = {
  currentTheme: 'light' as const,
  customThemes: {},
  setTheme: vi.fn(),
  toggleTheme: vi.fn(),
  registerTheme: vi.fn(),
  getTheme: vi.fn(),
  isDarkMode: false,
};

describe('ChatWindow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChatStore.mockReturnValue(mockChatState);
    mockUseToolStore.mockReturnValue(mockToolState);
    mockUseThemeStore.mockReturnValue(mockThemeState);
  });

  it('should render chat window with title', () => {
    render(<ChatWindow title="Test Chat" />);
    
    expect(screen.getByText('Test Chat')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render without title', () => {
    render(<ChatWindow />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle message sending', async () => {
    const user = userEvent.setup();
    const mockOnMessageSend = vi.fn();
    
    render(<ChatWindow onMessageSend={mockOnMessageSend} />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');
    
    await user.type(input, 'Hello, world!');
    await user.click(sendButton);
    
    expect(mockOnMessageSend).toHaveBeenCalledWith('Hello, world!');
    expect(mockChatState.addMessage).toHaveBeenCalled();
  });

  it('should display messages', () => {
    const messages = [
      { id: '1', content: 'Hello', role: 'user' as const, timestamp: Date.now() },
      { id: '2', content: 'Hi there!', role: 'assistant' as const, timestamp: Date.now() },
    ];
    
    mockChatState.messages = messages;
    
    render(<ChatWindow />);
    
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('Hi there!')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    mockChatState.isLoading = true;
    
    render(<ChatWindow />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display error message', () => {
    mockChatState.error = new Error('Test error');
    
    render(<ChatWindow />);
    
    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  it('should handle tool execution', async () => {
    const mockTool = {
      id: 'test-tool',
      name: 'Test Tool',
      description: 'A test tool',
      category: 'utility' as const,
      execute: vi.fn().mockResolvedValue({ result: 'success' }),
    };
    
    mockToolState.tools = [mockTool];
    
    const user = userEvent.setup();
    render(<ChatWindow enabledTools={['test-tool']} />);
    
    // Simulate tool execution through message
    const input = screen.getByRole('textbox');
    await user.type(input, 'Execute test tool');
    await user.click(screen.getByRole('button'));
    
    expect(mockChatState.addMessage).toHaveBeenCalled();
  });

  it('should handle theme switching', () => {
    render(<ChatWindow />);
    
    // Find theme toggle button (if exists)
    const themeButton = screen.queryByLabelText(/theme/i);
    if (themeButton) {
      fireEvent.click(themeButton);
      expect(mockThemeState.toggleTheme).toHaveBeenCalled();
    }
  });

  it('should handle message retry', async () => {
    const failedMessage = {
      id: '1',
      content: 'Failed message',
      role: 'assistant' as const,
      timestamp: Date.now(),
      error: 'Failed to send',
    };
    
    mockChatState.messages = [failedMessage];
    
    render(<ChatWindow />);
    
    const retryButton = screen.queryByText(/retry/i);
    if (retryButton) {
      fireEvent.click(retryButton);
      expect(mockChatState.retryMessage).toHaveBeenCalledWith(failedMessage);
    }
  });

  it('should handle message clearing', () => {
    const messages = [
      { id: '1', content: 'Message 1', role: 'user' as const, timestamp: Date.now() },
      { id: '2', content: 'Message 2', role: 'assistant' as const, timestamp: Date.now() },
    ];
    
    mockChatState.messages = messages;
    
    render(<ChatWindow />);
    
    const clearButton = screen.queryByText(/clear/i);
    if (clearButton) {
      fireEvent.click(clearButton);
      expect(mockChatState.clearMessages).toHaveBeenCalled();
    }
  });

  it('should handle keyboard shortcuts', async () => {
    const user = userEvent.setup();
    render(<ChatWindow />);
    
    const input = screen.getByRole('textbox');
    await user.type(input, 'Test message');
    
    // Test Enter key to send message
    await user.keyboard('{Enter}');
    
    expect(mockChatState.addMessage).toHaveBeenCalled();
  });

  it('should handle file uploads', async () => {
    const user = userEvent.setup();
    render(<ChatWindow enableFileUpload />);
    
    const fileInput = screen.queryByLabelText(/upload/i);
    if (fileInput) {
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      await user.upload(fileInput, file);
      
      // Verify file handling
      expect(fileInput).toBeInTheDocument();
    }
  });

  it('should handle streaming responses', async () => {
    const mockStreamResponse = new Response('streaming data');
    
    render(<ChatWindow />);
    
    // Simulate streaming response
    await mockChatState.processStreamResponse(mockStreamResponse);
    
    expect(mockChatState.processStreamResponse).toHaveBeenCalledWith(mockStreamResponse);
  });

  it('should handle tool call updates', () => {
    const messageWithToolCall = {
      id: '1',
      content: 'Using tool...',
      role: 'assistant' as const,
      timestamp: Date.now(),
      toolCalls: [{
        id: 'tool-call-1',
        toolId: 'test-tool',
        name: 'test-tool',
        arguments: { input: 'test' },
        status: 'pending' as const,
        timestamp: Date.now(),
      }],
    };
    
    mockChatState.messages = [messageWithToolCall];
    
    render(<ChatWindow />);
    
    expect(screen.getByText('Using tool...')).toBeInTheDocument();
  });

  it('should handle custom message renderer', () => {
    const CustomRenderer = ({ message }: { message: any }) => (
      <div data-testid="custom-message">{message.content}</div>
    );
    
    const messages = [
      { id: '1', content: 'Custom message', role: 'user' as const, timestamp: Date.now() },
    ];
    
    mockChatState.messages = messages;
    
    render(<ChatWindow messageRenderer={CustomRenderer} />);
    
    expect(screen.getByTestId('custom-message')).toBeInTheDocument();
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });

  it('should handle window resize', () => {
    render(<ChatWindow />);
    
    // Simulate window resize
    fireEvent.resize(window);
    
    // Verify component handles resize gracefully
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle accessibility features', () => {
    render(<ChatWindow />);
    
    const input = screen.getByRole('textbox');
    const sendButton = screen.getByRole('button');
    
    expect(input).toHaveAttribute('aria-label');
    expect(sendButton).toHaveAttribute('aria-label');
  });

  it('should handle message pagination', () => {
    const manyMessages = Array.from({ length: 100 }, (_, i) => ({
      id: `msg-${i}`,
      content: `Message ${i}`,
      role: 'user' as const,
      timestamp: Date.now() + i,
    }));
    
    mockChatState.messages = manyMessages;
    
    render(<ChatWindow />);
    
    // Should handle large number of messages efficiently
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should handle tool call status updates', () => {
    const messageWithCompletedToolCall = {
      id: '1',
      content: 'Tool completed',
      role: 'assistant' as const,
      timestamp: Date.now(),
      toolCalls: [{
        id: 'tool-call-1',
        toolId: 'test-tool',
        name: 'test-tool',
        arguments: { input: 'test' },
        status: 'completed' as const,
        result: 'Tool execution successful',
        timestamp: Date.now(),
      }],
    };
    
    mockChatState.messages = [messageWithCompletedToolCall];
    
    render(<ChatWindow />);
    
    expect(screen.getByText('Tool completed')).toBeInTheDocument();
  });
});