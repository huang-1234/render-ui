import React, { useState } from 'react';
import { View, Text, TouchableOpacity, createStyles } from '@cross-platform/components';

const TouchableOpacityDemo: React.FC = () => {
  const [pressCount, setPressCount] = useState(0);
  const [longPressCount, setLongPressCount] = useState(0);
  const [pressInOutState, setPressInOutState] = useState('未按下');

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
    basicTouchable: {
      backgroundColor: '#1890ff',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10
    },
    touchableText: {
      color: '#ffffff',
      fontWeight: '500' as any
    },
    stateContainer: {
      marginTop: 15,
      padding: 10,
      backgroundColor: '#f5f5f5',
      borderRadius: 8
    },
    stateText: {
      marginBottom: 5
    },
    opacityDemoContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    opacityDemo: {
      width: 100,
      height: 50,
      backgroundColor: '#1890ff',
      margin: 5,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center'
    },
    disabledTouchable: {
      backgroundColor: '#bfbfbf'
    },
    customTouchable: {
      backgroundColor: '#52c41a',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      // 自定义样式
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4
    }
  });

  return (
    <View>
      {/* 基础触摸反馈 */}
      <View style={styles.section}>
        <Text style={styles.title}>基础触摸反馈</Text>
        <View style={styles.demoContainer}>
          <TouchableOpacity
            style={styles.basicTouchable}
            onPress={() => setPressCount(pressCount + 1)}
          >
            <Text style={styles.touchableText}>点击我</Text>
          </TouchableOpacity>
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>点击次数: {pressCount}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          TouchableOpacity组件提供了基础的触摸反馈效果，按下时会降低透明度。
        </Text>
      </View>

      {/* 长按事件 */}
      <View style={styles.section}>
        <Text style={styles.title}>长按事件</Text>
        <View style={styles.demoContainer}>
          <TouchableOpacity
            style={styles.basicTouchable}
            onLongPress={() => setLongPressCount(longPressCount + 1)}
            delayLongPress={500} // 500ms后触发长按
          >
            <Text style={styles.touchableText}>长按我</Text>
          </TouchableOpacity>
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>长按次数: {longPressCount}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          TouchableOpacity支持长按事件，可以通过delayLongPress属性设置长按触发的延迟时间。
        </Text>
      </View>

      {/* 按下和抬起事件 */}
      <View style={styles.section}>
        <Text style={styles.title}>按下和抬起事件</Text>
        <View style={styles.demoContainer}>
          <TouchableOpacity
            style={styles.basicTouchable}
            onPressIn={() => setPressInOutState('已按下')}
            onPressOut={() => setPressInOutState('已抬起')}
          >
            <Text style={styles.touchableText}>按下和抬起</Text>
          </TouchableOpacity>
          <View style={styles.stateContainer}>
            <Text style={styles.stateText}>当前状态: {pressInOutState}</Text>
          </View>
        </View>
        <Text style={styles.description}>
          TouchableOpacity提供了onPressIn和onPressOut事件，可以分别在按下和抬起时触发。
        </Text>
      </View>

      {/* 不同的activeOpacity */}
      <View style={styles.section}>
        <Text style={styles.title}>不同的透明度效果</Text>
        <View style={styles.demoContainer}>
          <View style={styles.opacityDemoContainer}>
            <TouchableOpacity
              style={styles.opacityDemo}
              activeOpacity={0.9}
            >
              <Text style={styles.touchableText}>0.9</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.opacityDemo}
              activeOpacity={0.8}
            >
              <Text style={styles.touchableText}>0.8</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.opacityDemo}
              activeOpacity={0.6}
            >
              <Text style={styles.touchableText}>0.6</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.opacityDemo}
              activeOpacity={0.4}
            >
              <Text style={styles.touchableText}>0.4</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.opacityDemo}
              activeOpacity={0.2}
            >
              <Text style={styles.touchableText}>0.2</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text style={styles.description}>
          通过activeOpacity属性可以控制按下时的透明度，值越小，透明度效果越明显。
        </Text>
      </View>

      {/* 禁用状态 */}
      <View style={styles.section}>
        <Text style={styles.title}>禁用状态</Text>
        <View style={styles.demoContainer}>
          <TouchableOpacity
            style={[styles.basicTouchable, styles.disabledTouchable]}
            disabled={true}
            onPress={() => console.log('This will not be called')}
          >
            <Text style={styles.touchableText}>禁用状态</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>
          通过disabled属性可以禁用TouchableOpacity，禁用后不会响应触摸事件。
        </Text>
      </View>

      {/* 自定义样式 */}
      <View style={styles.section}>
        <Text style={styles.title}>自定义样式</Text>
        <View style={styles.demoContainer}>
          <TouchableOpacity
            style={styles.customTouchable}
            onPress={() => console.log('Custom styled touchable pressed')}
          >
            <Text style={styles.touchableText}>自定义样式</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>
          可以为TouchableOpacity添加自定义样式，如阴影、边框等。
        </Text>
      </View>

      {/* 点击区域扩展 */}
      <View style={styles.section}>
        <Text style={styles.title}>点击区域扩展</Text>
        <View style={styles.demoContainer}>
          <TouchableOpacity
            style={[styles.opacityDemo, { width: 80, height: 40 }]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={() => console.log('Extended hit area pressed')}
          >
            <Text style={styles.touchableText}>扩展区域</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.description}>
          通过hitSlop属性可以扩展TouchableOpacity的点击区域，使其超出视觉范围。
        </Text>
      </View>
    </View>
  );
};

export default TouchableOpacityDemo;
