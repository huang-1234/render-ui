import { describe, it, expect, vi, beforeEach } from 'vitest';
import { weatherTool } from '../weather';

// Mock fetch
global.fetch = vi.fn();

describe('weatherTool', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have correct tool metadata', () => {
    expect(weatherTool.id).toBe('weather');
    expect(weatherTool.name).toBe('Weather');
    expect(weatherTool.description).toContain('weather information');
    expect(weatherTool.category).toBe('utility');
  });

  it('should execute weather query successfully', async () => {
    const mockWeatherData = {
      location: 'New York',
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    const result = await weatherTool.execute({ location: 'New York' });

    expect(result.success).toBe(true);
    expect(result.data).toEqual(mockWeatherData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('New York')
    );
  });

  it('should handle API errors', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    const result = await weatherTool.execute({ location: 'InvalidCity' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('404');
  });

  it('should handle network errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const result = await weatherTool.execute({ location: 'New York' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error');
  });

  it('should validate location parameter', async () => {
    const result = await weatherTool.execute({ location: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('location');
  });

  it('should handle missing location parameter', async () => {
    const result = await weatherTool.execute({});

    expect(result.success).toBe(false);
    expect(result.error).toContain('location');
  });

  it('should format weather data correctly', async () => {
    const mockWeatherData = {
      location: 'London',
      temperature: 18,
      condition: 'Cloudy',
      humidity: 75,
      windSpeed: 15,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    const result = await weatherTool.execute({ location: 'London' });

    expect(result.success).toBe(true);
    expect(result.data.temperature).toBe(18);
    expect(result.data.condition).toBe('Cloudy');
  });

  it('should handle different temperature units', async () => {
    const mockWeatherData = {
      location: 'Toronto',
      temperature: 77,
      condition: 'Sunny',
      humidity: 50,
      windSpeed: 8,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    const result = await weatherTool.execute({ 
      location: 'Toronto',
      unit: 'fahrenheit'
    });

    expect(result.success).toBe(true);
    expect(result.data.temperature).toBe(77);
  });

  it('should cache weather data', async () => {
    const mockWeatherData = {
      location: 'Paris',
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    // First call
    await weatherTool.execute({ location: 'Paris' });
    
    // Second call should use cache
    const result = await weatherTool.execute({ location: 'Paris' });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledTimes(1); // Only called once due to caching
  });

  it('should handle special characters in location', async () => {
    const mockWeatherData = {
      location: 'São Paulo',
      temperature: 28,
      condition: 'Rainy',
      humidity: 80,
      windSpeed: 5,
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    const result = await weatherTool.execute({ location: 'São Paulo' });

    expect(result.success).toBe(true);
    expect(result.data.location).toBe('São Paulo');
  });

  it('should provide forecast data when available', async () => {
    const mockWeatherData = {
      location: 'Tokyo',
      temperature: 20,
      condition: 'Clear',
      humidity: 55,
      windSpeed: 7,
      forecast: [
        { day: 'Tomorrow', temperature: 22, condition: 'Sunny' },
        { day: 'Day after', temperature: 19, condition: 'Cloudy' },
      ],
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockWeatherData),
    });

    const result = await weatherTool.execute({ 
      location: 'Tokyo',
      includeForecast: true
    });

    expect(result.success).toBe(true);
    expect(result.data.forecast).toHaveLength(2);
  });

  it('should handle rate limiting', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 429,
      statusText: 'Too Many Requests',
    });

    const result = await weatherTool.execute({ location: 'Berlin' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('rate limit');
  });

  it('should validate API response format', async () => {
    const invalidResponse = { invalid: 'data' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(invalidResponse),
    });

    const result = await weatherTool.execute({ location: 'Madrid' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid response format');
  });
});