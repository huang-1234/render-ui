import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useChatStore } from '../../store/chatStore';
import { useToolStore } from '../../store/toolStore';
import { MessageList } from '../MessageRenderer';
import { ChatInput } from '../ChatInput';
import { ToolExecutionList } from '../ToolExecutor';
import { ErrorBoundary } from '../ErrorBoundary';
import { useTheme } from '../ThemeProvider';

const WindowContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  box-shadow: 0 4px 12px ${({ theme }) => theme.colors.shadow};
`;

const WindowHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  min-height: 60px;
`;

const WindowTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.text};
`;

const StatusIndicator = styled.div<{ status: 'idle' | 'loading' | 'error' }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ status, theme }) => 
    status === 'loading' ? theme.colors.warning :
    status === 'error' ? theme.colors.error :
    theme.colors.success
  };
  
  ${({ status }) => status === 'loading' && `
    animation: lobeAgentPulse 1.5s infinite;
  `}
`;

const WindowActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
`;

const ToolsContainer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.divider};
  background: ${({ theme }) => theme.colors.surface};
  max-height: 300px;
  overflow-y: auto;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const EmptyStateIcon = styled.div`
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: 0.5;
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const EmptyStateTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const EmptyStateDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  max-width: 300px;
`;

// 聊天图标
const ChatIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
  </svg>
);

export interface ChatWindowProps {
  title?: string;
  placeholder?: string;
  showHeader?: boolean;
  showTools?: boolean;
  enabledTools?: string[];
  maxMessages?: number;
  onMessageSend?: (message: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  title = "AI Assistant",
  placeholder = "Type your message...",
  showHeader = true,
  showTools = true,
  enabledTools,
  maxMessages,
  onMessageSend,
  onError,
  className,
  style,
}) => {
  const { messages, isLoading, error, actions } = useChatStore();
  const { actions: toolActions } = useToolStore();
  const { currentTheme } = useTheme();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 获取活跃的工具调用
  const activeToolCalls = Array.from(useChatStore().activeToolCalls.values());

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeToolCalls]);

  // 限制消息数量
  useEffect(() => {
    if (maxMessages && messages.length > maxMessages) {
      const messagesToRemove = messages.slice(0, messages.length - maxMessages);
      messagesToRemove.forEach(msg => actions.deleteMessage(msg.id));
    }
  }, [messages.length, maxMessages, actions]);

  const handleSendMessage = async (content: string) => {
    try {
      onMessageSend?.(content);
      await actions.submitMessage(content);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const handleStopGeneration = () => {
    actions.stopGeneration();
  };

  const handleRegenerate = async (messageId: string) => {
    try {
      await actions.regenerateResponse(messageId);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const handleRetry = async (messageId: string) => {
    try {
      await actions.retryMessage(messageId);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  const handleClearMessages = () => {
    actions.clearMessages();
  };

  const getStatus = (): 'idle' | 'loading' | 'error' => {
    if (error) return 'error';
    if (isLoading) return 'loading';
    return 'idle';
  };

  const getAvailableTools = () => {
    if (enabledTools) {
      return enabledTools;
    }
    return toolActions.getAllTools().map(tool => tool.name);
  };

  return (
    <ErrorBoundary onError={onError}>
      <WindowContainer className={className} style={style}>
        {showHeader && (
          <WindowHeader>
            <WindowTitle>
              <Title>{title}</Title>
              <StatusIndicator status={getStatus()} />
            </WindowTitle>
            
            <WindowActions>
              <ActionButton
                onClick={handleClearMessages}
                disabled={messages.length === 0}
              >
                Clear
              </ActionButton>
              
              {isLoading && (
                <ActionButton onClick={handleStopGeneration}>
                  Stop
                </ActionButton>
              )}
            </WindowActions>
          </WindowHeader>
        )}

        <MessagesContainer>
          {messages.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon>
                <ChatIcon />
              </EmptyStateIcon>
              <EmptyStateTitle>Start a conversation</EmptyStateTitle>
              <EmptyStateDescription>
                Send a message to begin chatting with the AI assistant. 
                You can ask questions, request help, or start any topic you'd like to discuss.
              </EmptyStateDescription>
            </EmptyState>
          ) : (
            <MessageList
              messages={messages}
              onRegenerate={handleRegenerate}
              onRetry={handleRetry}
              showActions={true}
              showTimestamp={true}
            />
          )}
          <div ref={messagesEndRef} />
        </MessagesContainer>

        {showTools && activeToolCalls.length > 0 && (
          <ToolsContainer>
            <ToolExecutionList
              toolCalls={activeToolCalls}
              onComplete={(toolName, result) => {
                console.log(`Tool ${toolName} completed:`, result);
              }}
              onError={(toolName, error) => {
                console.error(`Tool ${toolName} failed:`, error);
              }}
              showParams={true}
              autoExecute={true}
            />
          </ToolsContainer>
        )}

        <ChatInput
          placeholder={placeholder}
          disabled={!!error}
          loading={isLoading}
          enabledTools={getAvailableTools()}
          onSend={handleSendMessage}
          onStop={handleStopGeneration}
        />
      </WindowContainer>
    </ErrorBoundary>
  );
};

// 简化版聊天窗口
export interface SimpleChatWindowProps {
  onMessageSend?: (message: string) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const SimpleChatWindow: React.FC<SimpleChatWindowProps> = ({
  onMessageSend,
  className,
  style,
}) => {
  return (
    <ChatWindow
      title="Chat"
      showHeader={false}
      showTools={false}
      onMessageSend={onMessageSend}
      className={className}
      style={style}
    />
  );
};