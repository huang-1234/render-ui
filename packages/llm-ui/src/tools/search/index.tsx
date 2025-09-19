import React from 'react';
import { z } from 'zod';
import { Tool, SearchParams, SearchResult } from '../../types/tool';

// 搜索图标组件
const SearchIcon: React.FC<{ size?: number; className?: string }> = ({ 
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
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

// 参数输入组件
const SearchInputRenderer: React.FC<{
  params: SearchParams;
  onChange?: (params: SearchParams) => void;
}> = ({ params, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div>
      <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
        Search Query:
      </label>
      <input
        type="text"
        value={params.query}
        onChange={(e) => onChange?.({ ...params, query: e.target.value })}
        placeholder="Enter your search query"
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid var(--lobe-agent-color-border)',
          borderRadius: 'var(--lobe-agent-radius-md)',
          fontSize: '14px',
        }}
      />
    </div>
    
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Category:
        </label>
        <select
          value={params.category || ''}
          onChange={(e) => onChange?.({ ...params, category: e.target.value || undefined })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid var(--lobe-agent-color-border)',
            borderRadius: 'var(--lobe-agent-radius-md)',
            fontSize: '14px',
          }}
        >
          <option value="">All Categories</option>
          <option value="web">Web</option>
          <option value="news">News</option>
          <option value="images">Images</option>
          <option value="videos">Videos</option>
        </select>
      </div>
      
      <div>
        <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Limit:
        </label>
        <input
          type="number"
          min="1"
          max="50"
          value={params.limit || 10}
          onChange={(e) => onChange?.({ ...params, limit: parseInt(e.target.value) || 10 })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid var(--lobe-agent-color-border)',
            borderRadius: 'var(--lobe-agent-radius-md)',
            fontSize: '14px',
          }}
        />
      </div>
    </div>
  </div>
);

// 结果显示组件
const SearchResultRenderer: React.FC<{
  result: SearchResult;
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
        <strong>Search Error:</strong> {error}
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
        <SearchIcon size={20} />
        <strong style={{ fontSize: '16px' }}>Search Results</strong>
      </div>
      
      <div style={{ marginBottom: '12px', fontSize: '14px', color: 'var(--lobe-agent-color-textSecondary)' }}>
        Found {result.total} results for "{result.query}"
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {result.results.map((item, index) => (
          <div 
            key={index}
            style={{
              padding: '12px',
              backgroundColor: 'var(--lobe-agent-color-background)',
              borderRadius: 'var(--lobe-agent-radius-sm)',
              border: '1px solid var(--lobe-agent-color-divider)',
            }}
          >
            <div style={{ marginBottom: '4px' }}>
              <a 
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: 'var(--lobe-agent-color-primary)',
                  textDecoration: 'none',
                  fontWeight: 500,
                  fontSize: '14px',
                }}
              >
                {item.title}
              </a>
              {item.score && (
                <span style={{
                  marginLeft: '8px',
                  fontSize: '12px',
                  color: 'var(--lobe-agent-color-textSecondary)',
                }}>
                  ({Math.round(item.score * 100)}% match)
                </span>
              )}
            </div>
            
            <div style={{
              fontSize: '12px',
              color: 'var(--lobe-agent-color-success)',
              marginBottom: '4px',
            }}>
              {item.url}
            </div>
            
            <div style={{
              fontSize: '13px',
              color: 'var(--lobe-agent-color-text)',
              lineHeight: 1.4,
            }}>
              {item.snippet}
            </div>
          </div>
        ))}
      </div>
      
      {result.results.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '24px',
          color: 'var(--lobe-agent-color-textSecondary)',
          fontSize: '14px',
        }}>
          No results found for your query.
        </div>
      )}
    </div>
  );
};

// 搜索工具定义
export const searchTool: Tool<SearchParams, SearchResult> = {
  name: 'search',
  description: 'Search for information across various sources and categories',
  category: 'information',
  tags: ['search', 'web', 'information', 'query'],
  version: '1.0.0',
  
  parameters: z.object({
    query: z.string().min(1).describe('The search query string'),
    limit: z.number().min(1).max(50).optional().default(10).describe('Maximum number of results to return'),
    category: z.enum(['web', 'news', 'images', 'videos']).optional().describe('Search category filter'),
  }),

  icon: SearchIcon,
  inputRenderer: SearchInputRenderer,
  resultRenderer: SearchResultRenderer,

  execute: async ({ query, limit = 10, category }, context) => {
    try {
      // 检查是否被取消
      if (context?.abortSignal?.aborted) {
        throw new Error('Request was aborted');
      }

      // 模拟搜索延迟
      await new Promise(resolve => setTimeout(resolve, 800));

      // 模拟搜索结果
      const mockResults: SearchResult = {
        query,
        total: 42,
        results: [
          {
            title: `Understanding ${query} - Complete Guide`,
            url: `https://example.com/guide/${query.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `A comprehensive guide to ${query}. Learn everything you need to know about this topic with practical examples and expert insights.`,
            score: 0.95,
          },
          {
            title: `${query} Best Practices and Tips`,
            url: `https://blog.example.com/${query.toLowerCase().replace(/\s+/g, '-')}-tips`,
            snippet: `Discover the best practices for ${query}. This article covers common pitfalls and how to avoid them.`,
            score: 0.87,
          },
          {
            title: `Latest News about ${query}`,
            url: `https://news.example.com/latest/${query.toLowerCase().replace(/\s+/g, '-')}`,
            snippet: `Stay updated with the latest developments and news related to ${query}. Breaking news and analysis.`,
            score: 0.76,
          },
        ].slice(0, limit),
      };

      return mockResults;
    } catch (error: any) {
      throw new Error(`Search failed: ${error.message}`);
    }
  },
};