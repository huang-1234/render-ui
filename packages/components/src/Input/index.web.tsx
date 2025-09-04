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

// Input 组件实现 - Web 版本
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
    outlineStyle: 'none',
    ...(multiline && { height: numberOfLines * 24, textAlignVertical: 'top' }),
    ...(prefix && { paddingLeft: 36 }),
    ...(suffix || clearable ? { paddingRight: 36 } : {}),
    ...(inputStyle || {})
  };

  // 创建适配后的样式
  const styles = createStyles({
    default: containerStyle,
    h5: {
      // H5 特定样式
    }
  });

  const inputStyles = createStyles({
    default: baseInputStyle,
    h5: {
      // H5 特定样式
      boxSizing: 'border-box',
      '&:focus': {
        borderColor: '#1677ff',
        boxShadow: '0 0 0 2px rgba(24, 144, 255, 0.2)'
      },
      '&::placeholder': {
        color: placeholderTextColor || '#bfbfbf'
      }
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const text = event.target.value;

    if (maxLength !== undefined && text.length > maxLength) {
      return;
    }

    setInputValue(text);
    onChangeText?.(text);
    onChange?.(event);
  };

  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleSubmitEditing = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      onSubmitEditing?.(event);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onKeyPress?.(event);
  };

  const handleClear = () => {
    setInputValue('');
    onChangeText?.('');

    // 创建合成事件
    const syntheticEvent = {
      target: { value: '' }
    };
    onChange?.(syntheticEvent);
  };

  // 渲染清除按钮
  const renderClearButton = () => {
    if (!clearable || !inputValue) return null;

    return (
      <div
        style={suffixStyles}
        onClick={handleClear}
        className="cross-input-clear-button"
      >
        ✕
      </div>
    );
  };

  // 根据是否多行选择渲染不同的元素
  if (multiline) {
    return (
      <View style={styles} className={classNames('cross-input-container', className)}>
        {prefix && <div style={prefixStyles}>{prefix}</div>}
        <textarea
          ref={ref}
          value={inputValue}
          placeholder={placeholder}
          style={inputStyles}
          className="cross-input cross-textarea"
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          rows={numberOfLines}
          autoFocus={autoFocus}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          id={id}
          data-testid={dataTestId || testID}
          {...restProps}
        />
        {suffix && <div style={suffixStyles}>{suffix}</div>}
        {clearable && renderClearButton()}
        {error && errorText && (
          <Text style={errorTextStyles} className="cross-input-error-text">
            {errorText}
          </Text>
        )}
      </View>
    );
  } else {
    // 将 React Native 的 keyboardType 转换为 HTML input type
    let htmlType = type;
    if (secureTextEntry) {
      htmlType = 'password';
    } else if (keyboardType === 'numeric' || keyboardType === 'phone-pad') {
      htmlType = 'number';
    } else if (keyboardType === 'email-address') {
      htmlType = 'email';
    } else if (keyboardType === 'url') {
      htmlType = 'url';
    }

    return (
      <View style={styles} className={classNames('cross-input-container', className)}>
        {prefix && <div style={prefixStyles}>{prefix}</div>}
        <input
          ref={ref}
          type={htmlType}
          value={inputValue}
          placeholder={placeholder}
          style={inputStyles}
          className="cross-input"
          disabled={disabled}
          readOnly={readOnly}
          maxLength={maxLength}
          autoFocus={autoFocus}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={handleKeyPress}
          onKeyDown={handleSubmitEditing}
          id={id}
          data-testid={dataTestId || testID}
          {...restProps}
        />
        {suffix && <div style={suffixStyles}>{suffix}</div>}
        {clearable && renderClearButton()}
        {error && errorText && (
          <Text style={errorTextStyles} className="cross-input-error-text">
            {errorText}
          </Text>
        )}
      </View>
    );
  }
});

Input.displayName = 'Input';

export default Input;
