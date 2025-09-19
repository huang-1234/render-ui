import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorHandler, createErrorHandler } from '../errorHandler';

describe('ErrorHandler', () => {
  let errorHandler: ErrorHandler;
  let mockLogger: any;

  beforeEach(() => {
    mockLogger = {
      error: vi.fn(),
      warn: vi.fn(),
      info: vi.fn(),
    };
    
    errorHandler = new ErrorHandler({
      logger: mockLogger,
      enableRetry: true,
      maxRetries: 3,
    });
  });

  it('should create error handler instance', () => {
    expect(errorHandler).toBeInstanceOf(ErrorHandler);
  });

  it('should handle basic errors', () => {
    const error = new Error('Test error');
    
    const result = errorHandler.handle(error);
    
    expect(result.handled).toBe(true);
    expect(result.error).toBe(error);
    expect(mockLogger.error).toHaveBeenCalledWith('Error handled:', error);
  });

  it('should categorize network errors', () => {
    const networkError = new Error('Network request failed');
    networkError.name = 'NetworkError';
    
    const result = errorHandler.handle(networkError);
    
    expect(result.category).toBe('network');
    expect(result.retryable).toBe(true);
  });

  it('should categorize validation errors', () => {
    const validationError = new Error('Invalid input');
    validationError.name = 'ValidationError';
    
    const result = errorHandler.handle(validationError);
    
    expect(result.category).toBe('validation');
    expect(result.retryable).toBe(false);
  });

  it('should categorize authentication errors', () => {
    const authError = new Error('Unauthorized');
    authError.name = 'AuthenticationError';
    
    const result = errorHandler.handle(authError);
    
    expect(result.category).toBe('authentication');
    expect(result.retryable).toBe(false);
  });

  it('should handle retry logic', async () => {
    const retryableError = new Error('Temporary failure');
    retryableError.name = 'NetworkError';
    
    const operation = vi.fn()
      .mockRejectedValueOnce(retryableError)
      .mockRejectedValueOnce(retryableError)
      .mockResolvedValueOnce('success');
    
    const result = await errorHandler.retry(operation);
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should respect max retry limit', async () => {
    const retryableError = new Error('Persistent failure');
    retryableError.name = 'NetworkError';
    
    const operation = vi.fn().mockRejectedValue(retryableError);
    
    await expect(errorHandler.retry(operation)).rejects.toThrow('Persistent failure');
    expect(operation).toHaveBeenCalledTimes(4); // Initial + 3 retries
  });

  it('should not retry non-retryable errors', async () => {
    const nonRetryableError = new Error('Invalid input');
    nonRetryableError.name = 'ValidationError';
    
    const operation = vi.fn().mockRejectedValue(nonRetryableError);
    
    await expect(errorHandler.retry(operation)).rejects.toThrow('Invalid input');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should handle custom error types', () => {
    class CustomError extends Error {
      constructor(message: string, public code: string) {
        super(message);
        this.name = 'CustomError';
      }
    }
    
    const customError = new CustomError('Custom error message', 'CUSTOM_001');
    
    const result = errorHandler.handle(customError);
    
    expect(result.handled).toBe(true);
    expect(result.error).toBe(customError);
  });

  it('should format error messages', () => {
    const error = new Error('Original message');
    
    const formatted = errorHandler.formatError(error);
    
    expect(formatted).toContain('Original message');
    expect(formatted).toContain('Error');
  });

  it('should sanitize sensitive information', () => {
    const error = new Error('API key abc123 failed');
    
    const sanitized = errorHandler.sanitizeError(error);
    
    expect(sanitized.message).not.toContain('abc123');
    expect(sanitized.message).toContain('[REDACTED]');
  });

  it('should track error metrics', () => {
    const error1 = new Error('Error 1');
    const error2 = new Error('Error 2');
    
    errorHandler.handle(error1);
    errorHandler.handle(error2);
    
    const metrics = errorHandler.getMetrics();
    
    expect(metrics.totalErrors).toBe(2);
    expect(metrics.errorsByCategory).toBeDefined();
  });

  it('should support error recovery strategies', () => {
    const error = new Error('Recoverable error');
    
    const recoveryStrategy = vi.fn().mockReturnValue({ recovered: true });
    errorHandler.addRecoveryStrategy('network', recoveryStrategy);
    
    const result = errorHandler.handle(error);
    
    expect(result.recovered).toBe(true);
  });

  it('should handle async error recovery', async () => {
    const error = new Error('Async recoverable error');
    
    const asyncRecovery = vi.fn().mockResolvedValue({ recovered: true });
    errorHandler.addAsyncRecoveryStrategy('network', asyncRecovery);
    
    const result = await errorHandler.handleAsync(error);
    
    expect(result.recovered).toBe(true);
  });

  it('should support error reporting', () => {
    const reporter = vi.fn();
    errorHandler.addReporter(reporter);
    
    const error = new Error('Reported error');
    errorHandler.handle(error);
    
    expect(reporter).toHaveBeenCalledWith(expect.objectContaining({
      error,
      timestamp: expect.any(Number),
    }));
  });

  it('should handle circular reference errors', () => {
    const circularObj: any = { name: 'test' };
    circularObj.self = circularObj;
    
    const error = new Error('Circular reference');
    (error as any).data = circularObj;
    
    expect(() => errorHandler.handle(error)).not.toThrow();
  });

  it('should support error context', () => {
    const error = new Error('Context error');
    const context = { userId: '123', action: 'sendMessage' };
    
    const result = errorHandler.handle(error, context);
    
    expect(result.context).toEqual(context);
  });

  it('should handle error boundaries', () => {
    const boundaryHandler = vi.fn();
    errorHandler.setBoundaryHandler(boundaryHandler);
    
    const error = new Error('Boundary error');
    errorHandler.handleBoundaryError(error);
    
    expect(boundaryHandler).toHaveBeenCalledWith(error);
  });
});

describe('createErrorHandler', () => {
  it('should create error handler with default config', () => {
    const handler = createErrorHandler();
    
    expect(handler).toBeInstanceOf(ErrorHandler);
  });

  it('should create error handler with custom config', () => {
    const config = {
      enableRetry: false,
      maxRetries: 5,
      logger: console,
    };
    
    const handler = createErrorHandler(config);
    
    expect(handler).toBeInstanceOf(ErrorHandler);
  });

  it('should create singleton error handler', () => {
    const handler1 = createErrorHandler();
    const handler2 = createErrorHandler();
    
    expect(handler1).toBe(handler2);
  });
});