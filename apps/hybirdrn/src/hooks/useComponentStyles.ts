import { useMemo } from 'react';
import { StyleSheet, type StyleProp } from 'react-native';
import { defaultBoxStyles } from '../components/Box/style';
import { defaultTextStyles } from '../components/Text/style';
import { defaultButtonStyles } from '../components/Button/style';
import { defaultTabsStyles } from '../components/Tabs/style';
import { theme } from '../styles/theme';

type ComponentName = 'Box' | 'Text' | 'Button' | 'Tabs' | 'Icon' | 'Typography' | 'Divider' | 'Grid' | 'Tag' | 'Card' | 'SideBar' | 'Svg' | 'VirtualList';

type ComponentStyles = {
  [key in ComponentName]: Record<string, any>;
};

export const useComponentStyles = <T>(componentName: ComponentName, style?: StyleProp<T>) => {
  return useMemo(() => {
    // 根据 componentName 获取默认样式
    const defaultStyles: ComponentStyles = {
      Box: defaultBoxStyles,
      Text: defaultTextStyles,
      Button: defaultButtonStyles,
      Tabs: defaultTabsStyles,
      Icon: {
        color: theme.colorText,
        fontSize: theme.fontSizeBase,
      },
      Typography: {
        color: theme.colorText,
        fontSize: theme.fontSizeBase,
      },
      Divider: {
        backgroundColor: theme.colorBorder,
        height: 1,
        width: '100%',
      },
      Grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
      },
      Tag: {
        backgroundColor: theme.colorBackground,
        borderRadius: theme.borderRadiusSmall,
        paddingVertical: theme.spacingXs,
        paddingHorizontal: theme.spacingSmall,
      },
      Card: {
        backgroundColor: theme.colorWhite,
        borderRadius: theme.borderRadiusBase,
        borderWidth: 1,
        borderColor: theme.colorBorder,
        padding: theme.spacingMedium,
      },
      SideBar: {
        backgroundColor: theme.colorWhite,
        width: 250,
        height: '100%',
      },
      Svg: {
        alignItems: 'center',
        justifyContent: 'center',
      },
      VirtualList: {
        flex: 1,
        width: '100%',
      },
    };

    const componentDefaultStyles = defaultStyles[componentName] || {};
    return StyleSheet.flatten([componentDefaultStyles, style]);
  }, [componentName, style]);
};

export default useComponentStyles;
