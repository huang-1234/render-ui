import React from 'react';
import { Text, StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultTypographyStyles from './style';

export type TypographyType = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
export type TypographySize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface TypographyProps {
  type?: TypographyType;
  size?: TypographySize;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  delete?: boolean;
  center?: boolean;
  style?: StyleProp<TextStyle>;
  testID?: string;
  children: React.ReactNode;
}
const simpleElement = ['string', 'number', 'boolean', 'null', 'undefined', 'symbol'];

const Typography: React.FC<TypographyProps> = ({
  type = 'primary',
  size = 'md',
  bold = false,
  italic = false,
  underline = false,
  delete: deleted = false,
  center = false,
  style,
  testID,
  children
}) => {
  const componentStyles = useComponentStyles('Typography', style);

  const styleView: StyleProp<ViewStyle> = [
    componentStyles.container,
    defaultTypographyStyles[type],
    defaultTypographyStyles[size],
    bold && defaultTypographyStyles.bold,
    center && defaultTypographyStyles.center,
  ];

  const textStyles: StyleProp<TextStyle> = [
    defaultTypographyStyles.container,
    defaultTypographyStyles[type],
    defaultTypographyStyles[size],
    bold && defaultTypographyStyles.bold,
    center && defaultTypographyStyles.center,
    {
      fontStyle: italic ? 'italic' : 'normal',
      textDecorationLine: underline ? 'underline' : deleted ? 'line-through' : 'none',
    },
    style,
  ];

  return (
    <View style={styleView} testID={testID}>
      {simpleElement.includes(typeof children) ? <Text style={textStyles}>{children}</Text> : children}
    </View>
  );
};

export default Typography;
