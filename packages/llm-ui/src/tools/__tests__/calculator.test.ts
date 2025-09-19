import { describe, it, expect } from 'vitest';
import { calculatorTool } from '../calculator';

describe('calculatorTool', () => {
  it('should have correct tool metadata', () => {
    expect(calculatorTool.id).toBe('calculator');
    expect(calculatorTool.name).toBe('Calculator');
    expect(calculatorTool.description).toContain('mathematical calculations');
    expect(calculatorTool.category).toBe('utility');
  });

  it('should perform basic addition', async () => {
    const result = await calculatorTool.execute({ expression: '2 + 3' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(5);
  });

  it('should perform basic subtraction', async () => {
    const result = await calculatorTool.execute({ expression: '10 - 4' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(6);
  });

  it('should perform basic multiplication', async () => {
    const result = await calculatorTool.execute({ expression: '6 * 7' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(42);
  });

  it('should perform basic division', async () => {
    const result = await calculatorTool.execute({ expression: '15 / 3' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(5);
  });

  it('should handle decimal numbers', async () => {
    const result = await calculatorTool.execute({ expression: '3.14 * 2' });

    expect(result.success).toBe(true);
    expect(result.result).toBeCloseTo(6.28);
  });

  it('should handle complex expressions', async () => {
    const result = await calculatorTool.execute({ expression: '(2 + 3) * 4 - 1' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(19);
  });

  it('should handle parentheses correctly', async () => {
    const result = await calculatorTool.execute({ expression: '2 * (3 + 4)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(14);
  });

  it('should handle exponentiation', async () => {
    const result = await calculatorTool.execute({ expression: '2 ** 3' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(8);
  });

  it('should handle square root', async () => {
    const result = await calculatorTool.execute({ expression: 'sqrt(16)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(4);
  });

  it('should handle trigonometric functions', async () => {
    const result = await calculatorTool.execute({ expression: 'sin(0)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(0);
  });

  it('should handle logarithms', async () => {
    const result = await calculatorTool.execute({ expression: 'log(10)' });

    expect(result.success).toBe(true);
    expect(result.result).toBeCloseTo(2.302585);
  });

  it('should handle constants like pi', async () => {
    const result = await calculatorTool.execute({ expression: 'pi * 2' });

    expect(result.success).toBe(true);
    expect(result.result).toBeCloseTo(6.283185);
  });

  it('should handle constants like e', async () => {
    const result = await calculatorTool.execute({ expression: 'e ** 1' });

    expect(result.success).toBe(true);
    expect(result.result).toBeCloseTo(2.718281);
  });

  it('should handle division by zero', async () => {
    const result = await calculatorTool.execute({ expression: '5 / 0' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('division by zero');
  });

  it('should handle invalid expressions', async () => {
    const result = await calculatorTool.execute({ expression: '2 +' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid expression');
  });

  it('should handle empty expressions', async () => {
    const result = await calculatorTool.execute({ expression: '' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('expression');
  });

  it('should handle malicious expressions', async () => {
    const result = await calculatorTool.execute({ expression: 'eval("alert(1)")' });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid expression');
  });

  it('should handle very large numbers', async () => {
    const result = await calculatorTool.execute({ expression: '999999999999999 * 999999999999999' });

    expect(result.success).toBe(true);
    expect(typeof result.result).toBe('number');
  });

  it('should handle negative numbers', async () => {
    const result = await calculatorTool.execute({ expression: '-5 + 3' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(-2);
  });

  it('should handle modulo operation', async () => {
    const result = await calculatorTool.execute({ expression: '10 % 3' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(1);
  });

  it('should handle absolute value', async () => {
    const result = await calculatorTool.execute({ expression: 'abs(-5)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(5);
  });

  it('should handle ceiling function', async () => {
    const result = await calculatorTool.execute({ expression: 'ceil(4.2)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(5);
  });

  it('should handle floor function', async () => {
    const result = await calculatorTool.execute({ expression: 'floor(4.8)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(4);
  });

  it('should handle round function', async () => {
    const result = await calculatorTool.execute({ expression: 'round(4.6)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(5);
  });

  it('should handle maximum function', async () => {
    const result = await calculatorTool.execute({ expression: 'max(3, 7, 2)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(7);
  });

  it('should handle minimum function', async () => {
    const result = await calculatorTool.execute({ expression: 'min(3, 7, 2)' });

    expect(result.success).toBe(true);
    expect(result.result).toBe(2);
  });

  it('should provide step-by-step calculation for complex expressions', async () => {
    const result = await calculatorTool.execute({ 
      expression: '(2 + 3) * 4',
      showSteps: true
    });

    expect(result.success).toBe(true);
    expect(result.result).toBe(20);
    expect(result.steps).toBeDefined();
    expect(result.steps.length).toBeGreaterThan(0);
  });
});