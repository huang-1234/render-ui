import React from 'react';
import ComponentMenu, { ComponentMenuItem } from './ComponentMenu';

// 导入所有组件演示
import ViewDemo from './demos/ViewDemo';
import TextDemo from './demos/TextDemo';
import ButtonDemo from './demos/ButtonDemo';
import ImageDemo from './demos/ImageDemo';
import ScrollViewDemo from './demos/ScrollViewDemo';
import TouchableOpacityDemo from './demos/TouchableOpacityDemo';
import InputDemo from './demos/InputDemo';
import CardDemo from './demos/CardDemo';
import DividerDemo from './demos/DividerDemo';
import IconDemo from './demos/IconDemo';
import SafeAreaDemo from './demos/SafeAreaDemo';

// 组件菜单项配置
const componentItems: ComponentMenuItem[] = [
  {
    key: 'view',
    title: 'View 视图',
    component: ViewDemo
  },
  {
    key: 'text',
    title: 'Text 文本',
    component: TextDemo
  },
  {
    key: 'button',
    title: 'Button 按钮',
    component: ButtonDemo
  },
  {
    key: 'image',
    title: 'Image 图片',
    component: ImageDemo
  },
  {
    key: 'scrollView',
    title: 'ScrollView 滚动视图',
    component: ScrollViewDemo
  },
  {
    key: 'touchableOpacity',
    title: 'TouchableOpacity 触摸反馈',
    component: TouchableOpacityDemo
  },
  {
    key: 'input',
    title: 'Input 输入框',
    component: InputDemo
  },
  {
    key: 'card',
    title: 'Card 卡片',
    component: CardDemo
  },
  {
    key: 'divider',
    title: 'Divider 分割线',
    component: DividerDemo
  },
  {
    key: 'icon',
    title: 'Icon 图标',
    component: IconDemo
  },
  {
    key: 'safeArea',
    title: 'SafeArea 安全区域',
    component: SafeAreaDemo
  }
];

// 组件展示主页
const ComponentsShowcase: React.FC = () => {
  return <ComponentMenu items={componentItems} />;
};

export default ComponentsShowcase;
