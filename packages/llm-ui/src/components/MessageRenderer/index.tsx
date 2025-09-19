import React, { useState } from 'react';
import styled from 'styled-components';
import { ChatMessage } from '../../types/chat';
import { useTheme } from '../ThemeProvider';
import { formatTimestamp, copyToClipboard } from '../../utils/helpers';

const MessageContainer = styled.div<{ role: string; isStreaming?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  animation: ${({ isStreaming }) => isStreaming ? 'lobeAgentPulse 2s infinite' : 'lobeAgentSlideUp 0.3s ease-out'};
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const MessageRole = styled.span<{ role: string }>`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ role, theme }) => 
    role === 'user' ? theme.colors.primary : 
    role === 'assistant' ? theme.colors.success : 
    theme.colors.textSecondary
  };
  text-transform: capitalize;
`;

const MessageContent = styled.div<{ role: string; hasError?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ role, hasError, theme }) => 
    hasError ? theme.colors.error :
    role === 'user' ? theme.colors.primary : 
    theme.colors.surface
  };
  color: ${({ role, hasError, theme }) => 
    hasError ? 'white' :
    role === 'user' ? 'white' : 
    theme.colors.text
  };
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  word-wrap: break-word;
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  
  ${({ role }) => role === 'user' && `
    margin-left: auto;
    max-width: 80%;
  `}
  
  ${({ role }) => role === 'assistant' && `
    margin-right: auto;
    max-width: 90%;
  `}
`;

const MessageActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
  opacity: 0;
  transition: opacity ${({ theme }) => theme.transitions.duration.fast};
  
  ${MessageContainer}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
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

const StreamingIndicator = styled.div`
  display: inline-block;
  width: 8px;
  height: 8px;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  margin-left: ${({ theme }) => theme.spacing.xs};
  animation: lobeAgentPulse 1s infinite;
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radii.md};
`;

// 图标组件
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const RegenerateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10"/>
    <polyline points="1 20 1 14 7 14"/>
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
  </svg>
);

const RetryIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 4v6h6"/>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
  </svg>
);

export interface MessageRendererProps {
  message: ChatMessage;
  onRegenerate?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  showActions?: boolean;
  showTimestamp?: boolean;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({
  message,
  onRegenerate,
  onRetry,
  onCopy,
  showActions = true,
  showTimestamp = true,
}) => {
  const { currentTheme } = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(message.content);
    if (success) {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
      onCopy?.(message.content);
    }
  };

  const handleRegenerate = () => {
    onRegenerate?.(message.id);
  };

  const handleRetry = () => {
    onRetry?.(message.id);
  };

  const canRegenerate = message.role === 'assistant' && !message.isStreaming;
  const canRetry = message.error && !message.isStreaming;

  return (
    <MessageContainer role={message.role} isStreaming={message.isStreaming}>
      {showTimestamp && (
        <MessageHeader>
          <MessageRole role={message.role}>
            {message.role}
            {message.isStreaming && <StreamingIndicator />}
          </MessageRole>
          <span>{formatTimestamp(message.timestamp)}</span>
        </MessageHeader>
      )}
      
      <MessageContent role={message.role} hasError={message.error}>
        {message.content || (message.isStreaming ? 'Thinking...' : 'No content')}
      </MessageContent>

      {message.error && (
        <ErrorMessage>
          Failed to generate response. Please try again.
        </ErrorMessage>
      )}

      {showActions && (
        <MessageActions>
          <ActionButton
            onClick={handleCopy}
            data-tooltip={copySuccess ? 'Copied!' : 'Copy message'}
            disabled={!message.content}
          >
            <CopyIcon />
            {copySuccess ? 'Copied' : 'Copy'}
          </ActionButton>

          {canRegenerate && (
            <ActionButton
              onClick={handleRegenerate}
              data-tooltip="Regenerate response"
            >
              <RegenerateIcon />
              Regenerate
            </ActionButton>
          )}

          {canRetry && (
            <ActionButton
              onClick={handleRetry}
              data-tooltip="Retry message"
            >
              <RetryIcon />
              Retry
            </ActionButton>
          )}
        </MessageActions>
      )}
    </MessageContainer>
  );
};

// 消息列表组件
export interface MessageListProps {
  messages: ChatMessage[];
  onRegenerate?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  onCopy?: (content: string) => void;
  showActions?: boolean;
  showTimestamp?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MessageListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  max-height: 100%;
  overflow-y: auto;
`;

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  onRegenerate,
  onRetry,
  onCopy,
  showActions = true,
  showTimestamp = true,
  className,
  style,
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <MessageListContainer className={className} style={style}>
      {messages.map((message) => (
        <MessageRenderer
          key={message.id}
          message={message}
          onRegenerate={onRegenerate}
          onRetry={onRetry}
          onCopy={onCopy}
          showActions={showActions}
          showTimestamp={showTimestamp}
        />
      ))}
      <div ref={messagesEndRef} />
    </MessageListContainer>
  );
};