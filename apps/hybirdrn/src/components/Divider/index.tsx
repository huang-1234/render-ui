import React from 'react';
import { View, StyleProp, ViewStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultDividerStyles from './style';

export interface DividerProps {
  direction?: 'horizontal' | 'vertical';
  color?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

const Divider: React.FC<DividerProps> = ({
  direction = 'horizontal',
  color,
  size = 1,
  style,
  testID
}) => {
  const componentStyles = useComponentStyles('Divider', style);

  const dividerStyles = [
    defaultDividerStyles.container,
    defaultDividerStyles[direction],
    {
      ...(color && { backgroundColor: color }),
      ...(direction === 'horizontal'
        ? { height: size }
        : { width: size }),
    },
    style,
  ];

  return <View style={dividerStyles} testID={testID} />;
};

export default Divider;
