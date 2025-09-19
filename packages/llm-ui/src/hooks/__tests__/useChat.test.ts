import { renderHook, act } from '@testing-library/react';
import { useChat } from '../useChat';

// Mock the chat store
const mockActions = {
  appendMessage: jest.fn(),
  updateMessage: jest.fn(),
  deleteMessage: jest.fn(),
  clearMessages: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  setConfig: jest.fn(),
  submitMessage: jest.fn(),
  regenerateResponse: jest.fn(),
  retryMessage: jest.fn(),
  stopGeneration: jest.fn(),
};

const mockStore = {
  messages: [],
  isLoading: false,
  error: null,
  activeToolCalls: new Map(),
  config: {},
  actions: mockActions,
};

jest.mock('../../store/chatStore', () => ({
  useChatStore: () => mockStore,
}));

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStore.messages = [];
    mockStore.isLoading = false;
    mockStore.error = null;
  });

  it('initializes with default values', () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('sets initial messages', () => {
    const initialMessages = [
      {
        id: '1',
        content: 'Hello',
        role: 'user' as const,
        timestamp: Date.now(),
      },
    ];

    renderHook(() => useChat({ initialMessages }));

    expect(mockActions.appendMessage).toHaveBeenCalledWith(initialMessages[0]);
  });

  it('sets config on initialization', () => {
    const config = {
      apiEndpoint: '/api/test',
      model: 'gpt-4',
    };

    renderHook(() => useChat({ config }));

    expect(mockActions.setConfig).toHaveBeenCalledWith(config);
  });

  it('sends message successfully', async () => {
    mockActions.submitMessage.mockResolvedValue(undefined);
    const onMessageSend = jest.fn();

    const { result } = renderHook(() => useChat({ onMessageSend }));

    await act(async () => {
      await result.current.sendMessage('Test message');
    });

    expect(onMessageSend).toHaveBeenCalledWith('Test message');
    expect(mockActions.submitMessage).toHaveBeenCalledWith('Test message');
  });

  it('handles send message error', async () => {
    const error = new Error('Send failed');
    mockActions.submitMessage.mockRejectedValue(error);
    const onError = jest.fn();

    const { result } = renderHook(() => useChat({ onError }));

    await act(async () => {
      await result.current.sendMessage('Test message');
    });

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });

  it('regenerates response', async () => {
    mockActions.regenerateResponse.mockResolvedValue(undefined);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.regenerateResponse('message-id');
    });

    expect(mockActions.regenerateResponse).toHaveBeenCalledWith('message-id');
  });

  it('retries message', async () => {
    mockActions.retryMessage.mockResolvedValue(undefined);

    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.retryMessage('message-id');
    });

    expect(mockActions.retryMessage).toHaveBeenCalledWith('message-id');
  });

  it('stops generation', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.stopGeneration();
    });

    expect(mockActions.stopGeneration).toHaveBeenCalled();
  });

  it('clears messages', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.clearMessages();
    });

    expect(mockActions.clearMessages).toHaveBeenCalled();
  });

  it('deletes message', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.deleteMessage('message-id');
    });

    expect(mockActions.deleteMessage).toHaveBeenCalledWith('message-id');
  });

  it('updates message', () => {
    const { result } = renderHook(() => useChat());
    const update = { content: 'Updated content' };

    act(() => {
      result.current.updateMessage('message-id', update);
    });

    expect(mockActions.updateMessage).toHaveBeenCalledWith('message-id', update);
  });

  it('sets config', () => {
    const { result } = renderHook(() => useChat());
    const config = { temperature: 0.8 };

    act(() => {
      result.current.setConfig(config);
    });

    expect(mockActions.setConfig).toHaveBeenCalledWith(config);
  });

  it('limits messages when maxMessages is set', () => {
    const messages = Array.from({ length: 15 }, (_, i) => ({
      id: `msg-${i}`,
      content: `Message ${i}`,
      role: 'user' as const,
      timestamp: Date.now(),
    }));

    mockStore.messages = messages;

    renderHook(() => useChat({ maxMessages: 10 }));

    // Should delete the first 5 messages
    expect(mockActions.deleteMessage).toHaveBeenCalledTimes(5);
    messages.slice(0, 5).forEach((msg) => {
      expect(mockActions.deleteMessage).toHaveBeenCalledWith(msg.id);
    });
  });

  it('calls onMessageReceive for new messages', () => {
    const onMessageReceive = jest.fn();
    const { rerender } = renderHook(() => useChat({ onMessageReceive }));

    // Add a new message
    const newMessage = {
      id: '1',
      content: 'New message',
      role: 'assistant' as const,
      timestamp: Date.now(),
    };

    mockStore.messages = [newMessage];
    rerender();

    expect(onMessageReceive).toHaveBeenCalledWith(newMessage);
  });

  it('handles errors from store', () => {
    const onError = jest.fn();
    mockStore.error = { message: 'Store error' };

    renderHook(() => useChat({ onError }));

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});