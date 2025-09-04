import React from 'react';
import {
  RuntimeProvider,
  View,
  Text,
  Button,
  SafeArea,
  Heading1,
  Heading2,
  Paragraph,
  useNavigation,
  useUI,
  useDevice,
  usePlatform,
  useSystemInfo,
  createStyles
} from '@cross-platform/components';

// 主应用组件
const App: React.FC = () => {
  return (
    <RuntimeProvider onReady={(runtime) => console.log('Runtime ready:', runtime.platform)}>
      <SafeArea top bottom>
        <MainContent />
      </SafeArea>
    </RuntimeProvider>
  );
};

// 主要内容组件
const MainContent: React.FC = () => {
  const platform = usePlatform();
  const systemInfo = useSystemInfo();
  const navigation = useNavigation();
  const ui = useUI();
  const device = useDevice();

  const styles = createStyles({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5'
    },
    header: {
      marginBottom: 30,
      alignItems: 'center'
    },
    section: {
      marginBottom: 20,
      padding: 15,
      backgroundColor: '#ffffff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2
    },
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginTop: 10
    },
    infoText: {
      fontSize: 12,
      color: '#666',
      marginTop: 5
    },
    platformBadge: {
      backgroundColor: '#1890ff',
      color: '#ffffff',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      fontSize: 12,
      fontWeight: 'bold'
    }
  });

  // 测试导航功能
  const handleNavigation = async () => {
    try {
      await ui.showToast({ title: '导航功能测试', icon: 'success' });
      // 这里可以添加实际的导航逻辑
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // 测试设备功能
  const handleDeviceTest = async () => {
    try {
      await device.vibrateShort();
      await ui.showToast({ title: '设备震动测试', icon: 'success' });
    } catch (error) {
      console.error('Device test error:', error);
    }
  };

  // 测试剪贴板功能
  const handleClipboardTest = async () => {
    try {
      await device.setClipboardData('Hello Cross Platform!');
      await ui.showToast({ title: '已复制到剪贴板', icon: 'success' });
    } catch (error) {
      console.error('Clipboard test error:', error);
    }
  };

  // 测试模态框
  const handleModalTest = async () => {
    try {
      const result = await ui.showModal({
        title: '确认操作',
        content: '这是一个跨端模态框测试',
        showCancel: true
      });

      if (result.confirm) {
        await ui.showToast({ title: '用户确认', icon: 'success' });
      } else {
        await ui.showToast({ title: '用户取消', icon: 'none' });
      }
    } catch (error) {
      console.error('Modal test error:', error);
    }
  };

  // 测试图片选择
  const handleImageTest = async () => {
    try {
      await ui.showLoading({ title: '选择图片中...' });
      const result = await device.chooseImage({ count: 1 });
      await ui.hideLoading();

      if (result.tempFilePaths.length > 0) {
        await ui.showToast({ title: `选择了 ${result.tempFilePaths.length} 张图片`, icon: 'success' });
      }
    } catch (error) {
      await ui.hideLoading();
      console.error('Image test error:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* 头部信息 */}
      <View style={styles.header}>
        <Heading1>跨端框架示例</Heading1>
        <View style={{ marginTop: 10 }}>
          <Text style={styles.platformBadge}>
            当前平台: {platform.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* 系统信息 */}
      <View style={styles.section}>
        <Heading2>系统信息</Heading2>
        {systemInfo ? (
          <View>
            <Text style={styles.infoText}>
              屏幕尺寸: {systemInfo.screenWidth} x {systemInfo.screenHeight}
            </Text>
            <Text style={styles.infoText}>
              窗口尺寸: {systemInfo.windowWidth} x {systemInfo.windowHeight}
            </Text>
            <Text style={styles.infoText}>
              像素比: {systemInfo.pixelRatio}
            </Text>
            <Text style={styles.infoText}>
              状态栏高度: {systemInfo.statusBarHeight}px
            </Text>
            <Text style={styles.infoText}>
              系统版本: {systemInfo.version}
            </Text>
          </View>
        ) : (
          <Text style={styles.infoText}>加载系统信息中...</Text>
        )}
      </View>

      {/* 基础组件展示 */}
      <View style={styles.section}>
        <Heading2>基础组件</Heading2>
        <Paragraph>这里展示了跨端框架的基础组件，包括文本、按钮等。</Paragraph>

        <View style={styles.buttonContainer}>
          <Button type="primary" size="small">
            主要按钮
          </Button>
          <Button type="secondary" size="small">
            次要按钮
          </Button>
          <Button type="success" size="small">
            成功按钮
          </Button>
          <Button type="warning" size="small">
            警告按钮
          </Button>
          <Button type="error" size="small">
            错误按钮
          </Button>
        </View>
      </View>

      {/* 功能测试 */}
      <View style={styles.section}>
        <Heading2>功能测试</Heading2>
        <Paragraph>测试跨端框架提供的各种功能 API。</Paragraph>

        <View style={styles.buttonContainer}>
          <Button
            type="primary"
            size="medium"
            onPress={handleNavigation}
          >
            导航测试
          </Button>

          <Button
            type="secondary"
            size="medium"
            onPress={handleDeviceTest}
          >
            设备震动
          </Button>

          <Button
            type="info"
            size="medium"
            onPress={handleClipboardTest}
          >
            剪贴板
          </Button>

          <Button
            type="warning"
            size="medium"
            onPress={handleModalTest}
          >
            模态框
          </Button>

          <Button
            type="success"
            size="medium"
            onPress={handleImageTest}
          >
            选择图片
          </Button>
        </View>
      </View>

      {/* 样式展示 */}
      <View style={styles.section}>
        <Heading2>样式系统</Heading2>
        <Paragraph>展示跨端样式系统的能力，包括主题、响应式等。</Paragraph>

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 10
        }}>
          <View style={{
            width: 60,
            height: 60,
            backgroundColor: '#1890ff',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#ffffff', fontSize: 12 }}>主色</Text>
          </View>

          <View style={{
            width: 60,
            height: 60,
            backgroundColor: '#52c41a',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#ffffff', fontSize: 12 }}>成功</Text>
          </View>

          <View style={{
            width: 60,
            height: 60,
            backgroundColor: '#faad14',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#ffffff', fontSize: 12 }}>警告</Text>
          </View>

          <View style={{
            width: 60,
            height: 60,
            backgroundColor: '#f5222d',
            borderRadius: 8,
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Text style={{ color: '#ffffff', fontSize: 12 }}>错误</Text>
          </View>
        </View>
      </View>

      {/* 平台特性 */}
      <View style={styles.section}>
        <Heading2>平台特性</Heading2>
        <Paragraph>
          当前运行在 {platform} 平台上，框架会自动适配不同平台的特性和限制。
        </Paragraph>

        {platform === 'h5' && (
          <Text style={styles.infoText}>
            • 支持现代浏览器特性
            • 响应式设计
            • PWA 支持
          </Text>
        )}

        {platform === 'rn' && (
          <Text style={styles.infoText}>
            • 原生性能
            • 手势识别
            • 原生模块集成
          </Text>
        )}

        {(platform === 'weapp' || platform === 'alipay' || platform === 'tt') && (
          <Text style={styles.infoText}>
            • 小程序生态
            • 快速启动
            • 平台特定 API
          </Text>
        )}
      </View>
    </View>
  );
};

export default App;