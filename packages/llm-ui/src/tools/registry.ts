import { Tool, ToolRegistry } from '../types/tool';
import { weatherTool } from './weather';
import { calculatorTool } from './calculator';
import { searchTool } from './search';

class ToolRegistryImpl implements ToolRegistry {
  private tools = new Map<string, Tool>();

  constructor() {
    // 注册内置工具
    this.register(weatherTool);
    this.register(calculatorTool);
    this.register(searchTool);
  }

  register(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      console.warn(`Tool "${tool.name}" is already registered. Overwriting.`);
    }
    this.tools.set(tool.name, tool);
  }

  unregister(name: string): void {
    this.tools.delete(name);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  getAll(): Tool[] {
    return Array.from(this.tools.values());
  }

  getByCategory(category: string): Tool[] {
    return this.getAll().filter(tool => tool.category === category);
  }

  search(query: string): Tool[] {
    const searchTerm = query.toLowerCase();
    return this.getAll().filter(tool => 
      tool.name.toLowerCase().includes(searchTerm) ||
      tool.description.toLowerCase().includes(searchTerm) ||
      (tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(searchTerm)))
    );
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  clear(): void {
    this.tools.clear();
  }
}

// 全局工具注册表实例
export const toolRegistry = new ToolRegistryImpl();

// 便捷函数
export const registerTool = (tool: Tool) => toolRegistry.register(tool);
export const unregisterTool = (name: string) => toolRegistry.unregister(name);
export const getTool = (name: string) => toolRegistry.get(name);
export const getAvailableTools = () => toolRegistry.getAll();
export const getToolsByCategory = (category: string) => toolRegistry.getByCategory(category);
export const searchTools = (query: string) => toolRegistry.search(query);
export const hasToolRegistered = (name: string) => toolRegistry.has(name);
export const clearToolRegistry = () => toolRegistry.clear();