import { z } from 'zod';
import React from 'react';

export interface IParams {
  query: string,
  region: string
}
export interface IResult {
  results: Array<SearchResultItem>;
  total?: number;
  query?: string;
}

export interface Tool<IP = IParams, IR = IResult> {
  name: string;
  description: string;
  parameters: z.ZodSchema<IP>;
  execute: (params: IP, context?: ToolExecutionContext) => Promise<IR>;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  inputRenderer?: React.ComponentType<{ params: IP; onChange?: (params: IP) => void }>;
  resultRenderer?: React.ComponentType<{ result: IR; error?: string }>;
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

export interface ToolExecutionResult<IR = IResult> {
  success: boolean;
  result?: IR;
  error?: string;
  duration: number;
  metadata?: Record<string, any>;
}


export interface ToolCallEvent<IR extends IResult = IResult> {
  type: 'start' | 'progress' | 'complete' | 'error';
  toolName: string;
  callId: string;
  timestamp: number;
  data?: IR;
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
  id?: string;
  success?: boolean;
  error?: string;
  data: {
    temperature: number;
    condition: string;
    location: string;
    humidity?: number;
    windSpeed?: number;
    unit: string;
  }
}

export interface CalculatorParams {
  expression: string;
  showSteps?: boolean;
}

export interface CalculatorResult {
  result?: number;
  expression?: string;
  steps?: string[];
  success?: boolean;
  error?: string;
}

export interface SearchBase {
  query: string;
  language?: string;
}
export interface SearchParams extends SearchBase {
  region?: string;
  limit?: number;
  category?: string;
  safeSearch?: boolean;
  dateRange?: string;
  getSuggestions?: boolean;
}

export interface SearchResultItem extends Partial<SearchBase> {
  id?: string;
  title?: string;
  url?: string;
  snippet?: string;
  publishedDate?: string;
  type?: string;
  score?: number;
  region?: string;
}
export interface SearchResult {
  id?: string;
  success?: boolean;
  error?: string;
  results: Array<SearchResultItem>;
  total?: number;
  query?: string;
}