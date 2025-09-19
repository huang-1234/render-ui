import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useTheme } from '../ThemeProvider';

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;
`;

const TextArea = styled.textarea<{ disabled?: boolean }>`
  flex: 1;
  min-height: 44px;
  max-height: 200px;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-family: ${({ theme }) => theme.typography.fontFamily};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
  resize: none;
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.duration.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: ${({ theme }) => theme.colors.surface};
  }

  /* 自定义滚动条 */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.radii.sm};
  }
`;

const SendButton = styled.button<{ disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ disabled, theme }) => 
    disabled ? theme.colors.border : theme.colors.primary
  };
  color: white;
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const StopButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: 1px solid ${({ theme }) => theme.colors.error};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: transparent;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CharacterCount = styled.div<{ isNearLimit?: boolean }>`
  position: absolute;
  bottom: -20px;
  right: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ isNearLimit, theme }) => 
    isNearLimit ? theme.colors.warning : theme.colors.textSecondary
  };
`;

const ToolsIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ToolBadge = styled.span`
  padding: 2px 6px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 10px;
`;

// 图标组件
const SendIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
);

const StopIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="6" width="12" height="12"/>
  </svg>
);

export interface ChatInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  maxLength?: number;
  enabledTools?: string[];
  onSend: (message: string) => void;
  onStop?: () => void;
  onChange?: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  value: controlledValue,
  placeholder = "Type your message...",
  disabled = false,
  loading = false,
  maxLength = 4000,
  enabledTools = [],
  onSend,
  onStop,
  onChange,
  onKeyDown,
  className,
  style,
}) => {
  const [internalValue, setInternalValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { currentTheme } = useTheme();

  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  // 自动调整高度
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(e);

    // Ctrl/Cmd + Enter 发送消息
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }

    // Shift + Enter 换行
    if (e.shiftKey && e.key === 'Enter') {
      return;
    }

    // Enter 发送消息（可配置）
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    const trimmedValue = value.trim();
    if (!trimmedValue || disabled || loading) {
      return;
    }

    onSend(trimmedValue);

    // 清空输入框
    if (!isControlled) {
      setInternalValue('');
    }
  };

  const handleStop = () => {
    onStop?.();
  };

  const canSend = value.trim().length > 0 && !disabled && !loading;
  const isNearLimit = maxLength && value.length > maxLength * 0.8;

  return (
    <InputContainer className={className} style={style}>
      {enabledTools.length > 0 && (
        <ToolsIndicator>
          <span>Available tools:</span>
          {enabledTools.map((tool) => (
            <ToolBadge key={tool}>{tool}</ToolBadge>
          ))}
        </ToolsIndicator>
      )}

      <InputWrapper>
        <TextArea
          ref={textareaRef}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        {loading ? (
          <StopButton onClick={handleStop} type="button">
            <StopIcon />
          </StopButton>
        ) : (
          <SendButton disabled={!canSend} onClick={handleSend} type="button">
            <SendIcon />
          </SendButton>
        )}

        {maxLength && (
          <CharacterCount isNearLimit={isNearLimit}>
            {value.length}/{maxLength}
          </CharacterCount>
        )}
      </InputWrapper>
    </InputContainer>
  );
};

// 简化版聊天输入组件
export interface SimpleChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const SimpleChatInput: React.FC<SimpleChatInputProps> = ({
  onSend,
  loading = false,
  disabled = false,
  placeholder = "Type a message...",
}) => {
  return (
    <ChatInput
      onSend={onSend}
      loading={loading}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
};