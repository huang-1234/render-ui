import { describe, it, expect, vi } from 'vitest';
import { processStream, StreamProcessor } from '../streamProcessor';

describe('streamProcessor', () => {
  describe('processStream', () => {
    it('should process text stream', async () => {
      const mockResponse = new Response('Hello world');
      
      const result = await processStream(mockResponse);
      
      expect(result).toBe('Hello world');
    });

    it('should handle empty stream', async () => {
      const mockResponse = new Response('');
      
      const result = await processStream(mockResponse);
      
      expect(result).toBe('');
    });

    it('should handle stream with JSON data', async () => {
      const jsonData = { message: 'Hello', type: 'text' };
      const mockResponse = new Response(JSON.stringify(jsonData));
      
      const result = await processStream(mockResponse);
      
      expect(result).toBe(JSON.stringify(jsonData));
    });

    it('should handle stream errors', async () => {
      const mockResponse = new Response('', { status: 500 });
      
      await expect(processStream(mockResponse)).rejects.toThrow();
    });

    it('should handle network errors', async () => {
      const mockResponse = new Response('', { status: 0 });
      
      await expect(processStream(mockResponse)).rejects.toThrow();
    });
  });

  describe('StreamProcessor', () => {
    it('should create processor instance', () => {
      const processor = new StreamProcessor();
      
      expect(processor).toBeInstanceOf(StreamProcessor);
    });

    it('should process chunks sequentially', async () => {
      const processor = new StreamProcessor();
      const chunks = ['Hello', ' ', 'world'];
      const onChunk = vi.fn();
      
      for (const chunk of chunks) {
        await processor.processChunk(chunk, onChunk);
      }
      
      expect(onChunk).toHaveBeenCalledTimes(3);
      expect(onChunk).toHaveBeenNthCalledWith(1, 'Hello');
      expect(onChunk).toHaveBeenNthCalledWith(2, ' ');
      expect(onChunk).toHaveBeenNthCalledWith(3, 'world');
    });

    it('should handle chunk processing errors', async () => {
      const processor = new StreamProcessor();
      const onChunk = vi.fn().mockRejectedValue(new Error('Processing failed'));
      
      await expect(processor.processChunk('test', onChunk)).rejects.toThrow('Processing failed');
    });

    it('should accumulate processed content', async () => {
      const processor = new StreamProcessor();
      const chunks = ['Hello', ' ', 'world'];
      
      for (const chunk of chunks) {
        await processor.processChunk(chunk);
      }
      
      const result = processor.getAccumulatedContent();
      expect(result).toBe('Hello world');
    });

    it('should reset accumulated content', async () => {
      const processor = new StreamProcessor();
      
      await processor.processChunk('Hello');
      processor.reset();
      
      const result = processor.getAccumulatedContent();
      expect(result).toBe('');
    });

    it('should handle concurrent chunk processing', async () => {
      const processor = new StreamProcessor();
      const chunks = ['A', 'B', 'C'];
      const onChunk = vi.fn();
      
      const promises = chunks.map(chunk => processor.processChunk(chunk, onChunk));
      await Promise.all(promises);
      
      expect(onChunk).toHaveBeenCalledTimes(3);
    });

    it('should validate chunk format', async () => {
      const processor = new StreamProcessor();
      
      // Valid chunk
      await expect(processor.processChunk('valid text')).resolves.not.toThrow();
      
      // Invalid chunk (null)
      await expect(processor.processChunk(null as any)).rejects.toThrow();
      
      // Invalid chunk (undefined)
      await expect(processor.processChunk(undefined as any)).rejects.toThrow();
    });

    it('should handle special characters in chunks', async () => {
      const processor = new StreamProcessor();
      const specialChunk = '🚀 Hello 世界 \n\t';
      
      await processor.processChunk(specialChunk);
      
      const result = processor.getAccumulatedContent();
      expect(result).toBe(specialChunk);
    });

    it('should track processing metrics', async () => {
      const processor = new StreamProcessor();
      const chunks = ['A', 'B', 'C'];
      
      for (const chunk of chunks) {
        await processor.processChunk(chunk);
      }
      
      const metrics = processor.getMetrics();
      expect(metrics.totalChunks).toBe(3);
      expect(metrics.totalBytes).toBeGreaterThan(0);
      expect(metrics.processingTime).toBeGreaterThan(0);
    });

    it('should handle stream interruption', async () => {
      const processor = new StreamProcessor();
      
      await processor.processChunk('Hello');
      processor.interrupt();
      
      // Should not process further chunks after interruption
      await expect(processor.processChunk('world')).rejects.toThrow('Stream interrupted');
    });

    it('should support custom chunk transformers', async () => {
      const processor = new StreamProcessor();
      const transformer = (chunk: string) => chunk.toUpperCase();
      
      processor.setChunkTransformer(transformer);
      await processor.processChunk('hello');
      
      const result = processor.getAccumulatedContent();
      expect(result).toBe('HELLO');
    });

    it('should handle backpressure', async () => {
      const processor = new StreamProcessor();
      const slowOnChunk = vi.fn().mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 100))
      );
      
      const startTime = Date.now();
      await processor.processChunk('test', slowOnChunk);
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeGreaterThanOrEqual(100);
      expect(slowOnChunk).toHaveBeenCalledWith('test');
    });
  });
});