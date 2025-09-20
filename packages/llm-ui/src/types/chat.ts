export type MessageRole = 'user' | 'assistant' | 'system' | 'tool';

export interface ChatMessage {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: number;
  isStreaming?: boolean;
  error?: boolean;
  toolCalls?: ToolCall[];
  metadata?: Record<string, any>;
}

export interface ToolCall {
  id: string;
  toolName: string;
  params: any;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime: number;
  endTime?: number;
}

export interface ChatMessageError {
  message: string;
  messageId?: string;
  retryable?: boolean;
  code?: string;
}

export interface ChatConfig {
  apiEndpoint?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  enableTools?: boolean;
  enableStreaming?: boolean;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  activeToolCalls: Map<string, ToolCall>;
  error: ChatMessageError | null;
  config: ChatConfig;
  abortController?: AbortController;
}

export interface ChatActions {
  appendMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, update: Partial<ChatMessage>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;
  setLoading: (isLoading: boolean) => void;
  addToolCall: (toolCall: ToolCall) => void;
  updateToolCall: (id: string, update: Partial<ToolCall>) => void;
  removeToolCall: (toolCallId: string) => void;
  setError: (error: ChatMessageError | null) => void;
  setConfig: (config: Partial<ChatConfig>) => void;
  submitMessage: (message: string) => Promise<void>;
  regenerateResponse: (messageId: string) => Promise<void>;
  stopGeneration: () => void;
  retryMessage: (messageId: string) => Promise<void>;
  handleStreamResponse: (response: any) => Promise<void>;
  handleToolCall: (toolCall: any) => Promise<void>;
}

export interface StreamProcessorOptions {
  onText: (text: string) => void;
  onToolCall: (toolCall: { name: string; arguments: string; id: string }) => void;
  onComplete: () => void;
  onError: (error: Error) => void;
  onProgress?: (progress: { loaded: number; total?: number }) => void;
}