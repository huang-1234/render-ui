import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useChatStore } from '../chatStore';
import { processStream } from '../../utils/streamProcessor';
import { ErrorHandler } from '../../utils/errorHandler';
import type { ChatMessage, ToolCall } from '../../types/chat';

// Mock dependencies
vi.mock('../../utils/streamProcessor');
vi.mock('../../utils/errorHandler');

const mockProcessStream = vi.mocked(processStream);
const mockErrorHandler = vi.mocked(ErrorHandler);

describe('chatStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useChatStore.setState({
      messages: [],
      isLoading: false,
      error: null,
      activeToolCalls: new Map(),
      abortController: undefined,
    });
  });

  it('should initialize with empty state', () => {
    const state = useChatStore.getState();

    expect(state.messages).toEqual([]);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.activeToolCalls).toBeInstanceOf(Map);
  });

  it('should add a message', () => {
    const { actions } = useChatStore.getState();
    const message: ChatMessage = {
      id: 'test-1',
      content: 'Hello',
      role: 'user',
      timestamp: Date.now(),
    };

    actions.appendMessage(message);

    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(1);
    expect(state.messages[0]).toEqual(message);
  });

  it('should update a message', () => {
    const { actions } = useChatStore.getState();
    const message: ChatMessage = {
      id: 'test-1',
      content: 'Hello',
      role: 'user',
      timestamp: Date.now(),
    };

    actions.appendMessage(message);
    actions.updateMessage('test-1', { content: 'Updated Hello' });

    const state = useChatStore.getState();
    expect(state.messages[0].content).toBe('Updated Hello');
  });

  it('should remove a message', () => {
    const { actions } = useChatStore.getState();
    const message: ChatMessage = {
      id: 'test-1',
      content: 'Hello',
      role: 'user',
      timestamp: Date.now(),
    };

    actions.appendMessage(message);
    actions.deleteMessage('test-1');

    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(0);
  });

  it('should clear all messages', () => {
    const { actions } = useChatStore.getState();
    const message1: ChatMessage = {
      id: 'test-1',
      content: 'Hello',
      role: 'user',
      timestamp: Date.now(),
    };
    const message2: ChatMessage = {
      id: 'test-2',
      content: 'Hi there',
      role: 'assistant',
      timestamp: Date.now(),
    };

    actions.appendMessage(message1);
    actions.appendMessage(message2);
    actions.clearMessages();

    const state = useChatStore.getState();
    expect(state.messages).toHaveLength(0);
  });

  it('should set loading state', () => {
    const { actions } = useChatStore.getState();

    actions.setLoading(true);
    expect(useChatStore.getState().isLoading).toBe(true);

    actions.setLoading(false);
    expect(useChatStore.getState().isLoading).toBe(false);
  });

  it('should set error state', () => {
    const { actions } = useChatStore.getState();
    const error = { message: 'Test error', messageId: 'test-1' };

    actions.setError(error);
    expect(useChatStore.getState().error).toBe(error);

    actions.setError(null);
    expect(useChatStore.getState().error).toBeNull();
  });

  it('should retry a message', async () => {
    const { actions } = useChatStore.getState();
    const message: ChatMessage = {
      id: 'test-1',
      content: 'Hello',
      role: 'assistant',
      timestamp: Date.now(),
    };

    actions.appendMessage(message);

    // Mock the retry logic
    const retrySpy = vi.spyOn(actions, 'retryMessage');
    await actions.retryMessage('test-1');

    expect(retrySpy).toHaveBeenCalledWith('test-1');
  });

  it('should submit a message', async () => {
    const { actions } = useChatStore.getState();

    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: new ReadableStream(),
    });

    const submitSpy = vi.spyOn(actions, 'submitMessage');
    await actions.submitMessage('Hello');

    expect(submitSpy).toHaveBeenCalledWith('Hello');
  });

  it('should handle tool calls', () => {
    const { actions } = useChatStore.getState();
    const toolCall: ToolCall = {
      id: 'tool-call-1',
      name: 'test-tool',
      params: { input: 'test' },
      status: 'pending',
      startTime: Date.now(),
    };

    actions.addToolCall(toolCall);

    const state = useChatStore.getState();
    expect(state.activeToolCalls.get('tool-call-1')).toEqual(toolCall);
  });

  it('should stop generation', () => {
    const { actions } = useChatStore.getState();

    // Mock AbortController
    const mockAbort = vi.fn();
    useChatStore.setState({
      abortController: { abort: mockAbort } as any,
      isLoading: true,
    });

    actions.stopGeneration();

    expect(mockAbort).toHaveBeenCalled();
    expect(useChatStore.getState().isLoading).toBe(false);
  });

  it('should handle streaming text updates', () => {
    const { actions } = useChatStore.getState();
    const messageId = 'streaming-message';

    // Add initial message
    actions.appendMessage({
      id: messageId,
      content: '',
      role: 'assistant',
      timestamp: Date.now(),
    });

    // Simulate streaming updates
    actions.updateMessage(messageId, { content: 'Hello' });
    actions.updateMessage(messageId, { content: 'Hello world' });

    const state = useChatStore.getState();
    const message = state.messages.find(m => m.id === messageId);
    expect(message?.content).toBe('Hello world');
  });

  it('should handle message with tool calls', () => {
    const { actions } = useChatStore.getState();
    const toolCall: ToolCall = {
      id: 'tool-call-1',
      name: 'get_weather',
      params: { location: 'New York' },
      status: 'pending',
      startTime: Date.now(),
    };

    const message: ChatMessage = {
      id: 'test-1',
      content: 'Let me check the weather for you.',
      role: 'assistant',
      timestamp: Date.now(),
      toolCalls: [toolCall],
    };

    actions.appendMessage(message);

    const state = useChatStore.getState();
    expect(state.messages[0].toolCalls).toHaveLength(1);
    expect(state.messages[0].toolCalls?.[0]).toEqual(toolCall);
  });

  it('should update tool call status', () => {
    const { actions } = useChatStore.getState();
    const toolCall: ToolCall = {
      id: 'tool-call-1',
      name: 'get_weather',
      params: { location: 'New York' },
      status: 'pending',
      startTime: Date.now(),
    };

    actions.addToolCall(toolCall);

    // Update tool call status
    actions.updateToolCall('tool-call-1', {
      status: 'completed',
      result: 'Sunny, 25°C',
      endTime: Date.now()
    });

    const state = useChatStore.getState();
    const updatedToolCall = state.activeToolCalls.get('tool-call-1');
    expect(updatedToolCall?.status).toBe('completed');
    expect(updatedToolCall?.result).toBe('Sunny, 25°C');
  });

  it('should handle concurrent message updates', () => {
    const { actions } = useChatStore.getState();
    const messageId = 'concurrent-test';

    actions.appendMessage({
      id: messageId,
      content: 'Initial',
      role: 'assistant',
      timestamp: Date.now(),
    });

    // Simulate concurrent updates
    actions.updateMessage(messageId, { content: 'Update 1' });
    actions.updateMessage(messageId, { content: 'Update 2' });
    actions.updateMessage(messageId, { content: 'Final Update' });

    const state = useChatStore.getState();
    const message = state.messages.find(m => m.id === messageId);
    expect(message?.content).toBe('Final Update');
  });

  it('should set config', () => {
    const { actions } = useChatStore.getState();
    const newConfig = {
      model: 'gpt-3.5-turbo',
      temperature: 0.5,
    };

    actions.setConfig(newConfig);

    const state = useChatStore.getState();
    expect(state.config.model).toBe('gpt-3.5-turbo');
    expect(state.config.temperature).toBe(0.5);
  });

  it('should regenerate response', async () => {
    const { actions } = useChatStore.getState();

    // Add user message
    const userMessage: ChatMessage = {
      id: 'user-1',
      content: 'Hello',
      role: 'user',
      timestamp: Date.now(),
    };

    // Add assistant message
    const assistantMessage: ChatMessage = {
      id: 'assistant-1',
      content: 'Hi there!',
      role: 'assistant',
      timestamp: Date.now(),
    };

    actions.appendMessage(userMessage);
    actions.appendMessage(assistantMessage);

    // Mock fetch for regeneration
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      body: new ReadableStream(),
    });

    const regenerateSpy = vi.spyOn(actions, 'regenerateResponse');
    await actions.regenerateResponse('assistant-1');

    expect(regenerateSpy).toHaveBeenCalledWith('assistant-1');
  });
});