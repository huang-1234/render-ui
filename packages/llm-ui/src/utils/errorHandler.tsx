import React from 'react';
import { ChatMessageError } from '../types/chat';

export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  TOOL_ERROR = 'TOOL_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  ABORT_ERROR = 'ABORT_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ErrorDetails {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  metadata?: Record<string, any>;
}

/**
 * 错误处理器类
 */
export class ErrorHandler {
  private static instance: ErrorHandler;
  private errorListeners: Array<(error: ErrorDetails) => void> = [];

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * 添加错误监听器
   */
  addErrorListener(listener: (error: ErrorDetails) => void): () => void {
    this.errorListeners.push(listener);

    // 返回移除监听器的函数
    return () => {
      const index = this.errorListeners.indexOf(listener);
      if (index > -1) {
        this.errorListeners.splice(index, 1);
      }
    };
  }

  /**
   * 处理错误
   */
  handleError(error: Error | string, context?: Record<string, any>): ErrorDetails {
    const errorDetails = this.parseError(error, context);

    // 通知所有监听器
    this.errorListeners.forEach(listener => {
      try {
        listener(errorDetails);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });

    return errorDetails;
  }

  /**
   * 解析错误
   */
  private parseError(error: Error | string, context?: Record<string, any>): ErrorDetails {
    const errorMessage = typeof error === 'string' ? error : error.message;
    const errorName = typeof error === 'string' ? 'Error' : error.name;

    // 网络错误
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      return {
        code: ErrorCode.NETWORK_ERROR,
        message: 'Network connection failed. Please check your internet connection.',
        retryable: true,
        metadata: { originalError: errorMessage, context },
      };
    }

    // API错误
    if (errorMessage.includes('HTTP error') || errorMessage.includes('status:')) {
      const statusMatch = errorMessage.match(/status:\s*(\d+)/);
      const status = statusMatch ? parseInt(statusMatch[1]) : null;

      return {
        code: ErrorCode.API_ERROR,
        message: this.getApiErrorMessage(status),
        retryable: status ? status >= 500 : true,
        metadata: { status, originalError: errorMessage, context },
      };
    }

    // 验证错误
    if (errorMessage.includes('validation') || errorMessage.includes('invalid') || errorName === 'ZodError') {
      return {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Invalid input data. Please check your parameters.',
        retryable: false,
        metadata: { originalError: errorMessage, context },
      };
    }

    // 工具错误
    if (errorMessage.includes('Tool') || context?.toolName) {
      return {
        code: ErrorCode.TOOL_ERROR,
        message: `Tool execution failed: ${errorMessage}`,
        retryable: true,
        metadata: { originalError: errorMessage, context },
      };
    }

    // 超时错误
    if (errorMessage.includes('timeout') || errorName === 'TimeoutError') {
      return {
        code: ErrorCode.TIMEOUT_ERROR,
        message: 'Request timed out. Please try again.',
        retryable: true,
        metadata: { originalError: errorMessage, context },
      };
    }

    // 中止错误
    if (errorName === 'AbortError' || errorMessage.includes('aborted')) {
      return {
        code: ErrorCode.ABORT_ERROR,
        message: 'Request was cancelled.',
        retryable: false,
        metadata: { originalError: errorMessage, context },
      };
    }

    // 未知错误
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: errorMessage || 'An unexpected error occurred.',
      retryable: true,
      metadata: { originalError: errorMessage, context },
    };
  }

  /**
   * 获取API错误消息
   */
  private getApiErrorMessage(status: number | null): string {
    if (!status) return 'API request failed.';

    switch (status) {
      case 400:
        return 'Bad request. Please check your input.';
      case 401:
        return 'Authentication failed. Please check your API key.';
      case 403:
        return 'Access forbidden. You don\'t have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 500:
        return 'Internal server error. Please try again later.';
      case 502:
        return 'Bad gateway. The server is temporarily unavailable.';
      case 503:
        return 'Service unavailable. Please try again later.';
      default:
        return `API error (${status}). Please try again.`;
    }
  }
}

/**
 * 创建聊天错误对象
 */
export const createChatError = (
  error: Error | string,
  messageId?: string,
  context?: Record<string, any>
): ChatMessageError => {
  const errorHandler = ErrorHandler.getInstance();
  const errorDetails = errorHandler.handleError(error, context);

  return {
    message: errorDetails.message,
    messageId,
    retryable: errorDetails.retryable,
    code: errorDetails.code,
  };
};

/**
 * 重试包装器
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000,
  backoff: boolean = true
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      // 如果是不可重试的错误，直接抛出
      const errorHandler = ErrorHandler.getInstance();
      const errorDetails = errorHandler.handleError(error as Error);

      if (!errorDetails.retryable || attempt === maxAttempts) {
        throw error;
      }

      // 计算延迟时间
      const currentDelay = backoff ? delay * Math.pow(2, attempt - 1) : delay;
      await new Promise(resolve => setTimeout(resolve, currentDelay));
    }
  }

  throw lastError!;
};

/**
 * 错误边界HOC
 */
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>
) => {
  return class ErrorBoundary extends React.Component<
    P,
    { hasError: boolean; error: Error | null }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      const errorHandler = ErrorHandler.getInstance();
      errorHandler.handleError(error, { errorInfo });
    }

    retry = () => {
      this.setState({ hasError: false, error: null });
    };

    render() {
      if (this.state.hasError) {
        if (fallback) {
          const FallbackComponent = fallback;
          return <FallbackComponent error={this.state.error!} retry={this.retry} />;
        }

        return (
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3>Something went wrong</h3>
            <p>{this.state.error?.message}</p>
            <button onClick={this.retry}>Try again</button>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
};

// 导出单例实例
export const errorHandler = ErrorHandler.getInstance();