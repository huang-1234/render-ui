// 小程序渲染器类型定义

export type MiniProgramPlatform = 'weapp' | 'alipay' | 'tt' | 'swan';

export interface MiniProgramNavigateOptions {
  url: string;
  success?: () => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

export interface MiniProgramSystemInfo {
  platform: MiniProgramPlatform;
  system: string;
  version: string;
  SDKVersion: string;
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
    width: number;
    height: number;
  };
  brand: string;
  model: string;
  language: string;
  theme: 'light' | 'dark';
}

export interface MiniProgramRequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  dataType?: 'json' | 'text' | 'base64';
  responseType?: 'text' | 'arraybuffer';
}

export interface MiniProgramRequestResponse {
  data: any;
  statusCode: number;
  header: Record<string, string>;
  cookies?: string[];
}

export interface MiniProgramStorageOptions {
  key: string;
  data?: any;
  success?: (result?: any) => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

// 小程序事件类型
export interface MiniProgramBaseEvent {
  type: string;
  timeStamp: number;
  target: {
    id: string;
    dataset: Record<string, any>;
    offsetLeft: number;
    offsetTop: number;
  };
  currentTarget: {
    id: string;
    dataset: Record<string, any>;
    offsetLeft: number;
    offsetTop: number;
  };
  detail: any;
}

export interface MiniProgramTouchEvent extends MiniProgramBaseEvent {
  touches: MiniProgramTouch[];
  changedTouches: MiniProgramTouch[];
}

export interface MiniProgramTouch {
  identifier: number;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
}

// 组件属性类型
export interface MiniProgramViewProps {
  id?: string;
  className?: string;
  style?: string | Record<string, any>;
  'hover-class'?: string;
  'hover-stop-propagation'?: boolean;
  'hover-start-time'?: number;
  'hover-stay-time'?: number;
  bindtap?: (event: MiniProgramBaseEvent) => void;
  bindlongpress?: (event: MiniProgramBaseEvent) => void;
  bindtouchstart?: (event: MiniProgramTouchEvent) => void;
  bindtouchmove?: (event: MiniProgramTouchEvent) => void;
  bindtouchend?: (event: MiniProgramTouchEvent) => void;
  bindtouchcancel?: (event: MiniProgramTouchEvent) => void;
}

export interface MiniProgramTextProps {
  id?: string;
  className?: string;
  style?: string | Record<string, any>;
  selectable?: boolean;
  space?: 'ensp' | 'emsp' | 'nbsp';
  decode?: boolean;
  bindtap?: (event: MiniProgramBaseEvent) => void;
}

export interface MiniProgramImageProps {
  id?: string;
  className?: string;
  style?: string | Record<string, any>;
  src: string;
  mode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'center' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right';
  'lazy-load'?: boolean;
  'fade-in'?: boolean;
  'webp'?: boolean;
  'show-menu-by-longpress'?: boolean;
  bindload?: (event: MiniProgramBaseEvent) => void;
  binderror?: (event: MiniProgramBaseEvent) => void;
  bindtap?: (event: MiniProgramBaseEvent) => void;
}

export interface MiniProgramScrollViewProps {
  id?: string;
  className?: string;
  style?: string | Record<string, any>;
  'scroll-x'?: boolean;
  'scroll-y'?: boolean;
  'upper-threshold'?: number;
  'lower-threshold'?: number;
  'scroll-top'?: number;
  'scroll-left'?: number;
  'scroll-into-view'?: string;
  'scroll-with-animation'?: boolean;
  'enable-back-to-top'?: boolean;
  'enable-flex'?: boolean;
  'scroll-anchoring'?: boolean;
  'refresher-enabled'?: boolean;
  'refresher-threshold'?: number;
  'refresher-default-style'?: 'black' | 'white' | 'none';
  'refresher-background'?: string;
  'refresher-triggered'?: boolean;
  bindscrolltoupper?: (event: MiniProgramBaseEvent) => void;
  bindscrolltolower?: (event: MiniProgramBaseEvent) => void;
  bindscroll?: (event: MiniProgramBaseEvent) => void;
  bindrefresherrefresh?: (event: MiniProgramBaseEvent) => void;
  bindrefresherpulling?: (event: MiniProgramBaseEvent) => void;
  bindrefresherrestore?: (event: MiniProgramBaseEvent) => void;
  bindrefresherabort?: (event: MiniProgramBaseEvent) => void;
}

export interface MiniProgramButtonProps {
  id?: string;
  className?: string;
  style?: string | Record<string, any>;
  size?: 'default' | 'mini';
  type?: 'primary' | 'default' | 'warn';
  plain?: boolean;
  disabled?: boolean;
  loading?: boolean;
  'form-type'?: 'submit' | 'reset';
  'open-type'?: 'contact' | 'share' | 'getPhoneNumber' | 'getUserInfo' | 'launchApp' | 'openSetting' | 'feedback' | 'chooseAvatar';
  'hover-class'?: string;
  'hover-stop-propagation'?: boolean;
  'hover-start-time'?: number;
  'hover-stay-time'?: number;
  lang?: 'en' | 'zh_CN' | 'zh_TW';
  'session-from'?: string;
  'send-message-title'?: string;
  'send-message-path'?: string;
  'send-message-img'?: string;
  'app-parameter'?: string;
  'show-message-card'?: boolean;
  bindtap?: (event: MiniProgramBaseEvent) => void;
  bindgetuserinfo?: (event: MiniProgramBaseEvent) => void;
  bindcontact?: (event: MiniProgramBaseEvent) => void;
  bindgetphonenumber?: (event: MiniProgramBaseEvent) => void;
  binderror?: (event: MiniProgramBaseEvent) => void;
  bindopensetting?: (event: MiniProgramBaseEvent) => void;
  bindlaunchapp?: (event: MiniProgramBaseEvent) => void;
  bindchooseavatar?: (event: MiniProgramBaseEvent) => void;
}

export interface MiniProgramInputProps {
  id?: string;
  className?: string;
  style?: string | Record<string, any>;
  value?: string;
  type?: 'text' | 'number' | 'idcard' | 'digit' | 'safe-password' | 'nickname';
  password?: boolean;
  placeholder?: string;
  'placeholder-style'?: string;
  'placeholder-class'?: string;
  disabled?: boolean;
  maxlength?: number;
  'cursor-spacing'?: number;
  'auto-focus'?: boolean;
  focus?: boolean;
  'confirm-type'?: 'send' | 'search' | 'next' | 'go' | 'done';
  'confirm-hold'?: boolean;
  cursor?: number;
  'selection-start'?: number;
  'selection-end'?: number;
  'adjust-position'?: boolean;
  'hold-keyboard'?: boolean;
  bindinput?: (event: MiniProgramBaseEvent) => void;
  bindfocus?: (event: MiniProgramBaseEvent) => void;
  bindblur?: (event: MiniProgramBaseEvent) => void;
  bindconfirm?: (event: MiniProgramBaseEvent) => void;
  bindkeyboardheightchange?: (event: MiniProgramBaseEvent) => void;
}

// 路由相关类型
export interface MiniProgramRouteConfig {
  path: string;
  component: any;
  meta?: Record<string, any>;
}

export interface MiniProgramRouteInfo {
  path: string;
  params: Record<string, any>;
  component: any;
  meta?: Record<string, any>;
}

// 样式相关类型
export interface MiniProgramStyleSheet {
  [key: string]: Record<string, any>;
}

// 主题类型
export interface MiniProgramTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    warning: string;
    success: string;
    info: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    fontWeight: {
      light: number;
      normal: number;
      medium: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  borderRadius: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
}

// API 相关类型
export interface MiniProgramAPI {
  // 导航
  navigateTo: (options: MiniProgramNavigateOptions) => void;
  redirectTo: (options: MiniProgramNavigateOptions) => void;
  switchTab: (options: MiniProgramNavigateOptions) => void;
  navigateBack: (options: { delta?: number }) => void;
  reLaunch: (options: MiniProgramNavigateOptions) => void;
  
  // 系统信息
  getSystemInfo: (options: {
    success: (res: MiniProgramSystemInfo) => void;
    fail?: (error: any) => void;
    complete?: () => void;
  }) => void;
  getSystemInfoSync: () => MiniProgramSystemInfo;
  
  // 网络请求
  request: (options: MiniProgramRequestOptions & {
    success?: (res: MiniProgramRequestResponse) => void;
    fail?: (error: any) => void;
    complete?: () => void;
  }) => void;
  
  // 存储
  setStorage: (options: MiniProgramStorageOptions) => void;
  getStorage: (options: MiniProgramStorageOptions) => void;
  removeStorage: (options: MiniProgramStorageOptions) => void;
  clearStorage: (options: { success?: () => void; fail?: (error: any) => void; complete?: () => void }) => void;
  
  // UI
  showToast: (options: { title: string; icon?: string; duration?: number; mask?: boolean }) => void;
  showLoading: (options: { title: string; mask?: boolean }) => void;
  hideLoading: () => void;
  showModal: (options: {
    title?: string;
    content: string;
    showCancel?: boolean;
    cancelText?: string;
    confirmText?: string;
    success?: (res: { confirm: boolean; cancel: boolean }) => void;
    fail?: (error: any) => void;
    complete?: () => void;
  }) => void;
}