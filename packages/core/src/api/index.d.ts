/**
 * 将像素值转换为rem单位
 * @param px 像素值
 * @returns rem字符串
 */
export function rem(px: number): string;

/**
 * 将像素值转换为rpx单位
 * @param px 像素值
 * @returns rpx字符串
 */
export function rpx(px: number): string;

/**
 * 获取设备像素比
 * @returns 设备像素比
 */
export function getPixelRatio(): number;

/**
 * 获取屏幕尺寸
 * @returns 屏幕宽高对象
 */
export function getScreenDimensions(): {
  width: number;
  height: number;
  pixelRatio: number;
  windowWidth?: number;
  windowHeight?: number;
};

/**
 * 计算安全区域
 * @returns 安全区域对象
 */
export function getSafeAreaInsets(): {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/**
 * 判断是否为iOS设备
 * @returns 是否为iOS设备
 */
export function isIOS(): boolean;

/**
 * 判断是否为Android设备
 * @returns 是否为Android设备
 */
export function isAndroid(): boolean;

/**
 * 页面跳转
 * @param url 目标URL
 * @param params 参数对象
 */
export function go(url: string, params?: Record<string, any>): void;

/**
 * 返回上一页
 * @param delta 返回的层级数
 */
export function back(delta?: number): void;

/**
 * 重定向到指定页面
 * @param url 目标URL
 * @param params 参数对象
 */
export function redirect(url: string, params?: Record<string, any>): void;

/**
 * 切换到指定Tab
 * @param url Tab URL或名称
 */
export function switchTab(url: string): void;

/**
 * 返回上一页
 * @param delta 返回的层级数
 */
export function navigateBack(delta?: number): void;

/**
 * 获取设备信息
 * @returns 设备信息对象
 */
export function getDeviceInfo(): {
  platform: string;
  version: string | number;
  isTablet?: boolean;
  brand?: string;
  model?: string;
  system?: string;
  userAgent?: string;
  screenWidth?: number;
  screenHeight?: number;
  windowWidth?: number;
  windowHeight?: number;
  statusBarHeight?: number;
  language?: string;
  pixelRatio?: number;
};

/**
 * 获取状态栏高度
 * @returns 状态栏高度
 */
export function getStatusBarHeight(): number;

/**
 * 获取底部安全区域高度
 * @returns 底部安全区域高度
 */
export function getBottomSafeAreaHeight(): number;

/**
 * 像素转换为DP
 * @param px 像素值
 * @returns DP值
 */
export function px2dp(px: number): number;

/**
 * DP转换为像素
 * @param dp DP值
 * @returns 像素值
 */
export function dp2px(dp: number): number;
