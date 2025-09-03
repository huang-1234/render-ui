import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultTagStyles from './style';
import { theme } from '../../styles/theme';

export type TagType = 'default' | 'primary' | 'success' | 'warning' | 'danger';
export type TagSize = 'small' | 'medium' | 'large';

export interface TagProps {
  type?: TagType;
  size?: TagSize;
  round?: boolean;
  closable?: boolean;
  onClose?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
  children: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({
  type = 'default',
  size = 'medium',
  round = false,
  closable = false,
  onClose,
  style,
  textStyle,
  testID,
  children
}) => {
  const componentStyles = useComponentStyles('Tag', style);

  const tagStyles = [
    defaultTagStyles.container,
    defaultTagStyles[type],
    defaultTagStyles[size],
    {
      borderRadius: round ? 100 : theme.borderRadiusSmall,
    },
    componentStyles,
  ];

  const textStyles = [
    defaultTagStyles.text,
    {
      color: defaultTagStyles[type].color,
    },
    textStyle,
  ];

  return (
    <View style={tagStyles} testID={testID}>
      <Text style={textStyles}>{children}</Text>
      {closable && (
        <TouchableOpacity onPress={onClose} testID={`${testID}-close`}>
          <Text style={[textStyles, defaultTagStyles.closeIcon]}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Tag;
