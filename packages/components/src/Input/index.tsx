import React, { forwardRef, useState, useEffect } from 'react';
import { StyleObject } from '@cross-platform/core';
import { TextInput, View as RNView, Text as RNText, TouchableOpacity } from 'react-native';

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

// Input 组件实现 - React Native 版本
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
  const containerStyle = {
    // 基础样式
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    ...(style || {})
  };

  // 构建输入框样式对象
  const baseInputStyle = {
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

  const prefixStyles = {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  };

  const suffixStyles = {
    position: 'absolute',
    right: 12,
    top: '50%',
    transform: [{ translateY: -10 }],
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  };

  const errorTextStyles = {
    color: '#ff4d4f',
    fontSize: 12,
    marginTop: 4
  };

  // 事件处理
  const handleChange = (text: string) => {
    if (maxLength !== undefined && text.length > maxLength) {
      return;
    }

    setInputValue(text);
    onChangeText?.(text);

    // 创建合成事件
    const syntheticEvent = {
      nativeEvent: { text }
    };
    onChange?.(syntheticEvent);
  };

  const handleFocus = (event: any) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event: any) => {
    setIsFocused(false);
    onBlur?.(event);
  };

  const handleClear = () => {
    setInputValue('');
    onChangeText?.('');

    // 创建合成事件
    const syntheticEvent = {
      nativeEvent: { text: '' }
    };
    onChange?.(syntheticEvent);
  };

  return (
    <RNView style={containerStyle}>
      {prefix && <RNView style={prefixStyles}>{prefix}</RNView>}
      <TextInput
        ref={ref}
        value={inputValue}
        defaultValue={defaultValue}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        style={baseInputStyle}
        editable={!disabled && !readOnly}
        maxLength={maxLength}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : undefined}
        autoFocus={autoFocus}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        returnKeyType={returnKeyType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        onChangeText={handleChange}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={onSubmitEditing}
        onKeyPress={onKeyPress}
        testID={testID}
        {...restProps}
      />
      {suffix && <RNView style={suffixStyles}>{suffix}</RNView>}
      {clearable && inputValue && (
        <RNView style={suffixStyles}>
          <TouchableOpacity onPress={handleClear}>
            <RNText>✕</RNText>
          </TouchableOpacity>
        </RNView>
      )}
      {error && errorText && (
        <RNText style={errorTextStyles}>
          {errorText}
        </RNText>
      )}
    </RNView>
  );
});

Input.displayName = 'Input';

export default Input;