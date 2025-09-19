import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChat } from '../useChat';
import { useChatStore } from '../../store/chatStore';
import { useToolStore } from '../../store/toolStore';
import { ErrorHandler } from '../../utils/errorHandler';

// Mock the stores
vi.mock('../../store/chatStore');
vi.mock('../../store/toolStore');
vi.mock('../../utils/errorHandler');

const mockUseChatStore = vi.mocked(useChatStore);
const mockUseToolStore = vi.mocked(useToolStore);
const mockErrorHandler = vi.mocked(ErrorHandler);

// Mock store state
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

describe('useChat', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseChatStore.mockReturnValue(mockChatState);
    mockUseToolStore.mockReturnValue(mockToolState);
  });

  it('should return chat state and actions', () => {
    const { result } = renderHook(() => useChat());

    expect(result.current.messages).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should send message', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(mockChatState.addMessage).toHaveBeenCalled();
  });

  it('should clear messages', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.clearMessages();
    });

    expect(mockChatState.clearMessages).toHaveBeenCalled();
  });

  it('should retry message', async () => {
    const mockMessage = { id: '1', content: 'test', role: 'user' as const, timestamp: Date.now() };
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.retryMessage(mockMessage);
    });

    expect(mockChatState.retryMessage).toHaveBeenCalledWith(mockMessage);
  });

  it('should handle stream response', async () => {
    const mockResponse = new Response('test response');
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.handleStreamResponse(mockResponse);
    });

    expect(mockChatState.processStreamResponse).toHaveBeenCalledWith(mockResponse);
  });

  it('should handle errors', () => {
    const mockError = new Error('Test error');
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.handleError(mockError);
    });

    expect(mockChatState.handleError).toHaveBeenCalledWith(mockError);
  });

  it('should get message by id', () => {
    const mockMessage = { id: '1', content: 'test', role: 'user' as const, timestamp: Date.now() };
    mockChatState.messages = [mockMessage];
    
    const { result } = renderHook(() => useChat());

    const message = result.current.getMessageById('1');
    expect(message).toEqual(mockMessage);
  });

  it('should return undefined for non-existent message', () => {
    const { result } = renderHook(() => useChat());

    const message = result.current.getMessageById('non-existent');
    expect(message).toBeUndefined();
  });

  it('should get messages by role', () => {
    const userMessage = { id: '1', content: 'user message', role: 'user' as const, timestamp: Date.now() };
    const assistantMessage = { id: '2', content: 'assistant message', role: 'assistant' as const, timestamp: Date.now() };
    mockChatState.messages = [userMessage, assistantMessage];
    
    const { result } = renderHook(() => useChat());

    const userMessages = result.current.getMessagesByRole('user');
    expect(userMessages).toEqual([userMessage]);
  });

  it('should get last message', () => {
    const message1 = { id: '1', content: 'first', role: 'user' as const, timestamp: Date.now() };
    const message2 = { id: '2', content: 'second', role: 'assistant' as const, timestamp: Date.now() + 1000 };
    mockChatState.messages = [message1, message2];
    
    const { result } = renderHook(() => useChat());

    const lastMessage = result.current.getLastMessage();
    expect(lastMessage).toEqual(message2);
  });

  it('should return undefined when no messages', () => {
    const { result } = renderHook(() => useChat());

    const lastMessage = result.current.getLastMessage();
    expect(lastMessage).toBeUndefined();
  });

  it('should get message count', () => {
    const message1 = { id: '1', content: 'first', role: 'user' as const, timestamp: Date.now() };
    const message2 = { id: '2', content: 'second', role: 'assistant' as const, timestamp: Date.now() };
    mockChatState.messages = [message1, message2];
    
    const { result } = renderHook(() => useChat());

    const count = result.current.getMessageCount();
    expect(count).toBe(2);
  });

  it('should check if chat is empty', () => {
    const { result } = renderHook(() => useChat());

    const isEmpty = result.current.isEmpty();
    expect(isEmpty).toBe(true);
  });

  it('should check if chat has messages', () => {
    const message = { id: '1', content: 'test', role: 'user' as const, timestamp: Date.now() };
    mockChatState.messages = [message];
    
    const { result } = renderHook(() => useChat());

    const isEmpty = result.current.isEmpty();
    expect(isEmpty).toBe(false);
  });

  it('should handle message update', async () => {
    const { result } = renderHook(() => useChat());

    await act(async () => {
      result.current.updateMessage('1', { content: 'updated' });
    });

    expect(mockChatState.updateMessage).toHaveBeenCalledWith('1', { content: 'updated' });
  });

  it('should handle message removal', () => {
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.removeMessage('1');
    });

    expect(mockChatState.removeMessage).toHaveBeenCalledWith('1');
  });

  it('should handle error with ErrorHandler', () => {
    const mockError = new Error('Test error');
    const { result } = renderHook(() => useChat());

    act(() => {
      result.current.handleError(mockError);
    });

    expect(mockChatState.handleError).toHaveBeenCalledWith(mockError);
  });

  it('should handle tool calls', async () => {
    const mockToolCall = {
      id: 'tool-call-1',
      toolId: 'test-tool',
      name: 'test-tool',
      arguments: { input: 'test' },
      status: 'pending' as const,
      timestamp: Date.now(),
    };
    
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.handleToolCall(mockToolCall);
    });

    expect(mockChatState.handleToolCall).toHaveBeenCalledWith(mockToolCall);
  });

  it('should process stream response with proper error handling', async () => {
    const mockResponse = new Response('{"error": "test error"}', { status: 400 });
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.handleStreamResponse(mockResponse);
    });

    expect(mockChatState.processStreamResponse).toHaveBeenCalledWith(mockResponse);
  });

  it('handles errors from store', () => {
    const onError = jest.fn();
    mockStore.error = { message: 'Store error' };

    renderHook(() => useChat({ onError }));

    expect(onError).toHaveBeenCalledWith(expect.any(Error));
  });
});