import React from 'react';
import { Text, StyleProp, TextStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import { IconMap, IconName } from './iconMap';

export interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle>;
  testID?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  color,
  style,
  testID
}) => {
  const componentStyles = useComponentStyles('Icon', style);

  const iconStyle = {
    fontSize: size,
    color: color || componentStyles.color,
    ...componentStyles
  };

  return (
    <Text style={iconStyle} testID={testID}>
      {IconMap[name]}
    </Text>
  );
};

export default Icon;
export { IconName };
