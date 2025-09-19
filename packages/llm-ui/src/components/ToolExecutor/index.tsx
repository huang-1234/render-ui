import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ToolCall } from '../../types/tool';
import { useToolStore } from '../../store/toolStore';
import { formatTimestamp } from '../../utils/helpers';

const ToolContainer = styled.div<{ status: string }>`
  margin: ${({ theme }) => theme.spacing.md} 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ status, theme }) =>
    status === 'completed' ? theme.colors.success :
    status === 'failed' ? theme.colors.error :
    status === 'executing' ? theme.colors.warning :
    theme.colors.border
  };
  background: ${({ theme }) => theme.colors.surface};
  animation: lobeAgentSlideUp 0.3s ease-out;
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ToolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToolIcon = styled.div<{ status: string }>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ status, theme }) =>
    status === 'completed' ? theme.colors.success :
    status === 'failed' ? theme.colors.error :
    status === 'executing' ? theme.colors.warning :
    theme.colors.primary
  };
  color: white;
  font-size: 12px;

  ${({ status }) => status === 'executing' && `
    animation: lobeAgentPulse 1.5s infinite;
  `}
`;

const ToolName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ToolStatus = styled.div<{ status: string }>`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ status, theme }) =>
    status === 'completed' ? theme.colors.success :
    status === 'failed' ? theme.colors.error :
    status === 'executing' ? theme.colors.warning :
    theme.colors.textSecondary
  };
  text-transform: capitalize;
`;

const ToolDuration = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ToolParams = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.divider};
`;

const ToolParamsTitle = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

const ToolResult = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ToolError = styled.div`
  color: ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${({ theme }) => theme.colors.divider};
  border-radius: ${({ theme }) => theme.radii.sm};
  overflow: hidden;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ progress }) => progress}%;
  transition: width 0.3s ease;
  border-radius: ${({ theme }) => theme.radii.sm};
`;

const CancelButton = styled.button`
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.error};
    color: white;
  }
`;

// 状态图标
const StatusIcon: React.FC<{ status: string }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <span>✓</span>;
    case 'failed':
      return <span>✗</span>;
    case 'executing':
      return <span>⟳</span>;
    default:
      return <span>⏸</span>;
  }
};

export interface ToolExecutorProps {
  toolCall: ToolCall;
  onComplete?: (toolName: string, result: any) => void;
  onError?: (toolName: string, error: string) => void;
  onCancel?: (toolCallId: string) => void;
  showParams?: boolean;
  autoExecute?: boolean;
}

export const ToolExecutor: React.FC<ToolExecutorProps> = ({
  toolCall,
  onComplete,
  onError,
  onCancel,
  showParams = true,
  autoExecute = true,
}) => {
  const { actions } = useToolStore();
  const [progress, setProgress] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);

  useEffect(() => {
    if (autoExecute && toolCall.status === 'pending') {
      executeToolCall();
    }
  }, [autoExecute, toolCall.status]);

  const executeToolCall = async () => {
    if (isExecuting) return;

    setIsExecuting(true);
    setProgress(0);

    // 模拟进度更新
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + Math.random() * 20, 90));
    }, 200);

    try {
      const result = await actions.executeTool(
        toolCall.toolName,
        toolCall.params,
        {
          abortSignal: new AbortController().signal,
        }
      );

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        onComplete?.(toolCall.toolName, result.result);
      } else {
        onError?.(toolCall.toolName, result.error || 'Unknown error');
      }
    } catch (error: any) {
      clearInterval(progressInterval);
      onError?.(toolCall.toolName, error.message);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleCancel = () => {
    actions.cancelExecution(toolCall.id);
    onCancel?.(toolCall.id);
    setIsExecuting(false);
  };

  const getDuration = () => {
    if (!toolCall.endTime) return null;
    return toolCall.endTime - toolCall.startTime;
  };

  const tool = actions.getTool(toolCall.toolName);

  return (
    <ToolContainer status={toolCall.status}>
      <ToolHeader>
        <ToolInfo>
          <ToolIcon status={toolCall.status}>
            {tool?.icon ? (
              <tool.icon size={16} />
            ) : (
              <StatusIcon status={toolCall.status} />
            )}
          </ToolIcon>
          <div>
            <ToolName>{tool?.name || toolCall.toolName}</ToolName>
            <ToolStatus status={toolCall.status}>
              {toolCall.status}
              {getDuration() && (
                <ToolDuration> • {getDuration()}ms</ToolDuration>
              )}
            </ToolStatus>
          </div>
        </ToolInfo>

        {(toolCall.status === 'executing' || toolCall.status === 'pending') && (
          <CancelButton onClick={handleCancel}>
            Cancel
          </CancelButton>
        )}
      </ToolHeader>

      {showParams && toolCall.params && (
        <ToolParams>
          <ToolParamsTitle>Parameters:</ToolParamsTitle>
          {tool?.inputRenderer ? (
            <tool.inputRenderer params={toolCall.params} />
          ) : (
            <pre style={{
              fontSize: '12px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
            }}>
              {JSON.stringify(toolCall.params, null, 2)}
            </pre>
          )}
        </ToolParams>
      )}

      {(toolCall.status === 'executing' || isExecuting) && (
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      )}

      {toolCall.status === 'completed' && toolCall.result && (
        <ToolResult>
          {tool?.resultRenderer ? (
            <tool.resultRenderer result={toolCall.result} />
          ) : (
            <pre style={{
              fontSize: '12px',
              margin: 0,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              padding: '12px',
              background: 'var(--lobe-agent-color-background)',
              borderRadius: 'var(--lobe-agent-radius-md)',
              border: '1px solid var(--lobe-agent-color-divider)',
            }}>
              {JSON.stringify(toolCall.result, null, 2)}
            </pre>
          )}
        </ToolResult>
      )}

      {toolCall.status === 'failed' && toolCall.error && (
        <ToolError>
          <strong>Error:</strong> {toolCall.error}
        </ToolError>
      )}
    </ToolContainer>
  );
};

// 工具执行列表组件
export interface ToolExecutionListProps {
  toolCalls: ToolCall[];
  onComplete?: (toolName: string, result: any) => void;
  onError?: (toolName: string, error: string) => void;
  onCancel?: (toolCallId: string) => void;
  showParams?: boolean;
  autoExecute?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const ToolExecutionList: React.FC<ToolExecutionListProps> = ({
  toolCalls,
  onComplete,
  onError,
  onCancel,
  showParams = true,
  autoExecute = true,
  className,
  style,
}) => {
  if (toolCalls.length === 0) {
    return null;
  }

  return (
    <div className={className} style={style}>
      {toolCalls.map((toolCall) => (
        <ToolExecutor
          key={toolCall.id}
          toolCall={toolCall}
          onComplete={onComplete}
          onError={onError}
          onCancel={onCancel}
          showParams={showParams}
          autoExecute={autoExecute}
        />
      ))}
    </div>
  );
};