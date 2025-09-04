import React, { useState } from 'react';
import { View, Text, Icon, IconMap, TouchableOpacity, createStyles } from '@cross-platform/components';

const IconDemo: React.FC = () => {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  // 获取所有图标名称
  const iconNames = Object.keys(IconMap);

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
    iconsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    iconItem: {
      width: '25%',
      alignItems: 'center',
      padding: 10
    },
    iconItemSelected: {
      backgroundColor: '#e6f7ff',
      borderRadius: 4
    },
    iconName: {
      fontSize: 12,
      marginTop: 5,
      textAlign: 'center'
    },
    coloredIconsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 15
    },
    coloredIconItem: {
      alignItems: 'center',
      marginRight: 20,
      marginBottom: 10
    },
    sizeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginBottom: 15
    },
    iconDetail: {
      padding: 15,
      backgroundColor: '#f5f5f5',
      borderRadius: 8,
      marginTop: 15
    },
    iconDetailRow: {
      flexDirection: 'row',
      marginBottom: 10
    },
    iconDetailLabel: {
      width: 80,
      fontSize: 14,
      color: '#666'
    },
    iconDetailValue: {
      flex: 1,
      fontSize: 14
    }
  });

  // 渲染图标网格
  const renderIconsGrid = () => {
    return (
      <View style={styles.iconsGrid}>
        {iconNames.map((name) => (
          <TouchableOpacity
            key={name}
            style={[
              styles.iconItem,
              selectedIcon === name && styles.iconItemSelected
            ]}
            onPress={() => setSelectedIcon(name)}
          >
            <Icon name={name as any} size={24} color="#333" />
            <Text style={styles.iconName}>{name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // 渲染选中的图标详情
  const renderSelectedIconDetail = () => {
    if (!selectedIcon) return null;

    return (
      <View style={styles.iconDetail}>
        <View style={styles.iconDetailRow}>
          <Text style={styles.iconDetailLabel}>图标名称:</Text>
          <Text style={styles.iconDetailValue}>{selectedIcon}</Text>
        </View>
        <View style={styles.iconDetailRow}>
          <Text style={styles.iconDetailLabel}>Unicode:</Text>
          <Text style={styles.iconDetailValue}>{IconMap[selectedIcon as keyof typeof IconMap]}</Text>
        </View>
        <View style={styles.iconDetailRow}>
          <Text style={styles.iconDetailLabel}>使用示例:</Text>
          <Text style={styles.iconDetailValue}>{`<Icon name="${selectedIcon}" size={24} color="#333" />`}</Text>
        </View>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Icon name={selectedIcon as any} size={48} color="#1890ff" />
        </View>
      </View>
    );
  };

  return (
    <View>
      {/* 基础图标 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础图标</Text>
        <View style={styles.demoContainer}>
          <View style={styles.coloredIconsContainer}>
            <View style={styles.coloredIconItem}>
              <Icon name="check-circle" size={24} color="#333" />
            </View>
            <View style={styles.coloredIconItem}>
              <Icon name="info-circle" size={24} color="#333" />
            </View>
            <View style={styles.coloredIconItem}>
              <Icon name="warning-circle" size={24} color="#333" />
            </View>
            <View style={styles.coloredIconItem}>
              <Icon name="close-circle" size={24} color="#333" />
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          基础的Icon组件，用于展示各种图标。
        </Text>
      </View>

      {/* 不同颜色的图标 */}
      <View style={styles.section}>
        <Text style={styles.title}>不同颜色的图标</Text>
        <View style={styles.demoContainer}>
          <View style={styles.coloredIconsContainer}>
            <View style={styles.coloredIconItem}>
              <Icon name="check-circle" size={24} color="#52c41a" />
              <Text style={styles.iconName}>成功</Text>
            </View>
            <View style={styles.coloredIconItem}>
              <Icon name="info-circle" size={24} color="#1890ff" />
              <Text style={styles.iconName}>信息</Text>
            </View>
            <View style={styles.coloredIconItem}>
              <Icon name="warning-circle" size={24} color="#faad14" />
              <Text style={styles.iconName}>警告</Text>
            </View>
            <View style={styles.coloredIconItem}>
              <Icon name="close-circle" size={24} color="#f5222d" />
              <Text style={styles.iconName}>错误</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          通过color属性设置图标的颜色。
        </Text>
      </View>

      {/* 不同尺寸的图标 */}
      <View style={styles.section}>
        <Text style={styles.title}>不同尺寸的图标</Text>
        <View style={styles.demoContainer}>
          <View style={styles.sizeContainer}>
            <View style={{ alignItems: 'center' }}>
              <Icon name="star" size={16} color="#1890ff" />
              <Text style={styles.iconName}>小</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="star" size={24} color="#1890ff" />
              <Text style={styles.iconName}>中</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="star" size={32} color="#1890ff" />
              <Text style={styles.iconName}>大</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Icon name="star" size={48} color="#1890ff" />
              <Text style={styles.iconName}>超大</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          通过size属性设置图标的大小。
        </Text>
      </View>

      {/* 旋转的图标 */}
      <View style={styles.section}>
        <Text style={styles.title}>旋转的图标</Text>
        <View style={styles.demoContainer}>
          <View style={styles.coloredIconsContainer}>
            <View style={styles.coloredIconItem}>
              <Icon name="sync" size={24} color="#1890ff" spin />
              <Text style={styles.iconName}>旋转</Text>
            </View>
            <View style={styles.coloredIconItem}>
              <Icon name="loading" size={24} color="#1890ff" spin />
              <Text style={styles.iconName}>加载中</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          通过spin属性设置图标旋转动画。
        </Text>
      </View>

      {/* 可点击的图标 */}
      <View style={styles.section}>
        <Text style={styles.title}>可点击的图标</Text>
        <View style={styles.demoContainer}>
          <View style={styles.coloredIconsContainer}>
            <View style={styles.coloredIconItem}>
              <Icon
                name="heart"
                size={24}
                color="#f5222d"
                onClick={() => alert('图标被点击')}
              />
              <Text style={styles.iconName}>点击我</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          通过onClick属性为图标添加点击事件。
        </Text>
      </View>

      {/* 所有图标 */}
      <View style={styles.section}>
        <Text style={styles.title}>所有图标</Text>
        <View style={styles.demoContainer}>
          {renderIconsGrid()}
          {renderSelectedIconDetail()}
        </View>
        <Text style={styles.description}>
          点击图标可以查看详细信息。
        </Text>
      </View>
    </View>
  );
};

export default IconDemo;
