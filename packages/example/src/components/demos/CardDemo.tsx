import React from 'react';
import {
  View,
  Text,
  Card,
  Button,
  Icon,
  Divider,
  createStyles
} from '@cross-platform/components';

const CardDemo: React.FC = () => {
  const styles = createStyles({
    section: {
      marginBottom: 20
    },
    title: {
      fontSize: 16,
      fontWeight: '500' as any,
      marginBottom: 10
    },
    demoContainer: {
      marginBottom: 10
    },
    description: {
      marginTop: 10,
      fontSize: 14,
      color: '#666'
    },
    cardContainer: {
      marginBottom: 20
    },
    cardContent: {
      marginBottom: 10
    },
    cardRow: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    smallCard: {
      width: '48%',
      marginRight: '2%',
      marginBottom: 10
    },
    cardAction: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 10
    },
    cardButton: {
      marginLeft: 10
    },
    cardExtra: {
      color: '#1890ff',
      fontSize: 14
    }
  });

  return (
    <View>
      {/* 基础卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardContainer}>
            <Card>
              <Text style={styles.cardContent}>
                这是一个基础卡片的内容区域，可以放置任意组件。
              </Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          基础的Card组件，提供了简单的内容容器。
        </Text>
      </View>

      {/* 带标题的卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>带标题的卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardContainer}>
            <Card title="卡片标题">
              <Text style={styles.cardContent}>
                这是一个带标题的卡片，标题会显示在卡片的顶部。
              </Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          使用title属性为卡片添加标题。
        </Text>
      </View>

      {/* 带额外操作的卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>带额外操作的卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardContainer}>
            <Card
              title="卡片标题"
              extra={<Text style={styles.cardExtra}>更多</Text>}
            >
              <Text style={styles.cardContent}>
                这是一个带额外操作的卡片，可以在标题右侧添加额外的操作区域。
              </Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          使用extra属性为卡片添加额外的操作区域。
        </Text>
      </View>

      {/* 带底部的卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>带底部的卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardContainer}>
            <Card
              title="卡片标题"
              footer={
                <View style={styles.cardAction}>
                  <Button type="secondary" size="small" style={styles.cardButton}>
                    取消
                  </Button>
                  <Button type="primary" size="small" style={styles.cardButton}>
                    确认
                  </Button>
                </View>
              }
            >
              <Text style={styles.cardContent}>
                这是一个带底部操作区域的卡片，底部区域通常用于放置按钮等操作元素。
              </Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          使用footer属性为卡片添加底部操作区域。
        </Text>
      </View>

      {/* 无边框卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>无边框卡片</Text>
        <View style={[styles.demoContainer, { backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8 }]}>
          <View style={styles.cardContainer}>
            <Card
              title="无边框卡片"
              bordered={false}
            >
              <Text style={styles.cardContent}>
                这是一个无边框的卡片，通常用于背景色较深的区域。
              </Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          使用bordered={false}属性创建无边框卡片。
        </Text>
      </View>

      {/* 带阴影的卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>带阴影的卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardRow}>
            <Card
              title="浅阴影"
              shadow="sm"
              style={styles.smallCard}
            >
              <Text>浅阴影效果</Text>
            </Card>
            <Card
              title="中等阴影"
              shadow="md"
              style={styles.smallCard}
            >
              <Text>中等阴影效果</Text>
            </Card>
          </View>
          <View style={styles.cardRow}>
            <Card
              title="深阴影"
              shadow="lg"
              style={styles.smallCard}
            >
              <Text>深阴影效果</Text>
            </Card>
            <Card
              title="默认阴影"
              shadow={true}
              style={styles.smallCard}
            >
              <Text>默认阴影效果</Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          使用shadow属性为卡片添加阴影效果，支持sm、md、lg三种阴影大小。
        </Text>
      </View>

      {/* 可点击的卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>可点击的卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardContainer}>
            <Card
              title="可点击卡片"
              onPress={() => alert('卡片被点击')}
              hoverable={true}
            >
              <Text style={styles.cardContent}>
                这是一个可点击的卡片，点击整个卡片区域会触发点击事件。
              </Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          使用onPress属性和hoverable属性创建可点击的卡片，鼠标悬停时会有视觉反馈。
        </Text>
      </View>

      {/* 不同圆角的卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>不同圆角的卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardRow}>
            <Card
              title="无圆角"
              radius="none"
              style={styles.smallCard}
            >
              <Text>无圆角效果</Text>
            </Card>
            <Card
              title="小圆角"
              radius="sm"
              style={styles.smallCard}
            >
              <Text>小圆角效果</Text>
            </Card>
          </View>
          <View style={styles.cardRow}>
            <Card
              title="中等圆角"
              radius="md"
              style={styles.smallCard}
            >
              <Text>中等圆角效果</Text>
            </Card>
            <Card
              title="大圆角"
              radius="lg"
              style={styles.smallCard}
            >
              <Text>大圆角效果</Text>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          使用radius属性设置卡片的圆角大小，支持none、sm、md、lg四种圆角大小。
        </Text>
      </View>

      {/* 复杂内容卡片 */}
      <View style={styles.section}>
        <Text style={styles.title}>复杂内容卡片</Text>
        <View style={styles.demoContainer}>
          <View style={styles.cardContainer}>
            <Card
              title="产品详情"
              extra={<Icon name="ellipsis" size={16} color="#999" />}
              shadow={true}
            >
              <View style={{ flexDirection: 'row', marginBottom: 15 }}>
                <View style={{ width: 80, height: 80, backgroundColor: '#f0f0f0', borderRadius: 4, marginRight: 15 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '500' as any, marginBottom: 5 }}>产品名称</Text>
                  <Text style={{ fontSize: 14, color: '#666', marginBottom: 5 }}>产品描述信息</Text>
                  <Text style={{ fontSize: 16, color: '#f5222d' }}>¥ 199.00</Text>
                </View>
              </View>
              <Divider />
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 14, marginBottom: 5 }}>产品参数：</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>规格：标准版</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>颜色：蓝色</Text>
                <Text style={{ fontSize: 14, color: '#666' }}>材质：塑料</Text>
              </View>
              <View style={styles.cardAction}>
                <Button type="secondary" size="small" style={styles.cardButton}>
                  加入购物车
                </Button>
                <Button type="primary" size="small" style={styles.cardButton}>
                  立即购买
                </Button>
              </View>
            </Card>
          </View>
        </View>
        <Text style={styles.description}>
          Card组件可以容纳复杂的内容结构，包括图片、文本、分割线和按钮等。
        </Text>
      </View>
    </View>
  );
};

export default CardDemo;
