import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { ChatMessage, ChatMessageError, ChatConfig, ChatState, ChatActions, ToolCall } from '../types/chat';
import { processStream } from '../utils/streamProcessor';
import { generateId } from '../utils/helpers';
import { getAvailableTools } from '../tools/registry';

interface ChatStore extends ChatState {
  actions: ChatActions;
}

const defaultConfig: ChatConfig = {
  apiEndpoint: '/api/chat',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 4000,
  enableTools: true,
  enableStreaming: true,
  retryAttempts: 3,
  retryDelay: 1000,
};

export const useChatStore = create<ChatStore>()(
  persist(
    immer((set, get) => ({
      messages: [],
      isLoading: false,
      activeToolCalls: new Map(),
      error: null,
      config: defaultConfig,
      abortController: undefined,

      actions: {
        appendMessage: (message: ChatMessage) => {
          set((state) => {
            state.messages.push(message);
          });
        },

        updateMessage: (id: string, update: Partial<ChatMessage>) => {
          set((state) => {
            const index = state.messages.findIndex(m => m.id === id);
            if (index !== -1) {
              Object.assign(state.messages[index], update);
            }
          });
        },

        deleteMessage: (id: string) => {
          set((state) => {
            state.messages = state.messages.filter(m => m.id !== id);
          });
        },

        clearMessages: () => {
          set((state) => {
            state.messages = [];
            state.error = null;
          });
        },

        setLoading: (isLoading: boolean) => {
          set((state) => {
            state.isLoading = isLoading;
          });
        },

        addToolCall: (toolCall: ToolCall) => {
          set((state) => {
            state.activeToolCalls.set(toolCall.id, toolCall);
          });
        },

        updateToolCall: (id: string, update: Partial<ToolCall>) => {
          set((state) => {
            const toolCall = state.activeToolCalls.get(id);
            if (toolCall) {
              Object.assign(toolCall, update);
            }
          });
        },

        removeToolCall: (toolCallId: string) => {
          set((state) => {
            state.activeToolCalls.delete(toolCallId);
          });
        },

        setError: (error: ChatMessageError | null) => {
          set((state) => {
            state.error = error;
          });
        },

        setConfig: (config: Partial<ChatConfig>) => {
          set((state) => {
            Object.assign(state.config, config);
          });
        },

        submitMessage: async (content: string) => {
          const { appendMessage, updateMessage, setLoading, setError } = get().actions;
          const { config } = get();

          // 清理旧错误
          setError(null);

          // 添加用户消息
          const userMessage: ChatMessage = {
            id: generateId(),
            content,
            role: 'user',
            timestamp: Date.now(),
          };
          appendMessage(userMessage);

          setLoading(true);

          // 添加助理消息占位符
          const assistantMessage: ChatMessage = {
            id: generateId(),
            content: '',
            role: 'assistant',
            timestamp: Date.now(),
            isStreaming: true,
          };
          appendMessage(assistantMessage);

          try {
            // 使用 AbortController 支持中止请求
            const controller = new AbortController();
            set((state) => {
              state.abortController = controller;
            });

            const response = await fetch(config.apiEndpoint!, {
              method: 'POST',
              body: JSON.stringify({
                messages: get().messages.slice(0, -1), // 排除占位符消息
                tools: config.enableTools ? getAvailableTools() : [],
                model: config.model,
                temperature: config.temperature,
                max_tokens: config.maxTokens,
                stream: config.enableStreaming,
              }),
              headers: { 'Content-Type': 'application/json' },
              signal: controller.signal,
            });

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }

            if (!response.body) {
              throw new Error('Response body is null');
            }

            // 处理流式响应
            await processStream(response.body, {
              onText: (text: string) => {
                updateMessage(assistantMessage.id, {
                  content: get().messages.find(m => m.id === assistantMessage.id)?.content + text || text
                });
              },
              onToolCall: (toolCall: ToolCall) => {
                // 处理工具调用
                const newToolCall: ToolCall = {
                  id: toolCall.id,
                  name: toolCall.name,
                  params:toolCall.params || toolCall.arguments || '{}',
                  status: 'pending',
                  startTime: Date.now(),
                };
                get().actions.addToolCall(newToolCall);
              },
              onComplete: () => {
                updateMessage(assistantMessage.id, { isStreaming: false });
              },
              onError: (error) => {
                setError({ message: error.message, messageId: assistantMessage.id });
                updateMessage(assistantMessage.id, { isStreaming: false, error: true });
              }
            });

          } catch (error: any) {
            if (error.name === 'AbortError') {
              // 用户中止，不报错
              updateMessage(assistantMessage.id, { isStreaming: false });
            } else {
              setError({
                message: error.message,
                messageId: assistantMessage.id,
                retryable: true
              });
              updateMessage(assistantMessage.id, {
                isStreaming: false,
                error: true
              });
            }
          } finally {
            setLoading(false);
          }
        },

        regenerateResponse: async (messageId: string) => {
          const message = get().messages.find(m => m.id === messageId);
          if (!message || message.role !== 'assistant') return;

          // 找到该消息之前的所有消息
          const messageIndex = get().messages.findIndex(m => m.id === messageId);
          const previousMessages = get().messages.slice(0, messageIndex);

          // 删除当前消息及之后的所有消息
          set((state) => {
            state.messages = previousMessages;
          });

          // 重新生成响应
          const lastUserMessage = previousMessages.filter(m => m.role === 'user').pop();
          if (lastUserMessage) {
            await get().actions.submitMessage(lastUserMessage.content);
          }
        },

        retryMessage: async (messageId: string) => {
          await get().actions.regenerateResponse(messageId);
        },

        stopGeneration: () => {
          get().abortController?.abort();
          set((state) => {
            state.isLoading = false;
            // 更新所有正在流式传输的消息
            state.messages.forEach(msg => {
              if (msg.isStreaming) {
                msg.isStreaming = false;
              }
            });
          });
        },

        handleStreamResponse: async (response: any) => {
          const { updateMessage, setError } = get().actions;

          try {
            if (!response.body) {
              throw new Error('Response body is null');
            }

            // 找到最后一个助理消息（应该是正在流式传输的消息）
            const lastAssistantMessage = get().messages
              .filter(m => m.role === 'assistant')
              .pop();

            if (!lastAssistantMessage) {
              throw new Error('No assistant message found to update');
            }

            // 处理流式响应
            await processStream(response.body, {
              onText: (text: string) => {
                updateMessage(lastAssistantMessage.id, {
                  content: get().messages.find(m => m.id === lastAssistantMessage.id)?.content + text || text
                });
              },
              onToolCall: (toolCall: ToolCall) => {
                // 处理工具调用
                const newToolCall: ToolCall = {
                  id: toolCall.id,
                  name: toolCall.name,
                  params: JSON.parse(toolCall.arguments || '{}'),
                  status: 'pending',
                  startTime: Date.now(),
                };
                get().actions.addToolCall(newToolCall);
              },
              onComplete: () => {
                updateMessage(lastAssistantMessage.id, { isStreaming: false });
              },
              onError: (error) => {
                setError({ message: error.message, messageId: lastAssistantMessage.id });
                updateMessage(lastAssistantMessage.id, { isStreaming: false, error: true });
              }
            });

          } catch (error: any) {
            setError({
              message: error.message,
              retryable: true
            });
          }
        },

        handleToolCall: async (toolCall: ToolCall) => {
          const { setLoading, setError, addToolCall, updateToolCall } = get().actions;

          try {
            setLoading(true);

            // 添加工具调用到状态
            const toolCallData: ToolCall = {
              id: toolCall.id || generateId(),
              name: toolCall.name!,
              params: toolCall.params || '',
              status: 'pending',
              startTime: Date.now()
            };

            addToolCall(toolCallData);

            // 获取可用工具
            const availableTools = getAvailableTools();
            const tool = availableTools.find(t => t.name === toolCall.name);

            if (!tool) {
              throw new Error(`Tool ${toolCall.name} not found`);
            }

            // 执行工具
            updateToolCall(toolCallData.id, { status: 'executing' });
            const result = await tool.execute(toolCallData.params);

            // 更新工具调用结果
            updateToolCall(toolCallData.id, {
              status: 'completed',
              result: result
            });

          } catch (error: any) {
            setError({
              message: `Tool execution failed: ${error.message}`,
              retryable: true
            });
          } finally {
            setLoading(false);
          }
        },
      }
    })),
    {
      name: 'lobe-agent-chat',
      partialize: (state) => ({
        messages: state.messages,
        config: state.config,
      }),
    }
  )
);