import React from 'react';
import { View, Text, SafeArea, useSafeAreaInsets, createStyles } from '@cross-platform/components';

const SafeAreaDemo: React.FC = () => {
  // 获取安全区域尺寸
  const insets = useSafeAreaInsets();

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
    safeAreaContainer: {
      height: 200,
      backgroundColor: '#f0f0f0',
      borderRadius: 8,
      overflow: 'hidden',
      marginBottom: 15
    },
    safeAreaContent: {
      flex: 1,
      padding: 15
    },
    safeAreaBox: {
      backgroundColor: '#1890ff',
      padding: 10,
      borderRadius: 4
    },
    safeAreaBoxText: {
      color: '#ffffff'
    },
    insetsContainer: {
      padding: 15,
      backgroundColor: '#f5f5f5',
      borderRadius: 8
    },
    insetsRow: {
      flexDirection: 'row',
      marginBottom: 5
    },
    insetsLabel: {
      width: 80,
      fontSize: 14,
      color: '#666'
    },
    insetsValue: {
      fontSize: 14
    },
    coloredSafeArea: {
      backgroundColor: '#e6f7ff',
      borderWidth: 1,
      borderColor: '#91d5ff',
      borderStyle: 'dashed',
      borderRadius: 8
    }
  });

  return (
    <View>
      {/* 基础安全区域 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础安全区域</Text>
        <View style={styles.demoContainer}>
          <View style={styles.safeAreaContainer}>
            <SafeArea style={styles.coloredSafeArea}>
              <View style={styles.safeAreaContent}>
                <Text>这是一个基础的SafeArea组件，内容区域会自动避开安全区域。</Text>
              </View>
            </SafeArea>
          </View>
        </View>
        <Text style={styles.description}>
          SafeArea组件会自动为内容添加适当的内边距，避开设备的安全区域（如刘海、底部Home指示器等）。
        </Text>
      </View>

      {/* 顶部安全区域 */}
      <View style={styles.section}>
        <Text style={styles.title}>顶部安全区域</Text>
        <View style={styles.demoContainer}>
          <View style={styles.safeAreaContainer}>
            <SafeArea top style={styles.coloredSafeArea}>
              <View style={styles.safeAreaContent}>
                <View style={styles.safeAreaBox}>
                  <Text style={styles.safeAreaBoxText}>顶部安全区域</Text>
                </View>
              </View>
            </SafeArea>
          </View>
        </View>
        <Text style={styles.description}>
          使用top属性只应用顶部安全区域内边距。
        </Text>
      </View>

      {/* 底部安全区域 */}
      <View style={styles.section}>
        <Text style={styles.title}>底部安全区域</Text>
        <View style={styles.demoContainer}>
          <View style={styles.safeAreaContainer}>
            <SafeArea bottom style={styles.coloredSafeArea}>
              <View style={styles.safeAreaContent}>
                <View style={{ flex: 1 }} />
                <View style={styles.safeAreaBox}>
                  <Text style={styles.safeAreaBoxText}>底部安全区域</Text>
                </View>
              </View>
            </SafeArea>
          </View>
        </View>
        <Text style={styles.description}>
          使用bottom属性只应用底部安全区域内边距。
        </Text>
      </View>

      {/* 左右安全区域 */}
      <View style={styles.section}>
        <Text style={styles.title}>左右安全区域</Text>
        <View style={styles.demoContainer}>
          <View style={styles.safeAreaContainer}>
            <SafeArea left right style={styles.coloredSafeArea}>
              <View style={styles.safeAreaContent}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={styles.safeAreaBox}>
                    <Text style={styles.safeAreaBoxText}>左侧</Text>
                  </View>
                  <View style={styles.safeAreaBox}>
                    <Text style={styles.safeAreaBoxText}>右侧</Text>
                  </View>
                </View>
              </View>
            </SafeArea>
          </View>
        </View>
        <Text style={styles.description}>
          使用left和right属性应用左右安全区域内边距。
        </Text>
      </View>

      {/* 自定义背景色 */}
      <View style={styles.section}>
        <Text style={styles.title}>自定义背景色</Text>
        <View style={styles.demoContainer}>
          <View style={styles.safeAreaContainer}>
            <SafeArea backgroundColor="#1890ff">
              <View style={styles.safeAreaContent}>
                <Text style={{ color: '#ffffff' }}>自定义背景色的SafeArea</Text>
              </View>
            </SafeArea>
          </View>
        </View>
        <Text style={styles.description}>
          使用backgroundColor属性设置SafeArea的背景色。
        </Text>
      </View>

      {/* 强制设置安全区域值 */}
      <View style={styles.section}>
        <Text style={styles.title}>强制设置安全区域值</Text>
        <View style={styles.demoContainer}>
          <View style={styles.safeAreaContainer}>
            <SafeArea
              forceInsets={{ top: 20, bottom: 20 }}
              style={styles.coloredSafeArea}
            >
              <View style={styles.safeAreaContent}>
                <Text>强制设置了顶部和底部安全区域内边距为20</Text>
              </View>
            </SafeArea>
          </View>
        </View>
        <Text style={styles.description}>
          使用forceInsets属性强制设置安全区域内边距值。
        </Text>
      </View>

      {/* 最小安全区域值 */}
      <View style={styles.section}>
        <Text style={styles.title}>最小安全区域值</Text>
        <View style={styles.demoContainer}>
          <View style={styles.safeAreaContainer}>
            <SafeArea
              minInsets={{ top: 10, bottom: 10 }}
              style={styles.coloredSafeArea}
            >
              <View style={styles.safeAreaContent}>
                <Text>设置了最小顶部和底部安全区域内边距为10</Text>
              </View>
            </SafeArea>
          </View>
        </View>
        <Text style={styles.description}>
          使用minInsets属性设置安全区域内边距的最小值。
        </Text>
      </View>

      {/* 安全区域尺寸 */}
      <View style={styles.section}>
        <Text style={styles.title}>安全区域尺寸</Text>
        <View style={styles.demoContainer}>
          <View style={styles.insetsContainer}>
            <View style={styles.insetsRow}>
              <Text style={styles.insetsLabel}>顶部:</Text>
              <Text style={styles.insetsValue}>{insets.top}px</Text>
            </View>
            <View style={styles.insetsRow}>
              <Text style={styles.insetsLabel}>底部:</Text>
              <Text style={styles.insetsValue}>{insets.bottom}px</Text>
            </View>
            <View style={styles.insetsRow}>
              <Text style={styles.insetsLabel}>左侧:</Text>
              <Text style={styles.insetsValue}>{insets.left}px</Text>
            </View>
            <View style={styles.insetsRow}>
              <Text style={styles.insetsLabel}>右侧:</Text>
              <Text style={styles.insetsValue}>{insets.right}px</Text>
            </View>
          </View>
        </View>
        <Text style={styles.description}>
          使用useSafeAreaInsets钩子获取当前设备的安全区域尺寸。
        </Text>
      </View>
    </View>
  );
};

export default SafeAreaDemo;
