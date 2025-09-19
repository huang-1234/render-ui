import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ChatWindow } from '../index';
import { ThemeProvider } from '../../ThemeProvider';

// Mock the stores
jest.mock('../../../store/chatStore', () => ({
  useChatStore: () => ({
    messages: [],
    isLoading: false,
    error: null,
    activeToolCalls: new Map(),
    actions: {
      submitMessage: jest.fn(),
      stopGeneration: jest.fn(),
      regenerateResponse: jest.fn(),
      retryMessage: jest.fn(),
      clearMessages: jest.fn(),
      deleteMessage: jest.fn(),
    },
  }),
}));

jest.mock('../../../store/toolStore', () => ({
  useToolStore: () => ({
    actions: {
      getAllTools: () => [],
    },
  }),
}));

const renderChatWindow = (props = {}) => {
  return render(
    <ThemeProvider>
      <ChatWindow {...props} />
    </ThemeProvider>
  );
};

describe('ChatWindow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    renderChatWindow();
    
    expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    expect(screen.getByText('Start a conversation')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    renderChatWindow({ title: 'Custom Assistant' });
    
    expect(screen.getByText('Custom Assistant')).toBeInTheDocument();
  });

  it('hides header when showHeader is false', () => {
    renderChatWindow({ showHeader: false });
    
    expect(screen.queryByText('AI Assistant')).not.toBeInTheDocument();
  });

  it('calls onMessageSend when message is sent', async () => {
    const onMessageSend = jest.fn();
    renderChatWindow({ onMessageSend });
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button');
    
    await userEvent.type(input, 'Hello, world!');
    await userEvent.click(sendButton);
    
    expect(onMessageSend).toHaveBeenCalledWith('Hello, world!');
  });

  it('shows empty state when no messages', () => {
    renderChatWindow();
    
    expect(screen.getByText('Start a conversation')).toBeInTheDocument();
    expect(screen.getByText(/Send a message to begin chatting/)).toBeInTheDocument();
  });

  it('shows clear button when messages exist', () => {
    // Mock store with messages
    const mockStore = {
      messages: [
        {
          id: '1',
          content: 'Hello',
          role: 'user',
          timestamp: Date.now(),
        },
      ],
      isLoading: false,
      error: null,
      activeToolCalls: new Map(),
      actions: {
        submitMessage: jest.fn(),
        stopGeneration: jest.fn(),
        regenerateResponse: jest.fn(),
        retryMessage: jest.fn(),
        clearMessages: jest.fn(),
        deleteMessage: jest.fn(),
      },
    };

    jest.doMock('../../../store/chatStore', () => ({
      useChatStore: () => mockStore,
    }));

    renderChatWindow();
    
    const clearButton = screen.getByText('Clear');
    expect(clearButton).toBeInTheDocument();
    expect(clearButton).not.toBeDisabled();
  });

  it('disables input when error exists', () => {
    // Mock store with error
    const mockStore = {
      messages: [],
      isLoading: false,
      error: { message: 'Test error' },
      activeToolCalls: new Map(),
      actions: {
        submitMessage: jest.fn(),
        stopGeneration: jest.fn(),
        regenerateResponse: jest.fn(),
        retryMessage: jest.fn(),
        clearMessages: jest.fn(),
        deleteMessage: jest.fn(),
      },
    };

    jest.doMock('../../../store/chatStore', () => ({
      useChatStore: () => mockStore,
    }));

    renderChatWindow();
    
    const input = screen.getByPlaceholderText('Type your message...');
    expect(input).toBeDisabled();
  });

  it('shows stop button when loading', () => {
    // Mock store with loading state
    const mockStore = {
      messages: [],
      isLoading: true,
      error: null,
      activeToolCalls: new Map(),
      actions: {
        submitMessage: jest.fn(),
        stopGeneration: jest.fn(),
        regenerateResponse: jest.fn(),
        retryMessage: jest.fn(),
        clearMessages: jest.fn(),
        deleteMessage: jest.fn(),
      },
    };

    jest.doMock('../../../store/chatStore', () => ({
      useChatStore: () => mockStore,
    }));

    renderChatWindow();
    
    expect(screen.getByText('Stop')).toBeInTheDocument();
  });

  it('handles error callback', async () => {
    const onError = jest.fn();
    const mockSubmitMessage = jest.fn().mockRejectedValue(new Error('Test error'));
    
    const mockStore = {
      messages: [],
      isLoading: false,
      error: null,
      activeToolCalls: new Map(),
      actions: {
        submitMessage: mockSubmitMessage,
        stopGeneration: jest.fn(),
        regenerateResponse: jest.fn(),
        retryMessage: jest.fn(),
        clearMessages: jest.fn(),
        deleteMessage: jest.fn(),
      },
    };

    jest.doMock('../../../store/chatStore', () => ({
      useChatStore: () => mockStore,
    }));

    renderChatWindow({ onError });
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button');
    
    await userEvent.type(input, 'Test message');
    await userEvent.click(sendButton);
    
    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});