// H5 渲染器类型定义

export interface H5NavigateOptions {
  url: string;
  success?: () => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

export interface H5SystemInfo {
  platform: 'h5';
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
  userAgent: string;
  language: string;
  theme: 'light' | 'dark';
}

export interface H5RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  header?: Record<string, string>;
  timeout?: number;
  responseType?: 'text' | 'json' | 'blob' | 'arraybuffer';
  withCredentials?: boolean;
}

export interface H5RequestResponse {
  data: any;
  statusCode: number;
  header: Record<string, string>;
}

export interface H5StorageOptions {
  key: string;
  data?: any;
  success?: (result?: any) => void;
  fail?: (error: any) => void;
  complete?: () => void;
}

// 事件类型
export interface H5TouchEvent {
  type: string;
  timeStamp: number;
  touches: H5Touch[];
  changedTouches: H5Touch[];
  target: EventTarget;
  currentTarget: EventTarget;
  preventDefault: () => void;
  stopPropagation: () => void;
}

export interface H5Touch {
  identifier: number;
  clientX: number;
  clientY: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  radiusX?: number;
  radiusY?: number;
  rotationAngle?: number;
  force?: number;
}

// 组件属性扩展
export interface H5ViewProps {
  className?: string;
  id?: string;
  role?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  tabIndex?: number;
  draggable?: boolean;
  onDragStart?: (event: DragEvent) => void;
  onDragEnd?: (event: DragEvent) => void;
  onDrop?: (event: DragEvent) => void;
  onDragOver?: (event: DragEvent) => void;
}

export interface H5TextProps extends H5ViewProps {
  contentEditable?: boolean;
  spellCheck?: boolean;
  dir?: 'ltr' | 'rtl' | 'auto';
  lang?: string;
}

export interface H5ImageProps extends H5ViewProps {
  alt?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
  decoding?: 'sync' | 'async' | 'auto';
  loading?: 'eager' | 'lazy';
  referrerPolicy?: string;
  sizes?: string;
  srcSet?: string;
  useMap?: string;
}

// 路由相关类型
export interface H5RouteConfig {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
  meta?: Record<string, any>;
  children?: H5RouteConfig[];
}

export interface H5RouteInfo {
  path: string;
  params: Record<string, any>;
  query: Record<string, string>;
  hash: string;
  component: React.ComponentType<any>;
  meta?: Record<string, any>;
}

// 样式相关类型
export interface H5StyleSheet {
  [key: string]: React.CSSProperties;
}

export interface H5MediaQuery {
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  orientation?: 'portrait' | 'landscape';
  prefersColorScheme?: 'light' | 'dark';
}

export interface H5ResponsiveStyle {
  base: React.CSSProperties;
  sm?: React.CSSProperties;
  md?: React.CSSProperties;
  lg?: React.CSSProperties;
  xl?: React.CSSProperties;
}

// 主题类型
export interface H5Theme {
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
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  breakpoints: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}