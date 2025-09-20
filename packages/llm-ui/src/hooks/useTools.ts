import { useCallback, useEffect, useState } from 'react';
import { useToolStore } from '../store/toolStore';
import { Tool, ToolConfig, ToolExecutionResult } from '../types/tool';
import { ToolCall } from '../types/chat';
import { errorHandler } from '../utils/errorHandler';

export interface UseToolsOptions {
  config?: Partial<ToolConfig>;
  onToolExecute?: (toolName: string, params: any) => void;
  onToolComplete?: (toolName: string, result: any) => void;
  onToolError?: (toolName: string, error: string) => void;
  enabledTools?: string[];
  disabledTools?: string[];
}

export interface UseToolsReturn {
  tools: Tool[];
  executingCalls: Map<string, ToolCall>;
  executionHistory: ToolCall[];
  registerTool: (tool: Tool) => void;
  unregisterTool: (name: string) => void;
  executeTool: (name: string, params: any, context?: any) => Promise<ToolExecutionResult>;
  cancelExecution: (callId: string) => void;
  clearHistory: () => void;
  searchTools: (query: string) => Tool[];
  getToolsByCategory: (category: string) => Tool[];
  isToolEnabled: (toolName: string) => boolean;
  setConfig: (config: Partial<ToolConfig>) => void;
}

export const useTools = (options: UseToolsOptions = {}): UseToolsReturn => {
  const {
    config = {},
    onToolExecute,
    onToolComplete,
    onToolError,
    enabledTools,
    disabledTools,
  } = options;

  const store = useToolStore();
  const { tools, executingCalls, executionHistory, actions } = store;
  const [localConfig, setLocalConfig] = useState<Partial<ToolConfig>>({});

  // 合并配置
  const mergedConfig = {
    ...config,
    ...localConfig,
    allowedTools: enabledTools || config.allowedTools,
    blockedTools: disabledTools || config.blockedTools,
  };

  // 设置配置
  useEffect(() => {
    if (Object.keys(mergedConfig).length > 0) {
      actions.setConfig(mergedConfig);
    }
  }, [mergedConfig, actions]);

  // 注册工具
  const registerTool = useCallback((tool: Tool) => {
    actions.registerTool(tool);
  }, [actions]);

  // 注销工具
  const unregisterTool = useCallback((name: string) => {
    actions.unregisterTool(name);
  }, [actions]);

  // 执行工具
  const executeTool = useCallback(async (
    name: string,
    params: any,
    context?: any
  ): Promise<ToolExecutionResult> => {
    try {
      onToolExecute?.(name, params);

      const result = await actions.executeTool(name, params, context);

      if (result.success) {
        onToolComplete?.(name, result.result);
      } else {
        onToolError?.(name, result.error || 'Unknown error');
      }

      return result;
    } catch (error: any) {
      const errorDetails = errorHandler.handleError(error);
      onToolError?.(name, errorDetails.message);

      return {
        success: false,
        error: errorDetails.message,
        duration: 0,
      };
    }
  }, [actions, onToolExecute, onToolComplete, onToolError]);

  // 取消执行
  const cancelExecution = useCallback((callId: string) => {
    actions.cancelExecution(callId);
  }, [actions]);

  // 清空历史
  const clearHistory = useCallback(() => {
    actions.clearHistory();
  }, [actions]);

  // 搜索工具
  const searchTools = useCallback((query: string) => {
    return actions.searchTools(query);
  }, [actions]);

  // 按分类获取工具
  const getToolsByCategory = useCallback((category: string) => {
    return actions.getToolsByCategory(category);
  }, [actions]);

  // 检查工具是否启用
  const isToolEnabled = useCallback((toolName: string) => {
    const config = store.config;

    // 检查是否在阻止列表中
    if (config.blockedTools?.includes(toolName)) {
      return false;
    }

    // 检查是否在允许列表中（如果设置了允许列表）
    if (config.allowedTools && config.allowedTools.length > 0) {
      return config.allowedTools.includes(toolName);
    }

    return true;
  }, [store.config]);

  // 设置配置
  const setConfig = useCallback((newConfig: Partial<ToolConfig>) => {
    setLocalConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  // 获取可用工具
  const availableTools = actions.getAllTools();

  return {
    tools: availableTools,
    executingCalls,
    executionHistory,
    registerTool,
    unregisterTool,
    executeTool,
    cancelExecution,
    clearHistory,
    searchTools,
    getToolsByCategory,
    isToolEnabled,
    setConfig,
  };
};

// 简化版工具钩子
export const useSimpleTools = () => {
  return useTools({
    config: {
      enableLogging: true,
      enableMetrics: false,
    },
  });
};

// 工具执行钩子
export const useToolExecution = (toolName: string) => {
  const { executeTool, cancelExecution, executingCalls } = useTools();
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (params: any, context?: any) => {
    setIsExecuting(true);
    setError(null);
    setResult(null);

    try {
      const executionResult = await executeTool(toolName, params, context);

      if (executionResult.success) {
        setResult(executionResult.result);
      } else {
        setError(executionResult.error || 'Unknown error');
      }

      return executionResult;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsExecuting(false);
    }
  }, [toolName, executeTool]);

  const cancel = useCallback(() => {
    // 找到正在执行的调用
    const executingCall = Array.from(executingCalls.values())
      .find(call => call.name === toolName && call.status === 'executing');

    if (executingCall) {
      cancelExecution(executingCall.id);
      setIsExecuting(false);
    }
  }, [toolName, executingCalls, cancelExecution]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsExecuting(false);
  }, []);

  return {
    execute,
    cancel,
    reset,
    isExecuting,
    result,
    error,
  };
};