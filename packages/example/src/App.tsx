import React, { useState } from 'react';
import {
  RuntimeProvider,
  View,
  Text,
  Button,
  SafeArea,
  Heading1,
  TouchableOpacity,
  createStyles
} from '@cross-platform/components';

// 导入组件展示
import ComponentsShowcase from './components/ComponentsShowcase';

// 主应用组件
const App: React.FC = () => {
  return (
    <RuntimeProvider onReady={(runtime) => console.log('Runtime ready:', runtime.platform)}>
      <SafeArea top bottom style={{ flex: 1 }}>
        <MainContent />
      </SafeArea>
    </RuntimeProvider>
  );
};

// 主要内容组件
const MainContent: React.FC = () => {
  const [showComponentsShowcase, setShowComponentsShowcase] = useState(false);

  const styles = createStyles({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5'
    },
    header: {
      marginBottom: 20,
      alignItems: 'center'
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold' as any,
      marginBottom: 10
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
      marginBottom: 20
    },
    buttonContainer: {
      marginTop: 20
    },
    showcaseButton: {
      backgroundColor: '#1890ff',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center'
    },
    showcaseButtonText: {
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '500' as any
    },
    backButton: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 10,
      backgroundColor: '#1890ff',
      padding: 10,
      borderRadius: 8
    },
    backButtonText: {
      color: '#ffffff'
    }
  });

  if (showComponentsShowcase) {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setShowComponentsShowcase(false)}
        >
          <Text style={styles.backButtonText}>返回主页</Text>
        </TouchableOpacity>
        <ComponentsShowcase />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Heading1>跨端组件库展示</Heading1>
        <Text style={styles.subtitle}>
          查看所有可用的跨平台组件及其用法示例
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.showcaseButton}
          onPress={() => setShowComponentsShowcase(true)}
        >
          <Text style={styles.showcaseButtonText}>查看组件展示</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;