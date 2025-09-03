import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Box, Button, Typography, Divider } from '../src/components';
import ComponentShowcase from './ComponentShowcase';
import SideBarExample from './SideBar';
import VirtualListExample from './VirtualList';

type Page = 'showcase' | 'sidebar' | 'virtuallist';

const App = () => {
  const [currentPage, setCurrentPage] = useState<Page>('sidebar');

  const renderPage = () => {
    switch (currentPage) {
      case 'showcase':
        return <ComponentShowcase />;
      case 'sidebar':
        return <SideBarExample />;
      case 'virtuallist':
        return <VirtualListExample />;
      default:
        return <ComponentShowcase />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Box style={styles.header}>
        <Typography size="xl" bold>
          React Native 跨端组件库
        </Typography>
      </Box>

      <Divider />

      <Box row style={styles.navigation}>
        <Button
          onPress={() => setCurrentPage('showcase')}
          style={[
            styles.navButton,
            currentPage === 'showcase' && styles.activeNavButton
          ]}
        >
          组件展示
        </Button>
        <Button
          onPress={() => setCurrentPage('sidebar')}
          style={[
            styles.navButton,
            currentPage === 'sidebar' && styles.activeNavButton
          ]}
        >
          侧边栏菜单
        </Button>
        <Button
          onPress={() => setCurrentPage('virtuallist')}
          style={[
            styles.navButton,
            currentPage === 'virtuallist' && styles.activeNavButton
          ]}
        >
          瀑布流列表
        </Button>
      </Box>

      <View style={styles.content}>
        {renderPage()}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navigation: {
    padding: 8,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  navButton: {
    marginHorizontal: 8,
  },
  activeNavButton: {
    backgroundColor: '#1890ff',
  },
  content: {
    flex: 1,
  },
});

export default App;
