import React from 'react';
import { View, StyleProp, ViewStyle, Platform } from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultSvgStyles from './style';

// 尝试导入 react-native-svg
let SvgComponent: any = null;
let SvgPath: any = null;
let SvgCircle: any = null;
let SvgRect: any = null;
let SvgLine: any = null;
let SvgEllipse: any = null;
let SvgPolygon: any = null;
let SvgPolyline: any = null;
let SvgG: any = null;
let SvgText: any = null;

try {
  // 动态导入，如果没有安装 react-native-svg，不会导致应用崩溃
  const RNSvg = require('react-native-svg');
  SvgComponent = RNSvg.Svg;
  SvgPath = RNSvg.Path;
  SvgCircle = RNSvg.Circle;
  SvgRect = RNSvg.Rect;
  SvgLine = RNSvg.Line;
  SvgEllipse = RNSvg.Ellipse;
  SvgPolygon = RNSvg.Polygon;
  SvgPolyline = RNSvg.Polyline;
  SvgG = RNSvg.G;
  SvgText = RNSvg.Text;
} catch (e) {
  // 如果没有安装 react-native-svg，使用空组件
  console.warn('react-native-svg is not installed. SVG components will render as empty views.');
}

export interface SvgProps {
  width?: number | string;
  height?: number | string;
  viewBox?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  children?: React.ReactNode;
}

// Svg 主组件
const Svg: React.FC<SvgProps> = ({
  width = 24,
  height = 24,
  viewBox = '0 0 24 24',
  fill = 'none',
  stroke = 'currentColor',
  strokeWidth = 2,
  color,
  style,
  testID,
  children,
}) => {
  const componentStyles = useComponentStyles('Svg', style);

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  if (!SvgComponent) {
    // 如果没有 react-native-svg，返回空的 View
    return (
      <View
        style={[defaultSvgStyles.container, { width, height }, componentStyles]}
        testID={testID}
        {...webProps}
      />
    );
  }

  return (
    <SvgComponent
      width={width}
      height={height}
      viewBox={viewBox}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      color={color}
      style={[defaultSvgStyles.container, componentStyles]}
      testID={testID}
      {...webProps}
    >
      {children}
    </SvgComponent>
  );
};

// 导出子组件
export const Path = (props: any) => {
  if (!SvgPath) return null;
  return <SvgPath {...props} />;
};

export const Circle = (props: any) => {
  if (!SvgCircle) return null;
  return <SvgCircle {...props} />;
};

export const Rect = (props: any) => {
  if (!SvgRect) return null;
  return <SvgRect {...props} />;
};

export const Line = (props: any) => {
  if (!SvgLine) return null;
  return <SvgLine {...props} />;
};

export const Ellipse = (props: any) => {
  if (!SvgEllipse) return null;
  return <SvgEllipse {...props} />;
};

export const Polygon = (props: any) => {
  if (!SvgPolygon) return null;
  return <SvgPolygon {...props} />;
};

export const Polyline = (props: any) => {
  if (!SvgPolyline) return null;
  return <SvgPolyline {...props} />;
};

export const G = (props: any) => {
  if (!SvgG) return null;
  return <SvgG {...props} />;
};

export const Text = (props: any) => {
  if (!SvgText) return null;
  return <SvgText {...props} />;
};

// 为了方便使用，将子组件挂载到 Svg 上
const SvgWithSubComponents = Svg as any;
SvgWithSubComponents.Path = Path;
SvgWithSubComponents.Circle = Circle;
SvgWithSubComponents.Rect = Rect;
SvgWithSubComponents.Line = Line;
SvgWithSubComponents.Ellipse = Ellipse;
SvgWithSubComponents.Polygon = Polygon;
SvgWithSubComponents.Polyline = Polyline;
SvgWithSubComponents.G = G;
SvgWithSubComponents.Text = Text;

export default SvgWithSubComponents;
