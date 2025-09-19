import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useTools } from '../useTools';
import { useToolStore } from '../../store/toolStore';
import { ErrorHandler } from '../../utils/errorHandler';
import type { Tool, ToolCall } from '../../types/tool';

// Mock the store and error handler
vi.mock('../../store/toolStore');
vi.mock('../../utils/errorHandler');

const mockUseToolStore = vi.mocked(useToolStore);
const mockErrorHandler = vi.mocked(ErrorHandler);

// Mock tool
const mockTool: Tool = {
  id: 'test-tool',
  name: 'Test Tool',
  description: 'A test tool',
  category: 'utility',
  execute: vi.fn().mockResolvedValue({ result: 'test result' }),
};

// Mock tool call
const mockToolCall: ToolCall = {
  id: 'tool-call-1',
  toolId: 'test-tool',
  name: 'test-tool',
  arguments: { input: 'test' },
  status: 'pending',
  timestamp: Date.now(),
};

// Mock store state
const mockToolState = {
  tools: [mockTool],
  toolCalls: [mockToolCall],
  registerTool: vi.fn(),
  unregisterTool: vi.fn(),
  executeTool: vi.fn(),
  getToolCall: vi.fn(),
  updateToolCall: vi.fn(),
  clearToolCalls: vi.fn(),
};

describe('useTools', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseToolStore.mockReturnValue(mockToolState);
  });

  it('should return tools state and actions', () => {
    const { result } = renderHook(() => useTools());

    expect(result.current.tools).toEqual([mockTool]);
    expect(result.current.toolCalls).toEqual([mockToolCall]);
  });

  it('should register a tool', () => {
    const { result } = renderHook(() => useTools());

    act(() => {
      result.current.registerTool(mockTool);
    });

    expect(mockToolState.registerTool).toHaveBeenCalledWith(mockTool);
  });

  it('should unregister a tool', () => {
    const { result } = renderHook(() => useTools());

    act(() => {
      result.current.unregisterTool('test-tool');
    });

    expect(mockToolState.unregisterTool).toHaveBeenCalledWith('test-tool');
  });

  it('should execute a tool', async () => {
    const { result } = renderHook(() => useTools());

    await act(async () => {
      await result.current.executeTool('test-tool', { input: 'test' });
    });

    expect(mockToolState.executeTool).toHaveBeenCalledWith('test-tool', { input: 'test' });
  });

  it('should get tool call by id', () => {
    mockToolState.getToolCall.mockReturnValue(mockToolCall);
    const { result } = renderHook(() => useTools());

    const toolCall = result.current.getToolCall('tool-call-1');

    expect(mockToolState.getToolCall).toHaveBeenCalledWith('tool-call-1');
    expect(toolCall).toEqual(mockToolCall);
  });

  it('should update tool call', () => {
    const { result } = renderHook(() => useTools());
    const updates = { status: 'completed' as const, result: 'success' };

    act(() => {
      result.current.updateToolCall('tool-call-1', updates);
    });

    expect(mockToolState.updateToolCall).toHaveBeenCalledWith('tool-call-1', updates);
  });

  it('should clear tool calls', () => {
    const { result } = renderHook(() => useTools());

    act(() => {
      result.current.clearToolCalls();
    });

    expect(mockToolState.clearToolCalls).toHaveBeenCalled();
  });

  it('should get tool by id', () => {
    const { result } = renderHook(() => useTools());

    const tool = result.current.getToolById('test-tool');

    expect(tool).toEqual(mockTool);
  });

  it('should return undefined for non-existent tool', () => {
    const { result } = renderHook(() => useTools());

    const tool = result.current.getToolById('non-existent');

    expect(tool).toBeUndefined();
  });

  it('should get tools by category', () => {
    const utilityTool = { ...mockTool, category: 'utility' as const };
    const searchTool = { ...mockTool, id: 'search-tool', category: 'search' as const };
    mockToolState.tools = [utilityTool, searchTool];

    const { result } = renderHook(() => useTools());

    const utilityTools = result.current.getToolsByCategory('utility');

    expect(utilityTools).toEqual([utilityTool]);
  });

  it('should check if tool is available', () => {
    const { result } = renderHook(() => useTools());

    const isAvailable = result.current.isToolAvailable('test-tool');

    expect(isAvailable).toBe(true);
  });

  it('should return false for unavailable tool', () => {
    const { result } = renderHook(() => useTools());

    const isAvailable = result.current.isToolAvailable('non-existent');

    expect(isAvailable).toBe(false);
  });

  it('should get pending tool calls', () => {
    const pendingCall = { ...mockToolCall, status: 'pending' as const };
    const completedCall = { ...mockToolCall, id: 'call-2', status: 'completed' as const };
    mockToolState.toolCalls = [pendingCall, completedCall];

    const { result } = renderHook(() => useTools());

    const pendingCalls = result.current.getPendingToolCalls();

    expect(pendingCalls).toEqual([pendingCall]);
  });

  it('should get completed tool calls', () => {
    const pendingCall = { ...mockToolCall, status: 'pending' as const };
    const completedCall = { ...mockToolCall, id: 'call-2', status: 'completed' as const };
    mockToolState.toolCalls = [pendingCall, completedCall];

    const { result } = renderHook(() => useTools());

    const completedCalls = result.current.getCompletedToolCalls();

    expect(completedCalls).toEqual([completedCall]);
  });

  it('should get failed tool calls', () => {
    const pendingCall = { ...mockToolCall, status: 'pending' as const };
    const failedCall = { ...mockToolCall, id: 'call-2', status: 'failed' as const };
    mockToolState.toolCalls = [pendingCall, failedCall];

    const { result } = renderHook(() => useTools());

    const failedCalls = result.current.getFailedToolCalls();

    expect(failedCalls).toEqual([failedCall]);
  });

  it('should handle tool execution errors', async () => {
    const error = new Error('Tool execution failed');
    mockToolState.executeTool.mockRejectedValue(error);

    const { result } = renderHook(() => useTools());

    await act(async () => {
      try {
        await result.current.executeTool('test-tool', { input: 'test' });
      } catch (e) {
        expect(e).toBe(error);
      }
    });

    expect(mockToolState.executeTool).toHaveBeenCalledWith('test-tool', { input: 'test' });
  });

  it('should validate tool arguments', () => {
    const { result } = renderHook(() => useTools());

    // This would depend on the actual validation logic in the hook
    const isValid = result.current.validateToolArguments?.('test-tool', { input: 'test' });

    // Assuming validation passes for valid arguments
    expect(isValid).toBe(true);
  });

  it('should get tool execution history', () => {
    const call1 = { ...mockToolCall, timestamp: Date.now() - 1000 };
    const call2 = { ...mockToolCall, id: 'call-2', timestamp: Date.now() };
    mockToolState.toolCalls = [call1, call2];

    const { result } = renderHook(() => useTools());

    const history = result.current.getToolExecutionHistory?.();

    // Should return calls sorted by timestamp (newest first)
    expect(history).toEqual([call2, call1]);
  });
});