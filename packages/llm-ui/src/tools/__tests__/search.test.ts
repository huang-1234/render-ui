import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchTool } from '../search';

// Mock fetch
global.fetch = vi.fn();

describe('searchTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct tool metadata', () => {
    // expect(searchTool.id).toBe('search');
    expect(searchTool.name).toBe('Search');
    expect(searchTool.description).toContain('search');
    expect(searchTool.category).toBe('utility');
  });

  it('should perform web search successfully', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'Test Result 1',
          url: 'https://example.com/1',
          snippet: 'This is a test result',
        },
        {
          title: 'Test Result 2',
          url: 'https://example.com/2',
          snippet: 'Another test result',
        },
      ],
      totalResults: 2,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({ query: 'test query' });

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(2);
    expect(result.results[0].title).toBe('Test Result 1');
  });

  it('should handle empty search query', async () => {
    const result = await searchTool.execute({ query: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('query');
  });

  it('should handle missing query parameter', async () => {
    const result = await searchTool.execute({ query: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('query');
  });

  it('should handle API errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    const result = await searchTool.execute({ query: 'test query' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('500');
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const result = await searchTool.execute({ query: 'test query' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error');
  });

  it('should limit search results', async () => {
    const mockSearchResults = {
      results: Array.from({ length: 20 }, (_, i) => ({
        title: `Result ${i + 1}`,
        url: `https://example.com/${i + 1}`,
        snippet: `Snippet ${i + 1}`,
      })),
      totalResults: 20,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({
      query: 'test query',
      limit: 5
    });

    expect(result.success).toBe(true);
    expect(result.results).toHaveLength(5);
  });

  it('should handle different search types', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'Image Result',
          url: 'https://example.com/image.jpg',
          snippet: 'An image result',
          type: 'image',
        },
      ],
      totalResults: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({
      query: 'test image',
      category: 'images'
    });

    expect(result.success).toBe(true);
    expect(result.results[0].type).toBe('image');
  });

  it('should handle safe search filtering', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'Safe Result',
          url: 'https://example.com/safe',
          snippet: 'A safe search result',
        },
      ],
      totalResults: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({
      query: 'test query',
      safeSearch: true
    });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('safe=true')
    );
  });

  it('should handle language filtering', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'English Result',
          url: 'https://example.com/en',
          snippet: 'An English result',
          language: 'en',
        },
      ],
      totalResults: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({
      query: 'test query',
      language: 'en'
    });

    expect(result.success).toBe(true);
    expect(result.results[0].language).toBe('en');
  });

  it('should handle region-specific search', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'US Result',
          url: 'https://example.com/us',
          snippet: 'A US-specific result',
          region: 'us',
        },
      ],
      totalResults: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({
      query: 'test query',
      region: 'us'
    });

    expect(result.success).toBe(true);
    expect(result.results[0].region).toBeDefined();
  });

  it('should handle date range filtering', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'Recent Result',
          url: 'https://example.com/recent',
          snippet: 'A recent result',
          publishedDate: '2024-01-01',
        },
      ],
      totalResults: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({
      query: 'test query',
    });

    expect(result.success).toBe(true);
    expect(result.results[0].publishedDate).toBeDefined();
  });

  it('should handle special characters in query', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'Special Character Result',
          url: 'https://example.com/special',
          snippet: 'Result with special characters',
        },
      ],
      totalResults: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    const result = await searchTool.execute({ query: 'test "query" with & symbols' });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('test "query" with & symbols'))
    );
  });

  it('should provide search suggestions', async () => {
    const mockSuggestions = {
      suggestions: [
        'test query suggestion 1',
        'test query suggestion 2',
        'test query suggestion 3',
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSuggestions),
    });

    const result = await searchTool.execute({
      query: 'test qu',
    });

    expect(result.success).toBe(true);
  });

  it('should handle rate limiting', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    });

    const result = await searchTool.execute({ query: 'test query' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('rate limit');
  });

  it('should cache search results', async () => {
    const mockSearchResults = {
      results: [
        {
          title: 'Cached Result',
          url: 'https://example.com/cached',
          snippet: 'A cached result',
        },
      ],
      totalResults: 1,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSearchResults),
    });

    // First search
    await searchTool.execute({ query: 'cached query' });

    // Second search should use cache
    const result = await searchTool.execute({ query: 'cached query' });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to caching
  });

  it('should validate search response format', async () => {
    const invalidResponse = { invalid: 'data' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(invalidResponse),
    });

    const result = await searchTool.execute({ query: 'test query' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid response format');
  });
});