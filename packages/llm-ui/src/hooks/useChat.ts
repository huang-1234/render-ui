import { useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '../store/chatStore';
import { ChatMessage, ChatConfig } from '../types/chat';
import { errorHandler } from '../utils/errorHandler';

export interface UseChatOptions {
  initialMessages?: ChatMessage[];
  config?: Partial<ChatConfig>;
  onMessageSend?: (message: string) => void;
  onMessageReceive?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
  onToolCall?: (toolName: string, params: any) => void;
  maxMessages?: number;
  autoScroll?: boolean;
}

export interface UseChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: any;
  sendMessage: (content: string) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
  retryMessage: (messageId: string) => Promise<void>;
  stopGeneration: () => void;
  clearMessages: () => void;
  deleteMessage: (messageId: string) => void;
  updateMessage: (messageId: string, update: Partial<ChatMessage>) => void;
  setConfig: (config: Partial<ChatConfig>) => void;
  handleStreamResponse: (response: any) => Promise<void>;
  handleToolCall: (toolCall: any) => Promise<void>;
  getMessageById: (messageId: string) => ChatMessage | undefined;
}

export const useChat = (options: UseChatOptions = {}): UseChatReturn => {
  const {
    initialMessages = [],
    config = {},
    onMessageSend,
    onMessageReceive,
    onError,
    onToolCall,
    maxMessages,
    autoScroll = true,
  } = options;

  const store = useChatStore();
  const { messages, isLoading, error, actions } = store;
  const prevMessagesLength = useRef(messages.length);

  // 初始化消息
  useEffect(() => {
    if (initialMessages.length > 0 && messages.length === 0) {
      initialMessages.forEach(message => {
        actions.appendMessage(message);
      });
    }
  }, [initialMessages, messages.length, actions]);

  // 设置配置
  useEffect(() => {
    if (Object.keys(config).length > 0) {
      actions.setConfig(config);
    }
  }, [config, actions]);

  // 监听新消息
  useEffect(() => {
    if (messages.length > prevMessagesLength.current) {
      const newMessages = messages.slice(prevMessagesLength.current);
      newMessages.forEach(message => {
        onMessageReceive?.(message);
      });
    }
    prevMessagesLength.current = messages.length;
  }, [messages, onMessageReceive]);

  // 限制消息数量
  useEffect(() => {
    if (maxMessages && messages.length > maxMessages) {
      const messagesToRemove = messages.slice(0, messages.length - maxMessages);
      messagesToRemove.forEach(msg => actions.deleteMessage(msg.id));
    }
  }, [messages.length, maxMessages, actions]);

  // 错误处理
  useEffect(() => {
    if (error) {
      const errorDetails = errorHandler.handleError(new Error(error.message));
      onError?.(new Error(errorDetails.message));
    }
  }, [error, onError]);

  // 发送消息
  const sendMessage = useCallback(async (content: string) => {
    try {
      onMessageSend?.(content);
      await actions.submitMessage(content);
    } catch (err) {
      const errorDetails = errorHandler.handleError(err as Error);
      onError?.(new Error(errorDetails.message));
    }
  }, [actions, onMessageSend, onError]);

  // 重新生成响应
  const regenerateResponse = useCallback(async (messageId: string) => {
    try {
      await actions.regenerateResponse(messageId);
    } catch (err) {
      const errorDetails = errorHandler.handleError(err as Error);
      onError?.(new Error(errorDetails.message));
    }
  }, [actions, onError]);

  // 重试消息
  const retryMessage = useCallback(async (messageId: string) => {
    try {
      await actions.retryMessage(messageId);
    } catch (err) {
      const errorDetails = errorHandler.handleError(err as Error);
      onError?.(new Error(errorDetails.message));
    }
  }, [actions, onError]);

  // 停止生成
  const stopGeneration = useCallback(() => {
    actions.stopGeneration();
  }, [actions]);

  // 清空消息
  const clearMessages = useCallback(() => {
    actions.clearMessages();
  }, [actions]);

  // 删除消息
  const deleteMessage = useCallback((messageId: string) => {
    actions.deleteMessage(messageId);
  }, [actions]);

  // 更新消息
  const updateMessage = useCallback((messageId: string, update: Partial<ChatMessage>) => {
    actions.updateMessage(messageId, update);
  }, [actions]);

  // 设置配置
  const setConfig = useCallback((newConfig: Partial<ChatConfig>) => {
    actions.setConfig(newConfig);
  }, [actions]);

  // 处理流式响应
  const handleStreamResponse = useCallback(async (response: any) => {
    try {
      await actions.handleStreamResponse(response);
    } catch (err) {
      const errorDetails = errorHandler.handleError(err as Error);
      onError?.(new Error(errorDetails.message));
    }
  }, [actions, onError]);

  // 处理工具调用
  const handleToolCall = useCallback(async (toolCall: any) => {
    try {
      await actions.handleToolCall(toolCall);
      onToolCall?.(toolCall.name, toolCall.parameters);
    } catch (err) {
      const errorDetails = errorHandler.handleError(err as Error);
      onError?.(new Error(errorDetails.message));
    }
  }, [actions, onToolCall, onError]);

  // 根据ID获取消息
  const getMessageById = useCallback((messageId: string) => {
    return messages.find(message => message.id === messageId);
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    regenerateResponse,
    retryMessage,
    stopGeneration,
    clearMessages,
    deleteMessage,
    updateMessage,
    setConfig,
    handleStreamResponse,
    handleToolCall,
    getMessageById,
  }
};

// 简化版聊天钩子
export const useSimpleChat = (apiEndpoint?: string) => {
  return useChat({
    config: {
      apiEndpoint: apiEndpoint || '/api/chat',
      enableTools: false,
      enableStreaming: true,
    },
  });
};

// 带工具的聊天钩子
export const useChatWithTools = (options: UseChatOptions = {}) => {
  return useChat({
    ...options,
    config: {
      enableTools: true,
      enableStreaming: true,
      ...options.config,
    },
  });
};