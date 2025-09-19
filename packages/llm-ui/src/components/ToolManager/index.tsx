import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import { useToolStore } from '../../store/toolStore';
import { Tool } from '../../types/tool';

const ManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
`;

const ManagerHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const FilterTab = styled.button<{ active?: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.background
  };
  color: ${({ active, theme }) => 
    active ? 'white' : theme.colors.text
  };
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:hover {
    background: ${({ active, theme }) => 
      active ? theme.colors.primary : theme.colors.surface
    };
  }
`;

const ToolsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.sm};
`;

const ToolCard = styled.div<{ enabled?: boolean }>`
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  opacity: ${({ enabled }) => enabled ? 1 : 0.6};
  transition: all ${({ theme }) => theme.transitions.duration.fast};

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-1px);
  }
`;

const ToolHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ToolInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ToolIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
`;

const ToolDetails = styled.div`
  flex: 1;
`;

const ToolName = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text};
`;

const ToolDescription = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: ${({ theme }) => theme.typography.lineHeight.normal};
`;

const ToolMeta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ToolTag = styled.span<{ variant?: 'category' | 'version' | 'status' }>`
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  background: ${({ variant, theme }) => 
    variant === 'category' ? theme.colors.info :
    variant === 'version' ? theme.colors.success :
    variant === 'status' ? theme.colors.warning :
    theme.colors.surface
  };
  color: white;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;

  &:checked + span {
    background-color: ${({ theme }) => theme.colors.primary};
  }

  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const ToggleSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.border};
  transition: 0.3s;
  border-radius: 24px;

  &:before {
    position: absolute;
    content: "";
    height: 18px;
    width: 18px;
    left: 3px;
    bottom: 3px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export interface ToolManagerProps {
  onToolToggle?: (toolName: string, enabled: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export const ToolManager: React.FC<ToolManagerProps> = ({
  onToolToggle,
  className,
  style,
}) => {
  const { actions, config } = useToolStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const allTools = actions.getAllTools();

  // 获取所有分类
  const categories = useMemo(() => {
    const cats = new Set(allTools.map(tool => tool.category).filter(Boolean));
    return Array.from(cats);
  }, [allTools]);

  // 过滤工具
  const filteredTools = useMemo(() => {
    let filtered = allTools;

    // 按搜索查询过滤
    if (searchQuery) {
      filtered = actions.searchTools(searchQuery);
    }

    // 按分类过滤
    if (activeFilter !== 'all') {
      filtered = filtered.filter(tool => tool.category === activeFilter);
    }

    return filtered;
  }, [allTools, searchQuery, activeFilter, actions]);

  const isToolEnabled = (toolName: string): boolean => {
    if (config.blockedTools?.includes(toolName)) {
      return false;
    }
    if (config.allowedTools && config.allowedTools.length > 0) {
      return config.allowedTools.includes(toolName);
    }
    return true;
  };

  const handleToolToggle = (toolName: string) => {
    const isEnabled = isToolEnabled(toolName);
    
    if (isEnabled) {
      // 禁用工具
      const newBlockedTools = [...(config.blockedTools || []), toolName];
      actions.setConfig({ blockedTools: newBlockedTools });
    } else {
      // 启用工具
      const newBlockedTools = (config.blockedTools || []).filter(name => name !== toolName);
      actions.setConfig({ blockedTools: newBlockedTools });
    }

    onToolToggle?.(toolName, !isEnabled);
  };

  const renderToolCard = (tool: Tool) => {
    const enabled = isToolEnabled(tool.name);

    return (
      <ToolCard key={tool.name} enabled={enabled}>
        <ToolHeader>
          <ToolInfo>
            <ToolIcon>
              {tool.icon ? <tool.icon size={16} /> : tool.name.charAt(0).toUpperCase()}
            </ToolIcon>
            <ToolDetails>
              <ToolName>{tool.name}</ToolName>
              <ToolDescription>{tool.description}</ToolDescription>
            </ToolDetails>
          </ToolInfo>
          
          <ToggleSwitch>
            <ToggleInput
              type="checkbox"
              checked={enabled}
              onChange={() => handleToolToggle(tool.name)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </ToolHeader>

        <ToolMeta>
          {tool.category && (
            <ToolTag variant="category">{tool.category}</ToolTag>
          )}
          {tool.version && (
            <ToolTag variant="version">v{tool.version}</ToolTag>
          )}
          {tool.experimental && (
            <ToolTag variant="status">experimental</ToolTag>
          )}
          {tool.deprecated && (
            <ToolTag variant="status">deprecated</ToolTag>
          )}
        </ToolMeta>
      </ToolCard>
    );
  };

  return (
    <ManagerContainer className={className} style={style}>
      <ManagerHeader>
        <SearchInput
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <FilterTabs>
          <FilterTab
            active={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          >
            All ({allTools.length})
          </FilterTab>
          {categories.map(category => (
            <FilterTab
              key={category}
              active={activeFilter === category}
              onClick={() => setActiveFilter(category || 'all')}
            >
              {category} ({allTools.filter(t => t.category === category).length})
            </FilterTab>
          ))}
        </FilterTabs>
      </ManagerHeader>

      <ToolsList>
        {filteredTools.length === 0 ? (
          <EmptyState>
            <div>No tools found</div>
            {searchQuery && (
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                Try adjusting your search query
              </div>
            )}
          </EmptyState>
        ) : (
          filteredTools.map(renderToolCard)
        )}
      </ToolsList>
    </ManagerContainer>
  );
};