import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import {
  Icon,
  Typography,
  Button,
  SideBar,
  MenuItem,
  Box,
  Divider,
  Card,
  Grid,
  Tag
} from '../../src/components';
import ComponentDisplay from './ComponentDisplay';

const SideBarExample = () => {
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState('home');
  const [currentComponent, setCurrentComponent] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      key: 'home',
      title: '首页',
      icon: <Icon name="check-circle" size={18} color="#1890ff" />
    },
    {
      key: 'basic',
      title: '基础组件',
      icon: <Icon name="picture" size={18} color="#1890ff" />,
      expanded: true,
      children: [
        {
          key: 'button',
          title: 'Button 按钮',
          icon: <Icon name="check-circle" size={16} color="#52c41a" />
        },
        {
          key: 'icon',
          title: 'Icon 图标',
          icon: <Icon name="star" size={16} color="#52c41a" />
        },
        {
          key: 'typography',
          title: 'Typography 排版',
          icon: <Icon name="message" size={16} color="#52c41a" />
        },
        {
          key: 'tag',
          title: 'Tag 标签',
          icon: <Icon name="search" size={16} color="#52c41a" />
        }
      ]
    },
    {
      key: 'layout',
      title: '布局组件',
      icon: <Icon name="search" size={18} color="#1890ff" />,
      children: [
        {
          key: 'box',
          title: 'Box 容器',
          icon: <Icon name="check-circle" size={16} color="#faad14" />
        },
        {
          key: 'divider',
          title: 'Divider 分割线',
          icon: <Icon name="picture" size={16} color="#faad14" />
        },
        {
          key: 'grid',
          title: 'Grid 网格',
          icon: <Icon name="search" size={16} color="#faad14" />
        }
      ]
    },
    {
      key: 'navigation',
      title: '导航组件',
      icon: <Icon name="message" size={18} color="#1890ff" />,
      children: [
        {
          key: 'tabs',
          title: 'Tabs 标签页',
          icon: <Icon name="check-circle" size={16} color="#ff4d4f" />
        },
        {
          key: 'sidebar',
          title: 'SideBar 侧边栏',
          icon: <Icon name="picture" size={16} color="#ff4d4f" />
        }
      ]
    },
    {
      key: 'data',
      title: '数据展示',
      icon: <Icon name="search" size={18} color="#1890ff" />,
      children: [
        {
          key: 'card',
          title: 'Card 卡片',
          icon: <Icon name="check-circle" size={16} color="#13c2c2" />
        },
        {
          key: 'svg',
          title: 'Svg 矢量图形',
          icon: <Icon name="picture" size={16} color="#13c2c2" />
        }
      ]
    }
  ];

  const handleOpenSideBar = () => {
    setVisible(true);
  };

  const handleCloseSideBar = () => {
    setVisible(false);
  };

  const handleItemPress = (key: string) => {
    setActiveKey(key);

    // 如果是组件菜单项，设置当前组件
    if (key !== 'home') {
      setCurrentComponent(key);
    } else {
      setCurrentComponent(null);
    }

    setVisible(false);
  };

  // 获取当前选中菜单项的标题
  const getActiveMenuTitle = () => {
    if (activeKey === 'home') {
      return '组件库首页';
    }

    // 查找菜单项
    for (const item of menuItems) {
      if (item.key === activeKey) {
        return item.title;
      }

      if (item.children) {
        for (const child of item.children) {
          if (child.key === activeKey) {
            return child.title;
          }
        }
      }
    }

    return '';
  };

  return (
    <SafeAreaView style={styles.container}>
            <Box style={styles.header}>
        <TouchableOpacity onPress={handleOpenSideBar}>
          <Icon name="ellipsis" size={24} />
        </TouchableOpacity>
        <Typography size="lg" bold>
          {getActiveMenuTitle()}
        </Typography>
        <View style={{ width: 24 }} />
      </Box>

      <Divider />

      <ScrollView style={styles.content}>
        {currentComponent === null ? (
          // 首页内容
          <Box style={styles.homeContent}>
            <Typography size="xl" bold style={{ marginBottom: 20 }}>
              React Native 跨端组件库
            </Typography>

            <Card style={{ marginBottom: 20 }}>
              <Typography size="lg" bold style={{ marginBottom: 10 }}>
                使用指南
              </Typography>
              <Typography>
                点击左上角菜单图标或下方按钮打开侧边栏，选择组件查看详细用法。
              </Typography>
            </Card>

            <Button onPress={handleOpenSideBar}>
              打开组件菜单
            </Button>
          </Box>
        ) : (
          // 组件展示内容
          <ComponentDisplay componentKey={currentComponent} />
        )}
      </ScrollView>

      <SideBar
        visible={visible}
        title="菜单导航"
        items={menuItems}
        activeKey={activeKey}
        onClose={handleCloseSideBar}
        onItemPress={handleItemPress}
        footer={
          <Button
            secondary
            small
            onPress={handleCloseSideBar}
          >
            关闭菜单
          </Button>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    flex: 1,
  },
  homeContent: {
    padding: 16,
    alignItems: 'center',
  },
});

export default SideBarExample;
