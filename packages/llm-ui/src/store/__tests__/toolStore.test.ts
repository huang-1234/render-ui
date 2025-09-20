import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useToolStore } from '../toolStore';
import type { Tool } from '../../types/tool';

import { ToolCall } from '@/types/chat';

describe('toolStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    useToolStore.setState({
      tools: [],
      toolCalls: [],
    });
  });

  const mockTool: Tool = {
    id: 'test-tool',
    name: 'Test Tool',
    description: 'A test tool for testing',
    category: 'utility',
    execute: vi.fn().mockResolvedValue({ result: 'test result' }),
  };

  const mockToolCall: ToolCall = {
    id: 'tool-call-1',
    toolId: 'test-tool',
    name: 'test-tool',
    arguments: { input: 'test' },
    status: 'pending',
    timestamp: Date.now(),
  };

  it('should initialize with empty state', () => {
    const state = useToolStore.getState();

    expect(state.tools).toEqual([]);
    expect(state.toolCalls).toEqual([]);
  });

  it('should register a tool', () => {
    const store = useToolStore.getState();

    store.registerTool(mockTool);

    const state = useToolStore.getState();
    expect(state.tools).toHaveLength(1);
    expect(state.tools[0]).toEqual(mockTool);
  });

  it('should not register duplicate tools', () => {
    const store = useToolStore.getState();

    store.registerTool(mockTool);
    store.registerTool(mockTool); // Try to register again

    const state = useToolStore.getState();
    expect(state.tools).toHaveLength(1);
  });

  it('should unregister a tool', () => {
    const store = useToolStore.getState();

    store.registerTool(mockTool);
    store.unregisterTool('test-tool');

    const state = useToolStore.getState();
    expect(state.tools).toHaveLength(0);
  });

  it('should execute a tool successfully', async () => {
    const store = useToolStore.getState();
    const mockExecute = vi.fn().mockResolvedValue({ result: 'success' });
    const tool = { ...mockTool, execute: mockExecute };

    store.registerTool(tool);

    const result = await store.executeTool('test-tool', { input: 'test' });

    expect(mockExecute).toHaveBeenCalledWith({ input: 'test' });
    expect(result).toEqual({ result: 'success' });
  });

  it('should handle tool execution failure', async () => {
    const store = useToolStore.getState();
    const error = new Error('Tool execution failed');
    const mockExecute = vi.fn().mockRejectedValue(error);
    const tool = { ...mockTool, execute: mockExecute };

    store.registerTool(tool);

    await expect(store.executeTool('test-tool', { input: 'test' })).rejects.toThrow(error);
  });

  it('should throw error when executing non-existent tool', async () => {
    const store = useToolStore.getState();

    await expect(store.executeTool('non-existent', {})).rejects.toThrow('Tool not found: non-existent');
  });

  it('should add tool call', () => {
    const store = useToolStore.getState();

    store.addToolCall(mockToolCall);

    const state = useToolStore.getState();
    expect(state.toolCalls).toHaveLength(1);
    expect(state.toolCalls[0]).toEqual(mockToolCall);
  });

  it('should get tool call by id', () => {
    const store = useToolStore.getState();

    store.addToolCall(mockToolCall);

    const toolCall = store.getToolCall('tool-call-1');
    expect(toolCall).toEqual(mockToolCall);
  });

  it('should return undefined for non-existent tool call', () => {
    const store = useToolStore.getState();

    const toolCall = store.getToolCall('non-existent');
    expect(toolCall).toBeUndefined();
  });

  it('should update tool call', () => {
    const store = useToolStore.getState();

    store.addToolCall(mockToolCall);
    store.updateToolCall('tool-call-1', {
      status: 'completed',
      result: 'success',
    });

    const state = useToolStore.getState();
    const updatedCall = state.toolCalls[0];
    expect(updatedCall.status).toBe('completed');
    expect(updatedCall.result).toBe('success');
  });

  it('should clear all tool calls', () => {
    const store = useToolStore.getState();

    store.addToolCall(mockToolCall);
    store.addToolCall({ ...mockToolCall, id: 'tool-call-2' });
    store.clearToolCalls();

    const state = useToolStore.getState();
    expect(state.toolCalls).toHaveLength(0);
  });

  it('should get tools by category', () => {
    const store = useToolStore.getState();
    const utilityTool = { ...mockTool, category: 'utility' as const };
    const searchTool = { ...mockTool, id: 'search-tool', category: 'search' as const };

    store.registerTool(utilityTool);
    store.registerTool(searchTool);

    const utilityTools = store.getToolsByCategory?.('utility') || [];
    expect(utilityTools).toHaveLength(1);
    expect(utilityTools[0].category).toBe('utility');
  });

  it('should get pending tool calls', () => {
    const store = useToolStore.getState();
    const pendingCall = { ...mockToolCall, status: 'pending' as const };
    const completedCall = { ...mockToolCall, id: 'call-2', status: 'completed' as const };

    store.addToolCall(pendingCall);
    store.addToolCall(completedCall);

    const pendingCalls = store.getPendingToolCalls?.() || [];
    expect(pendingCalls).toHaveLength(1);
    expect(pendingCalls[0].status).toBe('pending');
  });

  it('should get completed tool calls', () => {
    const store = useToolStore.getState();
    const pendingCall = { ...mockToolCall, status: 'pending' as const };
    const completedCall = { ...mockToolCall, id: 'call-2', status: 'completed' as const };

    store.addToolCall(pendingCall);
    store.addToolCall(completedCall);

    const completedCalls = store.getCompletedToolCalls?.() || [];
    expect(completedCalls).toHaveLength(1);
    expect(completedCalls[0].status).toBe('completed');
  });

  it('should handle tool call with error', () => {
    const store = useToolStore.getState();
    const errorCall = {
      ...mockToolCall,
      status: 'failed' as const,
      error: 'Execution failed',
    };

    store.addToolCall(errorCall);

    const state = useToolStore.getState();
    expect(state.toolCalls[0].status).toBe('failed');
    expect(state.toolCalls[0].error).toBe('Execution failed');
  });

  it('should validate tool arguments', () => {
    const store = useToolStore.getState();
    const toolWithSchema = {
      ...mockTool,
      schema: {
        type: 'object',
        properties: {
          input: { type: 'string' },
        },
        required: ['input'],
      },
    };

    store.registerTool(toolWithSchema);

    // This would depend on actual validation implementation
    const isValid = store.validateToolArguments?.('test-tool', { input: 'test' });
    expect(isValid).toBe(true);
  });

  it('should handle concurrent tool executions', async () => {
    const store = useToolStore.getState();
    const tool1 = { ...mockTool, id: 'tool-1', execute: vi.fn().mockResolvedValue({ result: 'result-1' }) };
    const tool2 = { ...mockTool, id: 'tool-2', execute: vi.fn().mockResolvedValue({ result: 'result-2' }) };

    store.registerTool(tool1);
    store.registerTool(tool2);

    const [result1, result2] = await Promise.all([
      store.executeTool('tool-1', { input: 'test1' }),
      store.executeTool('tool-2', { input: 'test2' }),
    ]);

    expect(result1).toEqual({ result: 'result-1' });
    expect(result2).toEqual({ result: 'result-2' });
  });

  it('should track tool execution metrics', () => {
    const store = useToolStore.getState();
    const call1 = { ...mockToolCall, timestamp: Date.now() - 1000 };
    const call2 = { ...mockToolCall, id: 'call-2', timestamp: Date.now() };

    store.addToolCall(call1);
    store.addToolCall(call2);

    const metrics = store.getExecutionMetrics?.() || {};
    expect(metrics.totalExecutions).toBe(2);
  });
});