import React from 'react';
import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { useComponentStyles } from '../../hooks';
import Divider from '../Divider';
import defaultCardStyles from './style';

export interface CardProps {
  title?: React.ReactNode;
  extra?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
  bodyStyle?: StyleProp<ViewStyle>;
  footer?: React.ReactNode;
  footerStyle?: StyleProp<ViewStyle>;
  bordered?: boolean;
  hoverable?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  title,
  extra,
  headerStyle,
  bodyStyle,
  footer,
  footerStyle,
  bordered = true,
  hoverable = false,
  onPress,
  style,
  testID,
  children
}) => {
  const componentStyles = useComponentStyles('Card', style);

  const cardStyles = [
    defaultCardStyles.container,
    bordered && defaultCardStyles.bordered,
    hoverable && defaultCardStyles.hoverable,
    componentStyles,
  ];

  const Wrapper = onPress ? TouchableOpacity : View;
  const wrapperProps = onPress ? { onPress } : {};

  return (
    <Wrapper style={cardStyles} testID={testID} {...wrapperProps}>
      {(title || extra) ? (
        <>
          <View style={[defaultCardStyles.header, headerStyle]}>
            {typeof title === 'string' ? (
              <Text style={defaultCardStyles.title}>{title}</Text>
            ) : (
              title
            )}
            {extra}
          </View>
          <Divider />
        </>
      ) : null}

      <View style={[defaultCardStyles.body, bodyStyle]}>
        {children}
      </View>

      {footer !== undefined ? (
        <>
          <Divider />
          <View style={[defaultCardStyles.footer, footerStyle]}>
            {footer}
          </View>
        </>
      ) : null}
    </Wrapper>
  );
};

export default Card;
