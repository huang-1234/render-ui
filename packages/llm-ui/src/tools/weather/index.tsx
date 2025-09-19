import React from 'react';
import { z } from 'zod';
import { Tool, WeatherParams, WeatherResult } from '../../types/tool';

// 天气图标组件
const WeatherIcon: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = '' 
}) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);

// 参数输入组件
const WeatherInputRenderer: React.FC<{
  params: WeatherParams;
  onChange?: (params: WeatherParams) => void;
}> = ({ params, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <div>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
        Location:
      </label>
      <input
        type="text"
        value={params.location}
        onChange={(e) => onChange?.({ ...params, location: e.target.value })}
        placeholder="Enter city name, e.g. San Francisco, CA"
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid var(--lobe-agent-color-border)',
          borderRadius: 'var(--lobe-agent-radius-md)',
          fontSize: '14px',
        }}
      />
    </div>
    <div>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
        Unit:
      </label>
      <select
        value={params.unit || 'celsius'}
        onChange={(e) => onChange?.({ ...params, unit: e.target.value as 'celsius' | 'fahrenheit' })}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid var(--lobe-agent-color-border)',
          borderRadius: 'var(--lobe-agent-radius-md)',
          fontSize: '14px',
        }}
      >
        <option value="celsius">Celsius (°C)</option>
        <option value="fahrenheit">Fahrenheit (°F)</option>
      </select>
    </div>
  </div>
);

// 结果显示组件
const WeatherResultRenderer: React.FC<{
  result: WeatherResult;
  error?: string;
}> = ({ result, error }) => {
  if (error) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: 'var(--lobe-agent-color-error)',
        color: 'white',
        borderRadius: 'var(--lobe-agent-radius-md)',
      }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div style={{
      padding: '16px',
      backgroundColor: 'var(--lobe-agent-color-surface)',
      borderRadius: 'var(--lobe-agent-radius-md)',
      border: '1px solid var(--lobe-agent-color-border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <WeatherIcon size={20} />
        <strong style={{ fontSize: '16px' }}>Weather in {result.location}</strong>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--lobe-agent-color-primary)' }}>
            {result.temperature}°{result.unit === 'fahrenheit' ? 'F' : 'C'}
          </div>
          <div style={{ fontSize: '14px', color: 'var(--lobe-agent-color-textSecondary)' }}>
            {result.conditions}
          </div>
        </div>
        
        {(result.humidity !== undefined || result.windSpeed !== undefined) && (
          <div style={{ fontSize: '14px' }}>
            {result.humidity !== undefined && (
              <div>Humidity: {result.humidity}%</div>
            )}
            {result.windSpeed !== undefined && (
              <div>Wind: {result.windSpeed} km/h</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// 天气工具定义
export const weatherTool: Tool<WeatherParams, WeatherResult> = {
  name: 'get_weather',
  description: 'Get the current weather information for a specific location',
  category: 'utility',
  tags: ['weather', 'location', 'temperature'],
  version: '1.0.0',
  
  parameters: z.object({
    location: z.string().min(1).describe('The city and state/country, e.g. "San Francisco, CA" or "London, UK"'),
    unit: z.enum(['celsius', 'fahrenheit']).optional().default('celsius').describe('Temperature unit'),
  }),

  icon: WeatherIcon,
  inputRenderer: WeatherInputRenderer,
  resultRenderer: WeatherResultRenderer,

  execute: async ({ location, unit = 'celsius' }, context) => {
    // 模拟API调用 - 在实际使用中，这里会调用真实的天气API
    try {
      // 检查是否被取消
      if (context?.abortSignal?.aborted) {
        throw new Error('Request was aborted');
      }

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟天气数据
      const mockWeatherData: WeatherResult = {
        temperature: unit === 'fahrenheit' ? 72 : 22,
        conditions: 'Partly cloudy',
        location: location,
        humidity: 65,
        windSpeed: 12,
        unit: unit,
      };

      return mockWeatherData;
    } catch (error: any) {
      throw new Error(`Failed to fetch weather data: ${error.message}`);
    }
  },
};