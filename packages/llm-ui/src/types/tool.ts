import { z } from 'zod';
import React from 'react';

export interface Tool<TParams = any, TResult = any> {
  name: string;
  description: string;
  parameters: z.ZodSchema<TParams>;
  execute: (params: TParams, context?: ToolExecutionContext) => Promise<TResult>;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  inputRenderer?: React.ComponentType<{ params: TParams; onChange?: (params: TParams) => void }>;
  resultRenderer?: React.ComponentType<{ result: TResult; error?: string }>;
  category?: string;
  tags?: string[];
  version?: string;
  deprecated?: boolean;
  experimental?: boolean;
}

export interface ToolExecutionContext {
  userId?: string;
  sessionId?: string;
  messageId?: string;
  abortSignal?: AbortSignal;
  metadata?: Record<string, any>;
}

export interface ToolRegistry {
  register: (tool: Tool) => void;
  unregister: (name: string) => void;
  get: (name: string) => Tool | undefined;
  getAll: () => Tool[];
  getByCategory: (category: string) => Tool[];
  search: (query: string) => Tool[];
  has: (name: string) => boolean;
  clear: () => void;
}

export interface ToolExecutionResult<T = any> {
  success: boolean;
  result?: T;
  error?: string;
  duration: number;
  metadata?: Record<string, any>;
}


export interface ToolCallEvent {
  type: 'start' | 'progress' | 'complete' | 'error';
  toolName: string;
  callId: string;
  timestamp: number;
  data?: any;
}

export interface ToolConfig {
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableLogging?: boolean;
  enableMetrics?: boolean;
  allowedTools?: string[];
  blockedTools?: string[];
}

// 内置工具类型
export interface WeatherParams {
  location: string;
  unit?: 'celsius' | 'fahrenheit';
}

export interface WeatherResult {
  temperature: number;
  conditions: string;
  location: string;
  humidity?: number;
  windSpeed?: number;
  unit: string;
}

export interface CalculatorParams {
  expression: string;
}

export interface CalculatorResult {
  result: number;
  expression: string;
  steps?: string[];
}

export interface SearchParams {
  query: string;
  limit?: number;
  category?: string;
}

export interface SearchResult {
  results: Array<{
    title: string;
    url: string;
    snippet: string;
    score?: number;
  }>;
  total: number;
  query: string;
}