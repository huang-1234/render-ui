declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

// @ts-ignore
declare const process: {
  env: {
    TARO_ENV: 'weapp' | 'swan' | 'alipay' | 'h5' | 'rn' | 'tt' | 'quickapp' | 'qq' | 'jd';
    [key: string]: any;
  }
}

// 微信小程序全局对象
declare const wx: any;
// 支付宝小程序全局对象
declare const my: any;
// 头条小程序全局对象
declare const tt: any;
// 百度小程序全局对象
declare const swan: any;
// QQ小程序全局对象
declare const qq: any;
