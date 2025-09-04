import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeArea,
  createStyles
} from '@cross-platform/components';

// 组件菜单项类型
export interface ComponentMenuItem {
  key: string;
  title: string;
  component: React.ComponentType;
}

// 组件菜单属性
interface ComponentMenuProps {
  items: ComponentMenuItem[];
}

// 组件菜单实现
const ComponentMenu: React.FC<ComponentMenuProps> = ({ items }) => {
  const [selectedKey, setSelectedKey] = useState<string>(items[0]?.key || '');

  // 获取当前选中的组件
  const selectedComponent = items.find(item => item.key === selectedKey)?.component;
  const SelectedComponent = selectedComponent || (() => <Text>请选择一个组件</Text>);

  const styles = createStyles({
    container: {
      flex: 1,
      flexDirection: 'row',
      backgroundColor: '#f5f5f5'
    },
    menuContainer: {
      width: 180,
      backgroundColor: '#ffffff',
      borderRightWidth: 1,
      borderRightColor: '#e8e8e8'
    },
    menuItem: {
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0'
    },
    menuItemActive: {
      backgroundColor: '#e6f7ff',
      borderRightWidth: 3,
      borderRightColor: '#1890ff'
    },
    menuItemText: {
      fontSize: 14
    },
    menuItemTextActive: {
      color: '#1890ff',
      fontWeight: '500' as any
    },
    contentContainer: {
      flex: 1,
      backgroundColor: '#ffffff'
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0'
    },
    headerText: {
      fontSize: 18,
      fontWeight: '500' as any
    },
    content: {
      flex: 1,
      padding: 16
    }
  });

  return (
    <SafeArea style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* 左侧菜单 */}
        <View style={styles.menuContainer}>
          <ScrollView>
            {items.map(item => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.menuItem,
                  selectedKey === item.key && styles.menuItemActive
                ]}
                onPress={() => setSelectedKey(item.key)}
              >
                <Text
                  style={[
                    styles.menuItemText,
                    selectedKey === item.key && styles.menuItemTextActive
                  ]}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 右侧内容 */}
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>
              {items.find(item => item.key === selectedKey)?.title || '组件展示'}
            </Text>
          </View>
          <ScrollView style={styles.content}>
            <SelectedComponent />
          </ScrollView>
        </View>
      </View>
    </SafeArea>
  );
};

export default ComponentMenu;
