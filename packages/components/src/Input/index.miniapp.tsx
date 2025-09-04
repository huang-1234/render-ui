import React, { forwardRef, useState, useEffect } from 'react';
import { createStyles, StyleObject } from '@cross-platform/core';
import classNames from 'classnames';
import View from '../View';
import Text from '../Text';

// Input 组件属性接口
export interface InputProps {
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  style?: StyleObject;
  inputStyle?: StyleObject;
  className?: string;
  type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  multiline?: boolean;
  numberOfLines?: number;
  autoFocus?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad' | 'url';
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  onChangeText?: (text: string) => void;
  onChange?: (event: any) => void;
  onFocus?: (event: any) => void;
  onBlur?: (event: any) => void;
  onSubmitEditing?: (event: any) => void;
  onKeyPress?: (event: any) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  clearable?: boolean;
  error?: boolean;
  errorText?: string;
  testID?: string;
  id?: string;
  'data-testid'?: string;
  [key: string]: any;
}

// Input 组件实现 - 小程序版本
const Input = forwardRef<any, InputProps>((props, ref) => {
  const {
    value,
    defaultValue,
    placeholder,
    placeholderTextColor,
    style,
    inputStyle,
    className,
    type = 'text',
    disabled = false,
    readOnly = false,
    maxLength,
    multiline = false,
    numberOfLines = 1,
    autoFocus = false,
    secureTextEntry = false,
    keyboardType = 'default',
    returnKeyType = 'done',
    autoCapitalize = 'none',
    autoCorrect = false,
    onChangeText,
    onChange,
    onFocus,
    onBlur,
    onSubmitEditing,
    onKeyPress,
    prefix,
    suffix,
    clearable = false,
    error = false,
    errorText,
    testID,
    id,
    'data-testid': dataTestId,
    ...restProps
  } = props;

  const [inputValue, setInputValue] = useState(value || defaultValue || '');
  const [isFocused, setIsFocused] = useState(false);

  // 当外部 value 改变时更新内部状态
  useEffect(() => {
    if (value !== undefined) {
      setInputValue(value);
    }
  }, [value]);

  // 构建容器样式对象
  const containerStyle: StyleObject = {
    // 基础样式
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    ...(style || {})
  };

  // 构建输入框样式对象
  const baseInputStyle: StyleObject = {
    // 基础样式
    flex: 1,
    height: multiline ? undefined : 40,
    minHeight: multiline ? 40 : undefined,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: error ? '#ff4d4f' : (isFocused ? '#1677ff' : '#d9d9d9'),
    borderRadius: 6,
    backgroundColor: disabled ? '#f5f5f5' : '#ffffff',
    color: disabled ? '#bfbfbf' : '#000000',
    ...(multiline && { height: numberOfLines * 24, textAlignVertical: 'top' }),
    ...(prefix && { paddingLeft: 36 }),
    ...(suffix || clearable ? { paddingRight: 36 } : {}),
    ...(inputStyle || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: containerStyle,
    weapp: {
      // 小程序特定样式
    }
  });

  const inputStyles = createStyles({
    default: baseInputStyle,
    weapp: {
      // 小程序特定样式
    }
  });

  const prefixStyles = createStyles({
    default: {
      position: 'absolute',
      left: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  const suffixStyles = createStyles({
    default: {
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  });

  const errorTextStyles = createStyles({
    default: {
      color: '#ff4d4f',
      fontSize: 12,
      marginTop: 4
    }
  });

  // 事件处理
  const handleChange = (e: any) => {
    const text = e.detail.value;

    if (maxLength !== undefined && text.length > maxLength) {
      return;
    }

    setInputValue(text);
    onChangeText?.(text);
    onChange?.({ target: { value: text } });
  };

  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleSubmitEditing = (event: any) => {
    onSubmitEditing?.(event);
  };

  const handleClear = () => {
    setInputValue('');
    onChangeText?.('');
    onChange?.({ target: { value: '' } });
  };

  // 将 React Native 的 keyboardType 转换为小程序 input type
  let miniappType = 'text';
  if (secureTextEntry) {
    miniappType = 'password';
  } else if (keyboardType === 'numeric') {
    miniappType = 'digit';
  } else if (keyboardType === 'phone-pad') {
    miniappType = 'number';
  }

  // 小程序特定属性
  const commonProps = {
    className: classNames('cross-input', className),
    style: inputStyles,
    value: inputValue,
    placeholder,
    'placeholder-style': placeholderTextColor ? `color: ${placeholderTextColor};` : 'color: #bfbfbf;',
    disabled,
    maxlength: maxLength,
    focus: autoFocus,
    bindinput: handleChange,
    bindfocus: handleFocus,
    bindblur: handleBlur,
    bindconfirm: handleSubmitEditing,
    ...restProps
  };

  // 根据是否多行选择渲染不同的元素
  const renderInput = () => {
    if (multiline) {
      return React.createElement(
        'textarea',
        {
          ref,
          ...commonProps,
          'auto-height': false,
          fixed: true,
          'show-confirm-bar': false,
          'adjust-position': true
        }
      );
    } else {
      return React.createElement(
        'input',
        {
          ref,
          ...commonProps,
          type: miniappType,
          password: secureTextEntry
        }
      );
    }
  };

  return React.createElement(
    'view',
    {
      className: classNames('cross-input-container', className),
      style: styles
    },
    [
      prefix && React.createElement(
        'view',
        { key: 'prefix', style: prefixStyles },
        prefix
      ),
      renderInput(),
      suffix && React.createElement(
        'view',
        { key: 'suffix', style: suffixStyles },
        suffix
      ),
      clearable && inputValue && React.createElement(
        'view',
        {
          key: 'clear',
          style: suffixStyles,
          bindtap: handleClear
        },
        React.createElement('text', {}, '✕')
      ),
      error && errorText && React.createElement(
        'text',
        {
          key: 'error',
          style: errorTextStyles
        },
        errorText
      )
    ]
  );
});

Input.displayName = 'Input';

export default Input;
