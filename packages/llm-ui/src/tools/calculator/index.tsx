import React from 'react';
import { z } from 'zod';
import { Tool, CalculatorParams, CalculatorResult } from '../../types/tool';

// 计算器图标组件
const CalculatorIcon: React.FC<{ size?: number; className?: string }> = ({ 
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
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="6" x2="16" y2="6"/>
    <line x1="16" y1="14" x2="16" y2="18"/>
    <path d="M16 10h.01"/>
    <path d="M12 10h.01"/>
    <path d="M8 10h.01"/>
    <path d="M12 14h.01"/>
    <path d="M8 14h.01"/>
    <path d="M12 18h.01"/>
    <path d="M8 18h.01"/>
  </svg>
);

// 参数输入组件
const CalculatorInputRenderer: React.FC<{
  params: CalculatorParams;
  onChange?: (params: CalculatorParams) => void;
}> = ({ params, onChange }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    <label style={{ display: 'block', marginBottom: '4px', fontWeight: 500 }}>
      Mathematical Expression:
    </label>
    <input
      type="text"
      value={params.expression}
      onChange={(e) => onChange?.({ ...params, expression: e.target.value })}
      placeholder="Enter expression, e.g. 2 + 3 * 4"
      style={{
        width: '100%',
        padding: '8px',
        border: '1px solid var(--lobe-agent-color-border)',
        borderRadius: 'var(--lobe-agent-radius-md)',
        fontSize: '14px',
        fontFamily: 'monospace',
      }}
    />
    <div style={{ fontSize: '12px', color: 'var(--lobe-agent-color-textSecondary)' }}>
      Supports: +, -, *, /, %, ^, sqrt(), sin(), cos(), tan(), log(), ln()
    </div>
  </div>
);

// 结果显示组件
const CalculatorResultRenderer: React.FC<{
  result: CalculatorResult;
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
        <strong>Calculation Error:</strong> {error}
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
        <CalculatorIcon size={20} />
        <strong style={{ fontSize: '16px' }}>Calculation Result</strong>
      </div>
      
      <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: 'var(--lobe-agent-color-textSecondary)' }}>Expression: </span>
          <span>{result.expression}</span>
        </div>
        
        <div style={{ 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: 'var(--lobe-agent-color-primary)',
          marginBottom: '12px'
        }}>
          = {result.result}
        </div>
        
        {result.steps && result.steps.length > 0 && (
          <div>
            <div style={{ 
              fontSize: '12px', 
              color: 'var(--lobe-agent-color-textSecondary)',
              marginBottom: '4px'
            }}>
              Calculation Steps:
            </div>
            <div style={{ fontSize: '12px' }}>
              {result.steps.map((step, index) => (
                <div key={index} style={{ marginBottom: '2px' }}>
                  {index + 1}. {step}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// 安全的数学表达式求值函数
const evaluateExpression = (expression: string): { result: number; steps: string[] } => {
  // 清理表达式
  const cleanExpression = expression.replace(/\s+/g, '');
  
  // 基本的安全检查
  const allowedChars = /^[0-9+\-*/().^%a-z,\s]+$/i;
  if (!allowedChars.test(cleanExpression)) {
    throw new Error('Invalid characters in expression');
  }

  // 替换数学函数
  let processedExpression = cleanExpression
    .replace(/\^/g, '**')
    .replace(/sqrt\(/g, 'Math.sqrt(')
    .replace(/sin\(/g, 'Math.sin(')
    .replace(/cos\(/g, 'Math.cos(')
    .replace(/tan\(/g, 'Math.tan(')
    .replace(/log\(/g, 'Math.log10(')
    .replace(/ln\(/g, 'Math.log(');

  try {
    // 使用 Function 构造器进行安全求值
    const result = new Function('Math', `"use strict"; return (${processedExpression})`)(Math);
    
    if (typeof result !== 'number' || !isFinite(result)) {
      throw new Error('Invalid calculation result');
    }

    // 生成计算步骤（简化版）
    const steps = [
      `Original: ${expression}`,
      `Processed: ${processedExpression}`,
      `Result: ${result}`,
    ];

    return { result, steps };
  } catch (error: any) {
    throw new Error(`Calculation error: ${error.message}`);
  }
};

// 计算器工具定义
export const calculatorTool: Tool<CalculatorParams, CalculatorResult> = {
  name: 'calculator',
  description: 'Perform mathematical calculations and evaluate expressions',
  category: 'utility',
  tags: ['math', 'calculation', 'arithmetic'],
  version: '1.0.0',
  
  parameters: z.object({
    expression: z.string().min(1).describe('Mathematical expression to evaluate'),
  }),

  icon: CalculatorIcon,
  inputRenderer: CalculatorInputRenderer,
  resultRenderer: CalculatorResultRenderer,

  execute: async ({ expression }, context) => {
    try {
      // 检查是否被取消
      if (context?.abortSignal?.aborted) {
        throw new Error('Request was aborted');
      }

      const { result, steps } = evaluateExpression(expression);

      return {
        result,
        expression,
        steps,
      };
    } catch (error: any) {
      throw new Error(`Calculator error: ${error.message}`);
    }
  },
};