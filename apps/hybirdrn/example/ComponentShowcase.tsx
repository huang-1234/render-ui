import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import {
  Box,
  Text,
  Button,
  Icon,
  Typography,
  Divider,
  Grid,
  Tag,
  Card
} from '../src/components';

const ComponentShowcase = () => {
  return (
    <ScrollView style={styles.container}>
      <Typography size="xl" bold>
        React Native 跨端组件库示例
      </Typography>

      <Divider style={styles.sectionDivider} />

      <Typography size="lg" bold>
        Icon 图标组件
      </Typography>
      <Box row style={styles.demoBox}>
        <Icon name="check-circle" size={24} color="green" />
        <Icon name="close-circle" size={24} color="red" />
        <Icon name="search" size={24} />
        <Icon name="star" size={24} color="gold" />
        <Icon name="heart" size={24} color="pink" />
      </Box>

      <Divider style={styles.sectionDivider} />

      <Typography size="lg" bold>
        Typography 排版组件
      </Typography>
      <Box style={styles.demoBox}>
        <Typography type="primary" size="lg" bold>
          主要文本 (Primary)
        </Typography>
        <Typography type="secondary" size="md">
          次要文本 (Secondary)
        </Typography>
        <Typography type="success" italic>
          成功文本 (Success)
        </Typography>
        <Typography type="warning" underline>
          警告文本 (Warning)
        </Typography>
        <Typography type="danger" delete>
          危险文本 (Danger)
        </Typography>
        <Typography center>
          居中文本 (Center)
        </Typography>
      </Box>

      <Divider style={styles.sectionDivider} />

      <Typography size="lg" bold>
        Divider 分割线组件
      </Typography>
      <Box style={styles.demoBox}>
        <Typography>默认水平分割线</Typography>
        <Divider />
        <Typography>自定义颜色分割线</Typography>
        <Divider color="blue" />
        <Typography>自定义尺寸分割线</Typography>
        <Divider size={2} color="red" />
        <Box row style={{ height: 50, justifyContent: 'center', alignItems: 'center' }}>
          <Text>左侧</Text>
          <Divider direction="vertical" style={{ marginHorizontal: 10 }} />
          <Text>右侧</Text>
        </Box>
      </Box>

      <Divider style={styles.sectionDivider} />

      <Typography size="lg" bold>
        Grid 网格组件
      </Typography>
      <Box style={styles.demoBox}>
        <Typography>4列网格</Typography>
        <Grid columns={4} gap={8}>
          <Box style={styles.gridItem}><Text>项目1</Text></Box>
          <Box style={styles.gridItem}><Text>项目2</Text></Box>
          <Box style={styles.gridItem}><Text>项目3</Text></Box>
          <Box style={styles.gridItem}><Text>项目4</Text></Box>
        </Grid>

        <Typography style={{ marginTop: 16 }}>2列网格</Typography>
        <Grid columns={2} gap={16}>
          <Box style={styles.gridItem}><Text>项目1</Text></Box>
          <Box style={styles.gridItem}><Text>项目2</Text></Box>
        </Grid>
      </Box>

      <Divider style={styles.sectionDivider} />

      <Typography size="lg" bold>
        Tag 标签组件
      </Typography>
      <Box row style={[styles.demoBox, { flexWrap: 'wrap', gap: 8 }]}>
        <Tag>默认标签</Tag>
        <Tag type="primary">主要标签</Tag>
        <Tag type="success">成功标签</Tag>
        <Tag type="warning">警告标签</Tag>
        <Tag type="danger">危险标签</Tag>
        <Tag round>圆角标签</Tag>
        <Tag size="small">小标签</Tag>
        <Tag size="large">大标签</Tag>
        <Tag closable onClose={() => console.log('关闭标签')}>可关闭标签</Tag>
      </Box>

      <Divider style={styles.sectionDivider} />

      <Typography size="lg" bold>
        Card 卡片组件
      </Typography>
      <Box style={styles.demoBox}>
        <Card title="基础卡片" style={{ marginBottom: 16 }}>
          <Typography>这是一个基础卡片的内容区域</Typography>
        </Card>

        <Card
          title="带额外内容的卡片"
          extra={<Tag type="primary">额外内容</Tag>}
          style={{ marginBottom: 16 }}
        >
          <Typography>这是一个带有额外内容的卡片</Typography>
        </Card>

        <Card
          title="带页脚的卡片"
          footer={<Button size="small">操作按钮</Button>}
          style={{ marginBottom: 16 }}
        >
          <Typography>这是一个带有页脚的卡片</Typography>
        </Card>

        <Card
          hoverable
          onPress={() => console.log('卡片点击')}
        >
          <Typography>这是一个可点击的卡片，带有悬浮效果</Typography>
        </Card>
      </Box>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionDivider: {
    marginVertical: 24,
  },
  demoBox: {
    marginTop: 16,
    gap: 8,
  },
  gridItem: {
    backgroundColor: '#e6f7ff',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
});

export default ComponentShowcase;
