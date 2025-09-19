import React, { Component, ReactNode } from 'react';
import { ErrorHandler } from '../../utils/errorHandler';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface ErrorFallbackProps {
  error: Error;
  errorInfo: React.ErrorInfo | null;
  retry: () => void;
}

// 默认错误回退组件
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => (
  <div style={{
    padding: '24px',
    textAlign: 'center',
    backgroundColor: 'var(--lobe-agent-color-surface)',
    border: '1px solid var(--lobe-agent-color-error)',
    borderRadius: 'var(--lobe-agent-radius-md)',
    margin: '16px',
  }}>
    <div style={{
      fontSize: '18px',
      fontWeight: 600,
      color: 'var(--lobe-agent-color-error)',
      marginBottom: '12px',
    }}>
      Something went wrong
    </div>
    
    <div style={{
      fontSize: '14px',
      color: 'var(--lobe-agent-color-textSecondary)',
      marginBottom: '16px',
      maxWidth: '400px',
      margin: '0 auto 16px',
    }}>
      {error.message || 'An unexpected error occurred'}
    </div>
    
    <button
      className="lobe-agent-button primary"
      onClick={retry}
      style={{ marginRight: '8px' }}
    >
      Try Again
    </button>
    
    <button
      className="lobe-agent-button secondary"
      onClick={() => window.location.reload()}
    >
      Reload Page
    </button>
    
    <details style={{ marginTop: '16px', textAlign: 'left' }}>
      <summary style={{ 
        cursor: 'pointer', 
        fontSize: '12px',
        color: 'var(--lobe-agent-color-textSecondary)',
      }}>
        Error Details
      </summary>
      <pre style={{
        fontSize: '11px',
        color: 'var(--lobe-agent-color-textSecondary)',
        backgroundColor: 'var(--lobe-agent-color-background)',
        padding: '8px',
        borderRadius: 'var(--lobe-agent-radius-sm)',
        overflow: 'auto',
        maxHeight: '200px',
        marginTop: '8px',
      }}>
        {error.stack}
      </pre>
    </details>
  </div>
);

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;
  private errorHandler = ErrorHandler.getInstance();

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // 处理错误
    this.errorHandler.handleError(error, {
      componentStack: errorInfo.componentStack,
      errorBoundary: true,
    });

    // 调用外部错误处理器
    this.props.onError?.(error, errorInfo);

    // 开发环境下打印错误
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error info:', errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // 如果有错误且启用了属性变化重置
    if (hasError && resetOnPropsChange) {
      // 检查重置键是否发生变化
      if (resetKeys) {
        const prevResetKeys = prevProps.resetKeys || [];
        const hasResetKeyChanged = resetKeys.some(
          (key, index) => key !== prevResetKeys[index]
        );

        if (hasResetKeyChanged) {
          this.resetErrorBoundary();
        }
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  resetErrorBoundary = () => {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children, fallback: FallbackComponent = DefaultErrorFallback } = this.props;

    if (hasError && error) {
      return (
        <FallbackComponent
          error={error}
          errorInfo={errorInfo}
          retry={this.resetErrorBoundary}
        />
      );
    }

    return children;
  }
}

// 高阶组件包装器
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = React.forwardRef<any, P>((props, ref) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} ref={ref} />
    </ErrorBoundary>
  ));

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// 错误边界钩子
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error) => {
    setError(error);
  }, []);

  // 如果有错误，抛出它以便错误边界捕获
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureError,
    resetError,
  };
};

// 异步错误处理钩子
export const useAsyncError = () => {
  const { captureError } = useErrorHandler();

  return React.useCallback(
    (error: Error) => {
      // 在下一个事件循环中抛出错误，确保错误边界能够捕获
      setTimeout(() => {
        captureError(error);
      }, 0);
    },
    [captureError]
  );
};