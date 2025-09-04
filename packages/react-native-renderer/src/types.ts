// React Native 渲染器类型定义
import { 
  ViewStyle, 
  TextStyle, 
  ImageStyle, 
  GestureResponderEvent,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  TextInputChangeEventData
} from 'react-native';

export interface ReactNativeNavigateOptions {
  url: string;
  success?: () => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

export interface ReactNativeSystemInfo {
  platform: 'rn';
  system: string;
  version: string;
  screenWidth: number;
  screenHeight: number;
  windowWidth: number;
  windowHeight: number;
  pixelRatio: number;
  statusBarHeight: number;
  safeArea: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  brand: string;
  model: string;
}

export interface ReactNativeRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
}

export interface ReactNativeRequestResponse {
  data: any;
  statusCode: number;
  header: Record<string, string>;
}

// 组件属性类型
export interface ReactNativeViewProps {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLayout?: (event: any) => void;
  pointerEvents?: 'box-none' | 'none' | 'box-only' | 'auto';
  removeClippedSubviews?: boolean;
  hitSlop?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
}

export interface ReactNativeTextProps {
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
  selectable?: boolean;
  allowFontScaling?: boolean;
  maxFontSizeMultiplier?: number;
  minimumFontScale?: number;
  suppressHighlighting?: boolean;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onLayout?: (event: any) => void;
}

export interface ReactNativeImageProps {
  style?: ImageStyle | ImageStyle[];
  source: { uri: string } | number;
  defaultSource?: { uri: string } | number;
  loadingIndicatorSource?: { uri: string } | number;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
  resizeMethod?: 'auto' | 'resize' | 'scale';
  fadeDuration?: number;
  progressiveRenderingEnabled?: boolean;
  borderRadius?: number;
  borderTopLeftRadius?: number;
  borderTopRightRadius?: number;
  borderBottomLeftRadius?: number;
  borderBottomRightRadius?: number;
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  onLoad?: (event: any) => void;
  onLoadStart?: (event: any) => void;
  onLoadEnd?: (event: any) => void;
  onError?: (event: any) => void;
  onProgress?: (event: any) => void;
  onLayout?: (event: any) => void;
}

export interface ReactNativeScrollViewProps {
  style?: ViewStyle | ViewStyle[];
  contentContainerStyle?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  bounces?: boolean;
  bouncesZoom?: boolean;
  alwaysBounceHorizontal?: boolean;
  alwaysBounceVertical?: boolean;
  pagingEnabled?: boolean;
  scrollEnabled?: boolean;
  scrollEventThrottle?: number;
  decelerationRate?: 'fast' | 'normal' | number;
  directionalLockEnabled?: boolean;
  canCancelContentTouches?: boolean;
  keyboardDismissMode?: 'none' | 'interactive' | 'on-drag';
  keyboardShouldPersistTaps?: 'always' | 'never' | 'handled';
  maximumZoomScale?: number;
  minimumZoomScale?: number;
  pinchGestureEnabled?: boolean;
  scrollsToTop?: boolean;
  snapToAlignment?: 'start' | 'center' | 'end';
  snapToInterval?: number;
  snapToOffsets?: number[];
  snapToStart?: boolean;
  snapToEnd?: boolean;
  contentInset?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
  contentOffset?: {
    x: number;
    y: number;
  };
  refreshControl?: React.ReactElement;
  removeClippedSubviews?: boolean;
  zoomScale?: number;
  testID?: string;
  onScroll?: (event: any) => void;
  onScrollBeginDrag?: (event: any) => void;
  onScrollEndDrag?: (event: any) => void;
  onMomentumScrollBegin?: (event: any) => void;
  onMomentumScrollEnd?: (event: any) => void;
  onContentSizeChange?: (contentWidth: number, contentHeight: number) => void;
  onLayout?: (event: any) => void;
}

export interface ReactNativeTouchableOpacityProps {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  activeOpacity?: number;
  disabled?: boolean;
  hitSlop?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
  pressRetentionOffset?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
  };
  testID?: string;
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  onPress?: (event: GestureResponderEvent) => void;
  onLongPress?: (event: GestureResponderEvent) => void;
  onPressIn?: (event: GestureResponderEvent) => void;
  onPressOut?: (event: GestureResponderEvent) => void;
  onLayout?: (event: any) => void;
}

export interface ReactNativeSafeAreaViewProps {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
  edges?: Array<'top' | 'bottom' | 'left' | 'right'>;
  testID?: string;
}

export interface ReactNativeTextInputProps {
  style?: TextStyle | TextStyle[];
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  editable?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'ascii-capable' | 'numbers-and-punctuation' | 'url' | 'number-pad' | 'phone-pad' | 'name-phone-pad' | 'decimal-pad' | 'twitter' | 'web-search' | 'visible-password';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send' | 'none' | 'previous' | 'default' | 'emergency-call' | 'google' | 'join' | 'route' | 'yahoo';
  returnKeyLabel?: string;
  maxLength?: number;
  numberOfLines?: number;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  autoFocus?: boolean;
  blurOnSubmit?: boolean;
  caretHidden?: boolean;
  contextMenuHidden?: boolean;
  clearButtonMode?: 'never' | 'while-editing' | 'unless-editing' | 'always';
  clearTextOnFocus?: boolean;
  dataDetectorTypes?: Array<'phoneNumber' | 'link' | 'address' | 'calendarEvent' | 'none' | 'all'>;
  enablesReturnKeyAutomatically?: boolean;
  keyboardAppearance?: 'default' | 'light' | 'dark';
  passwordRules?: string;
  rejectResponderTermination?: boolean;
  secureTextEntry?: boolean;
  selection?: {
    start: number;
    end?: number;
  };
  selectionColor?: string;
  selectTextOnFocus?: boolean;
  spellCheck?: boolean;
  textContentType?: 'none' | 'URL' | 'addressCity' | 'addressCityAndState' | 'addressState' | 'countryName' | 'creditCardNumber' | 'emailAddress' | 'familyName' | 'fullStreetAddress' | 'givenName' | 'jobTitle' | 'location' | 'middleName' | 'name' | 'namePrefix' | 'nameSuffix' | 'nickname' | 'organizationName' | 'postalCode' | 'streetAddressLine1' | 'streetAddressLine2' | 'sublocality' | 'telephoneNumber' | 'username' | 'password' | 'newPassword' | 'oneTimeCode';
  testID?: string;
  underlineColorAndroid?: string;
  inlineImageLeft?: string;
  inlineImagePadding?: number;
  importantForAutofill?: 'auto' | 'no' | 'noExcludeDescendants' | 'yes' | 'yesExcludeDescendants';
  showSoftInputOnFocus?: boolean;
  textAlign?: 'left' | 'center' | 'right';
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  includeFontPadding?: boolean;
  onBlur?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onFocus?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onChange?: (event: NativeSyntheticEvent<TextInputChangeEventData>) => void;
  onChangeText?: (text: string) => void;
  onContentSizeChange?: (event: any) => void;
  onEndEditing?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onKeyPress?: (event: any) => void;
  onLayout?: (event: any) => void;
  onScroll?: (event: any) => void;
  onSelectionChange?: (event: any) => void;
  onSubmitEditing?: (event: NativeSyntheticEvent<TextInputFocusEventData>) => void;
  onTextInput?: (event: any) => void;
}

// 路由相关类型
export interface ReactNativeRouteConfig {
  path: string;
  component: React.ComponentType<any>;
  options?: any;
  meta?: Record<string, any>;
}

export interface ReactNativeRouteInfo {
  path: string;
  params: Record<string, any>;
  component: React.ComponentType<any>;
  meta?: Record<string, any>;
}

// 导航相关类型
export interface ReactNativeNavigationState {
  index: number;
  routes: Array<{
    key: string;
    name: string;
    params?: Record<string, any>;
  }>;
}

export interface ReactNativeNavigationOptions {
  title?: string;
  headerShown?: boolean;
  headerTitle?: string;
  headerTitleAlign?: 'left' | 'center';
  headerTitleStyle?: TextStyle;
  headerStyle?: ViewStyle;
  headerTintColor?: string;
  headerBackTitle?: string;
  headerBackTitleVisible?: boolean;
  headerLeft?: () => React.ReactNode;
  headerRight?: () => React.ReactNode;
  gestureEnabled?: boolean;
  animationEnabled?: boolean;
  presentation?: 'card' | 'modal' | 'transparentModal';
  orientation?: 'default' | 'all' | 'portrait' | 'portrait_up' | 'portrait_down' | 'landscape' | 'landscape_left' | 'landscape_right';
}

// 样式相关类型
export type ReactNativeStyle = ViewStyle | TextStyle | ImageStyle;

export interface ReactNativeStyleSheet {
  [key: string]: ReactNativeStyle;
}

export interface ReactNativeTheme {
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
  };
  dark: boolean;
}

// 动画相关类型
export interface ReactNativeAnimationConfig {
  duration?: number;
  delay?: number;
  easing?: (value: number) => number;
  useNativeDriver?: boolean;
}

export interface ReactNativeSpringConfig {
  tension?: number;
  friction?: number;
  speed?: number;
  bounciness?: number;
  useNativeDriver?: boolean;
}

// 手势相关类型
export interface ReactNativeGestureState {
  dx: number;
  dy: number;
  moveX: number;
  moveY: number;
  x0: number;
  y0: number;
  vx: number;
  vy: number;
  numberActiveTouches: number;
}

export interface ReactNativePanGestureHandlerEventData {
  x: number;
  y: number;
  absoluteX: number;
  absoluteY: number;
  translationX: number;
  translationY: number;
  velocityX: number;
  velocityY: number;
  state: number;
}