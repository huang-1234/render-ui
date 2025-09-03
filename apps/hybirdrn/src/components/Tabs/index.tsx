import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, type ViewProps, Platform, TouchableOpacity } from 'react-native';
import { useComponentStyles } from '../../hooks';

export interface TabItem {
  key: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends ViewProps {
  items: TabItem[];
  activeKey?: string;
  onChange?: (key: string) => void;
  type?: 'line' | 'card';
  scrollable?: boolean;
  animated?: boolean;
  testID?: string;
}

const Tabs = ({
  items,
  activeKey: propActiveKey,
  onChange,
  type = 'line',
  scrollable = true,
  animated = true,
  style,
  testID,
  ...restProps
}: TabsProps) => {
  const [stateActiveKey, setStateActiveKey] = useState(propActiveKey || (items.length > 0 ? items[0].key : ''));
  const activeKey = propActiveKey !== undefined ? propActiveKey : stateActiveKey;

  const componentStyles = useComponentStyles('Tabs');

  const isCard = type === 'card';

  const handleTabPress = useCallback((key: string, disabled?: boolean) => {
    if (disabled) return;

    if (onChange) {
      onChange(key);
    } else {
      setStateActiveKey(key);
    }
  }, [onChange]);

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  return (
    <View
      style={[
        componentStyles.container,
        isCard && componentStyles.card,
        style
      ]}
      {...webProps}
      {...restProps}
    >
      <ScrollView
        horizontal={scrollable}
        showsHorizontalScrollIndicator={false}
        style={[
          componentStyles.tabBar,
          isCard && componentStyles.cardTabBar
        ]}
      >
        {items.map((item) => {
          const isActive = activeKey === item.key;
          const isDisabled = !!item.disabled;

          return (
            <TouchableOpacity
              key={item.key}
              style={[
                componentStyles.tab,
                isCard && componentStyles.cardTab,
                isActive && componentStyles.activeTab,
                isCard && isActive && componentStyles.cardActiveTab,
                isDisabled && componentStyles.disabled,
              ]}
              onPress={() => handleTabPress(item.key, isDisabled)}
              disabled={isDisabled}
              activeOpacity={0.7}
              {...(Platform.OS === 'web' ? { 'data-testid': `tab-${item.key}` } : {})}
            >
              <Text
                style={[
                  isActive && { color: componentStyles.activeTab.color },
                  isDisabled && { opacity: 0.5 }
                ]}
              >
                {item.title}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View
        style={[
          componentStyles.content,
          isCard && componentStyles.cardContent
        ]}
      >
        {items.find((item) => item.key === activeKey)?.content}
      </View>
    </View>
  );
};

export default Tabs;
