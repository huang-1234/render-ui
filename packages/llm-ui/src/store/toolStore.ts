import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Tool, ToolConfig, ToolExecutionResult } from '../types/tool';
import { ToolCall } from '../types/chat';

interface ToolState {
  tools: Tool[];
  toolCalls: ToolCall[];
  executingCalls: Map<string, ToolCall>;
  executionHistory: ToolCall[];
  config: ToolConfig;
}

interface ToolActions {
  registerTool: (tool: Tool) => void;
  unregisterTool: (name: string) => void;
  getTool: (name: string) => Tool | undefined;
  getAllTools: () => Tool[];
  getToolsByCategory: (category: string) => Tool[];
  searchTools: (query: string) => Tool[];
  executeTool: (name: string, params: any, context?: any) => Promise<ToolExecutionResult>;
  addToolCall: (toolCall: ToolCall) => void;
  getToolCall: (id: string) => ToolCall | undefined;
  updateToolCall: (id: string, updates: Partial<ToolCall>) => void;
  clearToolCalls: () => void;
  getPendingToolCalls?: () => ToolCall[];
  getCompletedToolCalls?: () => ToolCall[];
  validateToolArguments?: (toolId: string, args: any) => boolean;
  getExecutionMetrics?: () => any;
  cancelExecution: (callId: string) => void;
  clearHistory: () => void;
  setConfig: (config: Partial<ToolConfig>) => void;
}

interface ToolStore extends ToolState {
  actions: ToolActions;
}

const defaultConfig: ToolConfig = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  enableLogging: true,
  enableMetrics: true,
  allowedTools: [],
  blockedTools: [],
};

export const useToolStore = create<ToolStore>()(
  immer((set, get) => ({
    tools: new Map(),
    executingCalls: new Map(),
    executionHistory: [],
    config: defaultConfig,

    actions: {
      registerTool: (tool: Tool) => {
        set((state) => {
          state.tools.set(tool.name, tool);
        });
      },

      unregisterTool: (name: string) => {
        set((state) => {
          state.tools.delete(name);
        });
      },

      getTool: (name: string) => {
        return get().tools.get(name);
      },

      getAllTools: () => {
        const { config } = get();
        const allTools = Array.from(get().tools.values());
        
        return allTools.filter(tool => {
          // 检查是否在阻止列表中
          if (config.blockedTools && config.blockedTools.includes(tool.name)) {
            return false;
          }
          
          // 检查是否在允许列表中（如果设置了允许列表）
          if (config.allowedTools && config.allowedTools.length > 0) {
            return config.allowedTools.includes(tool.name);
          }
          
          return true;
        });
      },

      getToolsByCategory: (category: string) => {
        return get().actions.getAllTools().filter(tool => tool.category === category);
      },

      searchTools: (query: string) => {
        const searchTerm = query.toLowerCase();
        return get().actions.getAllTools().filter(tool => 
          tool.name.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
        );
      },

      executeTool: async (name: string, params: any, context?: any): Promise<ToolExecutionResult> => {
        const tool = get().actions.getTool(name);
        if (!tool) {
          throw new Error(`Tool "${name}" not found`);
        }

        const callId = `${name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const startTime = Date.now();

        const toolCall: ToolCall = {
          id: callId,
          toolName: name,
          params,
          status: 'executing',
          startTime,
        };

        set((state) => {
          state.executingCalls.set(callId, toolCall);
        });

        try {
          // 验证参数
          const validatedParams = tool.parameters.parse(params);

          // 创建超时控制
          const { config } = get();
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Tool execution timeout')), config.timeout);
          });

          // 执行工具
          const executionPromise = tool.execute(validatedParams, {
            ...context,
            abortSignal: context?.abortSignal,
          });

          const result = await Promise.race([executionPromise, timeoutPromise]);
          const endTime = Date.now();
          const duration = endTime - startTime;

          // 更新状态
          const completedCall: ToolCall = {
            ...toolCall,
            status: 'completed',
            result,
            endTime,
          };

          set((state) => {
            state.executingCalls.delete(callId);
            state.executionHistory.unshift(completedCall);
            
            // 限制历史记录数量
            if (state.executionHistory.length > 100) {
              state.executionHistory = state.executionHistory.slice(0, 100);
            }
          });

          return {
            success: true,
            result,
            duration,
            metadata: {
              toolName: name,
              callId,
              params: validatedParams,
            },
          };

        } catch (error: any) {
          const endTime = Date.now();
          const duration = endTime - startTime;

          // 更新状态
          const failedCall: ToolCall = {
            ...toolCall,
            status: 'failed',
            error: error.message,
            endTime,
          };

          set((state) => {
            state.executingCalls.delete(callId);
            state.executionHistory.unshift(failedCall);
          });

          return {
            success: false,
            error: error.message,
            duration,
            metadata: {
              toolName: name,
              callId,
              params,
            },
          };
        }
      },

      cancelExecution: (callId: string) => {
        set((state) => {
          const call = state.executingCalls.get(callId);
          if (call) {
            call.status = 'failed';
            call.error = 'Execution cancelled';
            call.endTime = Date.now();
            
            state.executingCalls.delete(callId);
            state.executionHistory.unshift(call);
          }
        });
      },

      clearHistory: () => {
        set((state) => {
          state.executionHistory = [];
        });
      },

      setConfig: (config: Partial<ToolConfig>) => {
        set((state) => {
          Object.assign(state.config, config);
        });
      },
    },
  }))
);