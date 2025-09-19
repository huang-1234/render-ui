import { StreamProcessorOptions } from '../types/chat';

/**
 * 处理流式响应
 */
export const processStream = async (
  stream: ReadableStream<Uint8Array>,
  options: StreamProcessorOptions
) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        // 处理缓冲区中剩余的数据
        if (buffer.trim()) {
          processBuffer(buffer, options);
          buffer = '';
        }
        options.onComplete();
        break;
      }

      buffer += decoder.decode(value, { stream: true });

      // 按行处理数据（假设服务器以换行符分隔事件）
      const lines = buffer.split('\n');
      buffer = lines.pop() || ''; // 最后一行可能不完整，放回缓冲区

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6); // 移除 'data: ' 前缀
          
          if (data === '[DONE]') {
            options.onComplete();
            return;
          }
          
          processBuffer(data, options);
        }
      }
    }
  } catch (error) {
    options.onError(error as Error);
  } finally {
    reader.releaseLock();
  }
};

/**
 * 处理缓冲区数据
 */
const processBuffer = (data: string, options: StreamProcessorOptions) => {
  try {
    const parsed = JSON.parse(data);

    if (parsed.type === 'text' || parsed.choices?.[0]?.delta?.content) {
      const content = parsed.content || parsed.choices[0].delta.content;
      if (content) {
        options.onText(content);
      }
    } else if (parsed.type === 'tool_call' || parsed.choices?.[0]?.delta?.tool_calls) {
      const toolCall = parsed.tool_call || parsed.choices[0].delta.tool_calls?.[0];
      if (toolCall) {
        options.onToolCall({
          id: toolCall.id,
          name: toolCall.function?.name || toolCall.name,
          arguments: toolCall.function?.arguments || toolCall.arguments,
        });
      }
    } else if (parsed.type === 'progress') {
      options.onProgress?.(parsed.progress);
    } else if (parsed.type === 'error') {
      options.onError(new Error(parsed.error || 'Unknown error'));
    }
    // 处理其他类型的事件...
  } catch (e) {
    // 如果不是JSON，直接作为文本处理
    if (data.trim()) {
      options.onText(data);
    }
  }
};

/**
 * 创建流式响应处理器
 */
export class StreamProcessor {
  private reader: ReadableStreamDefaultReader<Uint8Array> | null = null;
  private decoder = new TextDecoder();
  private buffer = '';
  private aborted = false;

  constructor(
    private stream: ReadableStream<Uint8Array>,
    private options: StreamProcessorOptions
  ) {}

  async start(): Promise<void> {
    this.reader = this.stream.getReader();
    
    try {
      await this.processStream();
    } catch (error) {
      if (!this.aborted) {
        this.options.onError(error as Error);
      }
    } finally {
      this.cleanup();
    }
  }

  abort(): void {
    this.aborted = true;
    this.cleanup();
  }

  private async processStream(): Promise<void> {
    if (!this.reader) return;

    while (!this.aborted) {
      const { done, value } = await this.reader.read();

      if (done) {
        if (this.buffer.trim()) {
          this.processBuffer(this.buffer);
        }
        this.options.onComplete();
        break;
      }

      this.buffer += this.decoder.decode(value, { stream: true });
      this.processLines();
    }
  }

  private processLines(): void {
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (this.aborted) break;
      
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        
        if (data === '[DONE]') {
          this.options.onComplete();
          return;
        }
        
        this.processBuffer(data);
      }
    }
  }

  private processBuffer(data: string): void {
    try {
      const parsed = JSON.parse(data);
      this.handleParsedData(parsed);
    } catch {
      if (data.trim()) {
        this.options.onText(data);
      }
    }
  }

  private handleParsedData(parsed: any): void {
    switch (parsed.type) {
      case 'text':
        if (parsed.content) {
          this.options.onText(parsed.content);
        }
        break;
        
      case 'tool_call':
        if (parsed.tool_call) {
          this.options.onToolCall(parsed.tool_call);
        }
        break;
        
      case 'progress':
        if (parsed.progress) {
          this.options.onProgress?.(parsed.progress);
        }
        break;
        
      case 'error':
        this.options.onError(new Error(parsed.error || 'Unknown error'));
        break;
        
      default:
        // 处理 OpenAI 格式
        if (parsed.choices?.[0]?.delta?.content) {
          this.options.onText(parsed.choices[0].delta.content);
        } else if (parsed.choices?.[0]?.delta?.tool_calls) {
          const toolCall = parsed.choices[0].delta.tool_calls[0];
          if (toolCall) {
            this.options.onToolCall({
              id: toolCall.id,
              name: toolCall.function?.name,
              arguments: toolCall.function?.arguments,
            });
          }
        }
        break;
    }
  }

  private cleanup(): void {
    if (this.reader) {
      this.reader.releaseLock();
      this.reader = null;
    }
  }
}

/**
 * 创建简单的流处理器
 */
export const createStreamProcessor = (
  stream: ReadableStream<Uint8Array>,
  options: StreamProcessorOptions
): StreamProcessor => {
  return new StreamProcessor(stream, options);
};