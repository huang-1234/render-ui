import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
  Platform,
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultInputStyles from './style';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** 输入框样式 */
  style?: StyleProp<ViewStyle>;
  /** 输入文本样式 */
  inputStyle?: StyleProp<TextStyle>;
  /** 是否禁用 */
  disabled?: boolean;
  /** 错误状态 */
  error?: boolean;
  /** 错误提示文本 */
  errorText?: string;
  /** 前缀图标或文本 */
  prefix?: React.ReactNode;
  /** 后缀图标或文本 */
  suffix?: React.ReactNode;
  /** 是否可清除 */
  clearable?: boolean;
  /** 清除按钮点击事件 */
  onClear?: () => void;
  /** 输入框大小 */
  size?: 'small' | 'default' | 'large';
  /** 是否圆角 */
  rounded?: boolean;
  /** 是否多行文本 */
  textarea?: boolean;
  /** 最大行数 */
  maxRows?: number;
  /** 自动增长高度 */
  autoHeight?: boolean;
  /** 测试ID */
  testID?: string;
}

export interface InputRef {
  focus: () => void;
  blur: () => void;
  clear: () => void;
  isFocused: () => boolean;
  getValue: () => string | undefined;
}

const Input = forwardRef<InputRef, InputProps>(({
  style,
  inputStyle,
  disabled = false,
  error = false,
  errorText,
  prefix,
  suffix,
  clearable = false,
  onClear,
  size = 'default',
  rounded = false,
  textarea = false,
  maxRows,
  autoHeight,
  testID,
  value,
  onChangeText,
  onFocus,
  onBlur,
  ...restProps
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const inputRef = useRef<TextInput>(null);
  const componentStyles = useComponentStyles('Input', style);

  // 转发 ref 方法
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
    blur: () => inputRef.current?.blur(),
    clear: () => {
      inputRef.current?.clear();
      handleClear();
    },
    isFocused: () => !!inputRef.current?.isFocused(),
    getValue: () => inputValue,
  }));

  // 处理文本变化
  const handleChangeText = (text: string) => {
    setInputValue(text);
    onChangeText?.(text);
  };

  // 处理聚焦事件
  const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // 处理失焦事件
  const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // 处理清除事件
  const handleClear = () => {
    setInputValue('');
    onChangeText?.('');
    onClear?.();
    inputRef.current?.focus();
  };

  // 计算容器样式
  const containerStyles = [
    defaultInputStyles.inputContainer,
    size === 'small' && defaultInputStyles.small,
    size === 'large' && defaultInputStyles.large,
    rounded && defaultInputStyles.rounded,
    disabled && defaultInputStyles.disabled,
    error && defaultInputStyles.error,
    isFocused && defaultInputStyles.focus,
    textarea && defaultInputStyles.textarea,
  ];

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  return (
    <View style={[defaultInputStyles.container, componentStyles]} {...webProps}>
      <View style={containerStyles}>
        {prefix && <View style={defaultInputStyles.prefix}>{prefix}</View>}

        <TextInput
          ref={inputRef}
          style={[
            defaultInputStyles.input,
            textarea && defaultInputStyles.textarea,
            inputStyle,
          ]}
          value={value}
          onChangeText={handleChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
          multiline={textarea}
          numberOfLines={textarea ? maxRows || 4 : undefined}
          testID={`${testID}-input`}
          {...restProps}
        />

        {clearable && inputValue && !disabled && (
          <TouchableOpacity
            style={defaultInputStyles.clearButton}
            onPress={handleClear}
            testID={`${testID}-clear`}
          >
            <Text style={defaultInputStyles.clearIcon}>×</Text>
          </TouchableOpacity>
        )}

        {suffix && <View style={defaultInputStyles.suffix}>{suffix}</View>}
      </View>

      {error && errorText && (
        <Text style={defaultInputStyles.errorText} testID={`${testID}-error`}>
          {errorText}
        </Text>
      )}
    </View>
  );
});

Input.displayName = 'Input';

export default Input;
