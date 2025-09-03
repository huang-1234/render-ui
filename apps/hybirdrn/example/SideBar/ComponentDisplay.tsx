import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Icon,
  Tag,
  Text,
  Typography,
  Tabs,
  SideBar,
  Svg,
  Path,
  Circle,
  Rect,
  Line,
  Ellipse,
  Polygon,
  Polyline,
  G,
  SvgText
} from '../../src/components';

// 组件展示接口
interface ComponentDisplayProps {
  componentKey: string;
}

// 组件展示系统
const ComponentDisplay: React.FC<ComponentDisplayProps> = ({ componentKey }) => {
  // 根据 componentKey 展示对应组件
  switch (componentKey) {
    case 'button':
      return <ButtonDisplay />;
    case 'icon':
      return <IconDisplay />;
    case 'typography':
      return <TypographyDisplay />;
    case 'tag':
      return <TagDisplay />;
    case 'box':
      return <BoxDisplay />;
    case 'divider':
      return <DividerDisplay />;
    case 'grid':
      return <GridDisplay />;
    case 'tabs':
      return <TabsDisplay />;
    case 'sidebar':
      return <SideBarDisplay />;
    case 'card':
      return <CardDisplay />;
    case 'svg':
      return <SvgDisplay />;
    default:
      return (
        <Box style={styles.container}>
          <Typography>未找到组件: {componentKey}</Typography>
        </Box>
      );
  }
};

// Button 组件展示
const ButtonDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Button 按钮
      </Typography>
      <Typography style={styles.description}>
        按钮用于开始一个即时操作，触发业务逻辑时使用。
      </Typography>

      <Card title="基础用法" style={styles.card}>
        <Box row style={styles.demoRow}>
          <Button>默认按钮</Button>
          <Button secondary>次要按钮</Button>
          <Button success>成功按钮</Button>
        </Box>
        <Box row style={styles.demoRow}>
          <Button warning>警告按钮</Button>
          <Button error>错误按钮</Button>
          <Button disabled>禁用按钮</Button>
        </Box>
      </Card>

      <Card title="按钮尺寸" style={styles.card}>
        <Box row style={styles.demoRow}>
          <Button small>小按钮</Button>
          <Button>默认大小</Button>
          <Button large>大按钮</Button>
        </Box>
      </Card>

      <Card title="按钮样式" style={styles.card}>
        <Box row style={styles.demoRow}>
          <Button outline>描边按钮</Button>
          <Button ghost>幽灵按钮</Button>
          <Button rounded>圆角按钮</Button>
        </Box>
      </Card>

      <Card title="加载状态" style={styles.card}>
        <Box row style={styles.demoRow}>
          <Button loading>加载中</Button>
          <Button loading outline>加载中</Button>
        </Box>
      </Card>

      <Card title="块级按钮" style={styles.card}>
        <Button block style={{ marginBottom: 10 }}>
          块级按钮
        </Button>
        <Button block secondary>
          块级按钮
        </Button>
      </Card>
    </Box>
  );
};

// Icon 组件展示
const IconDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Icon 图标
      </Typography>
      <Typography style={styles.description}>
        语义化的矢量图形，可用于表示状态、操作等。
      </Typography>

      <Card title="基础图标" style={styles.card}>
        <Grid columns={4} gap={16}>
          <Box style={styles.iconBox}>
            <Icon name="check-circle" size={24} color="green" />
            <Typography size="sm" style={{ marginTop: 8 }}>check-circle</Typography>
          </Box>
          <Box style={styles.iconBox}>
            <Icon name="close-circle" size={24} color="red" />
            <Typography size="sm" style={{ marginTop: 8 }}>close-circle</Typography>
          </Box>
          <Box style={styles.iconBox}>
            <Icon name="search" size={24} color="#1890ff" />
            <Typography size="sm" style={{ marginTop: 8 }}>search</Typography>
          </Box>
          <Box style={styles.iconBox}>
            <Icon name="star" size={24} color="gold" />
            <Typography size="sm" style={{ marginTop: 8 }}>star</Typography>
          </Box>
        </Grid>
      </Card>

      <Card title="图标尺寸" style={styles.card}>
        <Box row style={styles.demoRow}>
          <Icon name="heart" size={16} color="pink" />
          <Icon name="heart" size={24} color="pink" />
          <Icon name="heart" size={32} color="pink" />
          <Icon name="heart" size={40} color="pink" />
        </Box>
      </Card>

      <Card title="图标颜色" style={styles.card}>
        <Box row style={styles.demoRow}>
          <Icon name="message" size={24} color="black" />
          <Icon name="message" size={24} color="blue" />
          <Icon name="message" size={24} color="green" />
          <Icon name="message" size={24} color="orange" />
          <Icon name="message" size={24} color="red" />
        </Box>
      </Card>
    </Box>
  );
};

// Typography 组件展示
const TypographyDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Typography 排版
      </Typography>
      <Typography style={styles.description}>
        文本的基本格式，用于文章标题、正文、辅助文字等。
      </Typography>

      <Card title="文本类型" style={styles.card}>
        <Typography type="primary" style={styles.demoItem}>主要文本 Primary</Typography>
        <Typography type="secondary" style={styles.demoItem}>次要文本 Secondary</Typography>
        <Typography type="success" style={styles.demoItem}>成功文本 Success</Typography>
        <Typography type="warning" style={styles.demoItem}>警告文本 Warning</Typography>
        <Typography type="danger" style={styles.demoItem}>危险文本 Danger</Typography>
      </Card>

      <Card title="文本大小" style={styles.card}>
        <Typography size="xs" style={styles.demoItem}>超小号文本 (xs)</Typography>
        <Typography size="sm" style={styles.demoItem}>小号文本 (sm)</Typography>
        <Typography size="md" style={styles.demoItem}>中号文本 (md)</Typography>
        <Typography size="lg" style={styles.demoItem}>大号文本 (lg)</Typography>
        <Typography size="xl" style={styles.demoItem}>超大号文本 (xl)</Typography>
      </Card>

      <Card title="文本样式" style={styles.card}>
        <Typography bold style={styles.demoItem}>粗体文本 (bold)</Typography>
        <Typography italic style={styles.demoItem}>斜体文本 (italic)</Typography>
        <Typography underline style={styles.demoItem}>下划线文本 (underline)</Typography>
        <Typography delete style={styles.demoItem}>删除线文本 (delete)</Typography>
        <Typography center style={styles.demoItem}>居中文本 (center)</Typography>
      </Card>
    </Box>
  );
};

// Tag 组件展示
const TagDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Tag 标签
      </Typography>
      <Typography style={styles.description}>
        进行标记和分类的小标签，用于标记状态、分类等。
      </Typography>

      <Card title="基础用法" style={styles.card}>
        <Box row style={{ flexWrap: 'wrap', gap: 8 }}>
          <Tag>默认标签</Tag>
          <Tag type="primary">主要标签</Tag>
          <Tag type="success">成功标签</Tag>
          <Tag type="warning">警告标签</Tag>
          <Tag type="danger">危险标签</Tag>
        </Box>
      </Card>

      <Card title="标签尺寸" style={styles.card}>
        <Box row style={{ alignItems: 'center', gap: 8 }}>
          <Tag size="small">小标签</Tag>
          <Tag size="medium">中等标签</Tag>
          <Tag size="large">大标签</Tag>
        </Box>
      </Card>

      <Card title="圆角标签" style={styles.card}>
        <Box row style={{ gap: 8 }}>
          <Tag round>圆角标签</Tag>
          <Tag round type="primary">圆角标签</Tag>
        </Box>
      </Card>

      <Card title="可关闭标签" style={styles.card}>
        <Box row style={{ gap: 8 }}>
          <Tag closable onClose={() => console.log('关闭标签')}>可关闭标签</Tag>
          <Tag closable type="primary" onClose={() => console.log('关闭标签')}>可关闭标签</Tag>
        </Box>
      </Card>
    </Box>
  );
};

// Box 组件展示
const BoxDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Box 容器
      </Typography>
      <Typography style={styles.description}>
        基础布局容器，可以设置各种样式属性。
      </Typography>

      <Card title="基础用法" style={styles.card}>
        <Box style={styles.demoBox}>
          <Typography>基础容器</Typography>
        </Box>
      </Card>

      <Card title="行布局" style={styles.card}>
        <Box row style={styles.demoBox}>
          <Box style={styles.demoBoxItem}><Typography>项目1</Typography></Box>
          <Box style={styles.demoBoxItem}><Typography>项目2</Typography></Box>
          <Box style={styles.demoBoxItem}><Typography>项目3</Typography></Box>
        </Box>
      </Card>

      <Card title="居中布局" style={styles.card}>
        <Box center style={styles.demoBox}>
          <Typography>居中内容</Typography>
        </Box>
      </Card>

      <Card title="边框和阴影" style={styles.card}>
        <Box row style={{ gap: 16 }}>
          <Box border style={styles.demoBoxItem}>
            <Typography>带边框</Typography>
          </Box>
          <Box shadow style={styles.demoBoxItem}>
            <Typography>带阴影</Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};

// Divider 组件展示
const DividerDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Divider 分割线
      </Typography>
      <Typography style={styles.description}>
        区隔内容的分割线，对内容进行分组。
      </Typography>

      <Card title="水平分割线" style={styles.card}>
        <Typography>上方内容</Typography>
        <Divider />
        <Typography>下方内容</Typography>
      </Card>

      <Card title="垂直分割线" style={styles.card}>
        <Box row style={{ height: 50, alignItems: 'center' }}>
          <Typography>左侧内容</Typography>
          <Divider direction="vertical" style={{ marginHorizontal: 16 }} />
          <Typography>右侧内容</Typography>
        </Box>
      </Card>

      <Card title="自定义样式" style={styles.card}>
        <Typography>上方内容</Typography>
        <Divider color="blue" size={2} />
        <Typography>下方内容</Typography>
        <Divider color="red" size={3} />
        <Typography>再下方内容</Typography>
      </Card>
    </Box>
  );
};

// Grid 组件展示
const GridDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Grid 网格
      </Typography>
      <Typography style={styles.description}>
        24 栅格系统，用于布局。
      </Typography>

      <Card title="基础网格" style={styles.card}>
        <Typography style={{ marginBottom: 8 }}>2列网格</Typography>
        <Grid columns={2} gap={8} style={{ marginBottom: 16 }}>
          <Box style={styles.gridItem}><Typography>项目1</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目2</Typography></Box>
        </Grid>

        <Typography style={{ marginBottom: 8 }}>3列网格</Typography>
        <Grid columns={3} gap={8} style={{ marginBottom: 16 }}>
          <Box style={styles.gridItem}><Typography>项目1</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目2</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目3</Typography></Box>
        </Grid>

        <Typography style={{ marginBottom: 8 }}>4列网格</Typography>
        <Grid columns={4} gap={8}>
          <Box style={styles.gridItem}><Typography>项目1</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目2</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目3</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目4</Typography></Box>
        </Grid>
      </Card>

      <Card title="自定义间距" style={styles.card}>
        <Grid columns={3} gap={16}>
          <Box style={styles.gridItem}><Typography>项目1</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目2</Typography></Box>
          <Box style={styles.gridItem}><Typography>项目3</Typography></Box>
        </Grid>
      </Card>
    </Box>
  );
};

// Tabs 组件展示
const TabsDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Tabs 标签页
      </Typography>
      <Typography style={styles.description}>
        选项卡切换组件，用于在不同的内容区域之间进行切换。
      </Typography>

      <Card title="基础用法" style={styles.card}>
        <Tabs
          items={[
            { key: '1', title: '标签1', content: <Typography>标签1内容</Typography> },
            { key: '2', title: '标签2', content: <Typography>标签2内容</Typography> },
            { key: '3', title: '标签3', content: <Typography>标签3内容</Typography> },
          ]}
        />
      </Card>
    </Box>
  );
};

// SideBar 组件展示
const SideBarDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        SideBar 侧边栏
      </Typography>
      <Typography style={styles.description}>
        侧边导航栏，用于在不同的页面之间进行导航。
      </Typography>

      <Card title="基础用法" style={styles.card}>
        <Button onPress={() => console.log('打开侧边栏')}>
          打开侧边栏示例
        </Button>
        <Typography style={{ marginTop: 10 }}>
          点击左上角菜单图标可查看完整侧边栏效果
        </Typography>
      </Card>

      <Card title="侧边栏属性" style={styles.card}>
        <Typography style={styles.demoItem}>visible: 控制侧边栏显示/隐藏</Typography>
        <Typography style={styles.demoItem}>title: 侧边栏标题</Typography>
        <Typography style={styles.demoItem}>items: 菜单项配置</Typography>
        <Typography style={styles.demoItem}>activeKey: 当前选中的菜单项</Typography>
        <Typography style={styles.demoItem}>onClose: 关闭侧边栏的回调</Typography>
        <Typography style={styles.demoItem}>onItemPress: 点击菜单项的回调</Typography>
        <Typography style={styles.demoItem}>footer: 侧边栏底部内容</Typography>
      </Card>
    </Box>
  );
};

// Card 组件展示
const CardDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Card 卡片
      </Typography>
      <Typography style={styles.description}>
        通用卡片容器，用于承载相关内容和操作。
      </Typography>

      <Card title="基础卡片" style={styles.card}>
        <Typography>这是一个基础卡片的内容区域</Typography>
      </Card>

      <Card
        title="带额外内容的卡片"
        extra={<Tag type="primary">额外内容</Tag>}
        style={styles.card}
      >
        <Typography>这是一个带有额外内容的卡片</Typography>
      </Card>

      <Card
        title="带页脚的卡片"
        footer={<Button small>操作按钮</Button>}
        style={styles.card}
      >
        <Typography>这是一个带有页脚的卡片</Typography>
      </Card>

      <Card
        hoverable
        onPress={() => console.log('卡片点击')}
        style={styles.card}
      >
        <Typography>这是一个可点击的卡片，带有悬浮效果</Typography>
      </Card>
    </Box>
  );
};

// Svg 组件展示
const SvgDisplay = () => {
  return (
    <Box style={styles.container}>
      <Typography size="lg" bold style={styles.title}>
        Svg 矢量图形
      </Typography>
      <Typography style={styles.description}>
        用于显示可缩放的矢量图形，支持各种 SVG 元素。
      </Typography>

      <Card title="基础图形" style={styles.card}>
        <Box row style={{ flexWrap: 'wrap', justifyContent: 'space-around' }}>
          <Box style={styles.svgDemo}>
            <Svg width={100} height={100} viewBox="0 0 100 100">
              <Circle cx="50" cy="50" r="45" stroke="blue" strokeWidth="2.5" fill="red" />
            </Svg>
            <Typography size="sm" style={{ marginTop: 8 }}>圆形</Typography>
          </Box>

          <Box style={styles.svgDemo}>
            <Svg width={100} height={100} viewBox="0 0 100 100">
              <Rect x="10" y="10" width="80" height="80" stroke="purple" strokeWidth="2.5" fill="yellow" />
            </Svg>
            <Typography size="sm" style={{ marginTop: 8 }}>矩形</Typography>
          </Box>
        </Box>
      </Card>

      <Card title="线条和路径" style={styles.card}>
        <Box row style={{ flexWrap: 'wrap', justifyContent: 'space-around' }}>
          <Box style={styles.svgDemo}>
            <Svg width={100} height={100} viewBox="0 0 100 100">
              <Line x1="10" y1="10" x2="90" y2="90" stroke="red" strokeWidth="3" />
              <Line x1="10" y1="90" x2="90" y2="10" stroke="blue" strokeWidth="3" />
            </Svg>
            <Typography size="sm" style={{ marginTop: 8 }}>线条</Typography>
          </Box>

          <Box style={styles.svgDemo}>
            <Svg width={100} height={100} viewBox="0 0 100 100">
              <Path d="M10,50 Q50,10 90,50 T10,50" stroke="green" strokeWidth="3" fill="none" />
            </Svg>
            <Typography size="sm" style={{ marginTop: 8 }}>路径</Typography>
          </Box>
        </Box>
      </Card>

      <Card title="复杂图形" style={styles.card}>
        <Box style={{ alignItems: 'center' }}>
          <Svg width={200} height={200} viewBox="0 0 100 100">
            <G>
              <Circle cx="50" cy="50" r="45" stroke="#1890ff" strokeWidth="2.5" fill="#e6f7ff" />
              <Polygon points="50,20 61,40 85,40 65,55 72,78 50,65 28,78 35,55 15,40 39,40" fill="#1890ff" />
            </G>
          </Svg>
          <Typography size="sm">星形图标</Typography>
        </Box>
      </Card>

      <Card title="使用说明" style={styles.card}>
        <Typography style={styles.demoItem}>
          注意：Svg 组件需要安装 react-native-svg 依赖才能正常工作。
        </Typography>
        <Typography style={styles.demoItem}>
          支持的子组件：Path, Circle, Rect, Line, Ellipse, Polygon, Polyline, G, Text
        </Typography>
      </Card>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    color: '#666',
  },
  card: {
    marginBottom: 16,
  },
  demoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  demoItem: {
    marginBottom: 8,
  },
  iconBox: {
    alignItems: 'center',
    padding: 8,
  },
  demoBox: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
  },
  demoBoxItem: {
    padding: 8,
    backgroundColor: '#e6f7ff',
    borderRadius: 4,
    minWidth: 80,
    alignItems: 'center',
  },
  gridItem: {
    backgroundColor: '#e6f7ff',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  svgDemo: {
    alignItems: 'center',
    margin: 10,
  },
});

export default ComponentDisplay;