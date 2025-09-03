import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleProp,
  ViewStyle,
  TextStyle,
  BackHandler,
  Platform,
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultSideBarStyles from './style';
import { useNativeDriver } from '../../env/native';
import { Icon } from '../';

export interface MenuItem {
  key: string;
  title: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  children?: MenuItem[];
  expanded?: boolean;
}

export interface SideBarProps {
  visible?: boolean;
  title?: string;
  items: MenuItem[];
  activeKey?: string;
  onClose?: () => void;
  onItemPress?: (key: string) => void;
  headerStyle?: StyleProp<ViewStyle>;
  headerTitleStyle?: StyleProp<TextStyle>;
  menuItemStyle?: StyleProp<ViewStyle>;
  menuItemTextStyle?: StyleProp<TextStyle>;
  footer?: React.ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const SideBar: React.FC<SideBarProps> = ({
  visible = false,
  title = '菜单',
  items = [],
  activeKey,
  onClose,
  onItemPress,
  headerStyle,
  headerTitleStyle,
  menuItemStyle,
  menuItemTextStyle,
  footer,
  footerStyle,
  style,
  testID,
}) => {
  const componentStyles = useComponentStyles('SideBar', style);
  const [animation] = useState(new Animated.Value(visible ? 0 : -250));
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 0 : -250,
      duration: 300,
      useNativeDriver: useNativeDriver,
    }).start();

    // 在 Android 上处理返回键
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (visible && onClose) {
          onClose();
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, [visible, animation, onClose]);

  // 初始化展开状态
  useEffect(() => {
    const initialExpandedState: Record<string, boolean> = {};
    items.forEach(item => {
      if (item.expanded && item.children?.length) {
        initialExpandedState[item.key] = true;
      }
    });
    setExpandedItems(initialExpandedState);
  }, [items]);

  const toggleSubmenu = useCallback((key: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  }, []);

  const handleOverlayPress = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleItemPress = (key: string, item: MenuItem) => {
    if (onItemPress) {
      onItemPress(key);
    }
    if (item.onPress) {
      item.onPress();
    }
  };

  // 如果侧边栏不可见，则不渲染
  if (!visible) {
    return null;
  }

  return (
    <View style={defaultSideBarStyles.overlay} testID={testID}>
      <TouchableOpacity
        style={defaultSideBarStyles.overlay}
        onPress={handleOverlayPress}
        activeOpacity={1}
        testID={`${testID}-overlay`}
      />
      <Animated.View
        style={[
          defaultSideBarStyles.sidebar,
          { transform: [{ translateX: animation }] },
          componentStyles,
        ]}
        testID={`${testID}-content`}
      >
        <View style={[defaultSideBarStyles.header, headerStyle]}>
          <Text style={[defaultSideBarStyles.headerTitle, headerTitleStyle]}>{title}</Text>
        </View>

        <View style={defaultSideBarStyles.menuContainer}>
          {items.map((item) => {
            const isActive = item.key === activeKey;
            const hasChildren = item.children && item.children.length > 0;
            const isExpanded = expandedItems[item.key];

            return (
              <React.Fragment key={item.key}>
                <TouchableOpacity
                  style={[
                    defaultSideBarStyles.menuItem,
                    isActive && !hasChildren && defaultSideBarStyles.menuItemActive,
                    menuItemStyle,
                  ]}
                  onPress={() => {
                    if (hasChildren) {
                      toggleSubmenu(item.key);
                    } else {
                      handleItemPress(item.key, item);
                    }
                  }}
                  testID={`${testID}-item-${item.key}`}
                >
                  {item.icon && (
                    <View style={defaultSideBarStyles.menuItemIcon}>{item.icon}</View>
                  )}
                  <View style={defaultSideBarStyles.menuItemContent}>
                    <Text
                      style={[
                        defaultSideBarStyles.menuItemText,
                        isActive && !hasChildren && defaultSideBarStyles.menuItemTextActive,
                        menuItemTextStyle,
                      ]}
                    >
                      {item.title}
                    </Text>
                    {hasChildren && (
                      <Text style={defaultSideBarStyles.expandIcon}>
                        {isExpanded ? '▼' : '▶'}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>

                {/* 子菜单 */}
                {hasChildren && isExpanded && (
                  <View style={defaultSideBarStyles.submenu}>
                    {item.children?.map((subItem) => {
                      const isSubItemActive = subItem.key === activeKey;
                      return (
                        <TouchableOpacity
                          key={subItem.key}
                          style={[
                            defaultSideBarStyles.menuItem,
                            defaultSideBarStyles.submenuItem,
                            isSubItemActive && defaultSideBarStyles.submenuItemActive,
                            menuItemStyle,
                          ]}
                          onPress={() => handleItemPress(subItem.key, subItem)}
                          testID={`${testID}-subitem-${subItem.key}`}
                        >
                          {subItem.icon && (
                            <View style={defaultSideBarStyles.menuItemIcon}>{subItem.icon}</View>
                          )}
                          <Text
                            style={[
                              defaultSideBarStyles.menuItemText,
                              isSubItemActive && defaultSideBarStyles.menuItemTextActive,
                              menuItemTextStyle,
                            ]}
                          >
                            {subItem.title}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </React.Fragment>
            );
          })}
        </View>

        {footer && (
          <View style={[defaultSideBarStyles.footer, footerStyle]}>{footer}</View>
        )}
      </Animated.View>
    </View>
  );
};

export default React.memo(SideBar);
