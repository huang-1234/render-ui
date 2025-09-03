import React, { ReactNode } from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultGridStyles from './style';

export interface GridProps {
  columns?: number;
  gap?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children: ReactNode;
}

const Grid: React.FC<GridProps> = ({
  columns = 4,
  gap = 8,
  style,
  testID,
  children
}) => {
  const componentStyles = useComponentStyles('Grid', style);

  const gridStyles = [
    defaultGridStyles.container,
    {
      marginHorizontal: -gap / 2,
    },
    componentStyles,
  ];

  const itemStyle = {
    width: `${100 / columns}%`,
    padding: gap / 2,
  };

  return (
    <View style={gridStyles} testID={testID}>
      {React.Children.map(children, (child, index) => (
        <View key={index} style={[defaultGridStyles.item, itemStyle]}>
          {child}
        </View>
      ))}
    </View>
  );
};

export default Grid;
