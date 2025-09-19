export interface StreamChunk {
  type: 'text' | 'tool_call' | 'error' | 'done';
  content?: string;
  toolCall?: {
    id: string;
    name: string;
    arguments: Record<string, any>;
  };
  error?: string;
}

export interface StreamProcessorOptions {
  onChunk?: (chunk: StreamChunk) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
}

export class StreamProcessor {
  private buffer = '';
  private options: StreamProcessorOptions;

  constructor(options: StreamProcessorOptions = {}) {
    this.options = options;
  }

  process(chunk: string): void {
    this.buffer += chunk;

    try {
      const lines = this.buffer.split('\n');
      this.buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim()) {
          this.processLine(line.trim());
        }
      }
    } catch (error) {
      this.options.onError?.(error as Error);
    }
  }

  private processLine(line: string): void {
    try {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);

        if (data === '[DONE]') {
          this.options.onComplete?.();
          return;
        }

        const parsed = JSON.parse(data);
        const chunk = this.parseChunk(parsed);

        if (chunk) {
          this.options.onChunk?.(chunk);
        }
      }
    } catch (error) {
      // 忽略解析错误，继续处理下一行
    }
  }

  private parseChunk(data: any): StreamChunk | null {
    if (data.choices?.[0]?.delta?.content) {
      return {
        type: 'text',
        content: data.choices[0].delta.content
      };
    }

    if (data.choices?.[0]?.delta?.tool_calls?.[0]) {
      const toolCall = data.choices[0].delta.tool_calls[0];
      return {
        type: 'tool_call',
        toolCall: {
          id: toolCall.id,
          name: toolCall.function?.name,
          arguments: JSON.parse(toolCall.function?.arguments || '{}')
        }
      };
    }

    if (data.error) {
      return {
        type: 'error',
        error: data.error.message || 'Unknown error'
      };
    }

    return null;
  }

  flush(): void {
    if (this.buffer.trim()) {
      this.processLine(this.buffer.trim());
      this.buffer = '';
    }
  }

  reset(): void {
    this.buffer = '';
  }
}

// export processStream
export const processStream = new StreamProcessor()

export function createStreamProcessor(options: StreamProcessorOptions = {}): StreamProcessor {
  return new StreamProcessor(options);
}