import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleProp,
  ViewStyle,
  TextStyle,
  Platform,
  BackHandler,
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultPickerStyles from './style';

export interface PickerOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface PickerProps {
  /** 选项数据 */
  options: PickerOption[];
  /** 当前选中的值 */
  value?: string | number;
  /** 默认选中的值 */
  defaultValue?: string | number;
  /** 值变化时的回调函数 */
  onChange?: (value: string | number, option: PickerOption) => void;
  /** 点击选择器时的回调函数 */
  onPress?: () => void;
  /** 占位文本 */
  placeholder?: string;
  /** 选择器标题 */
  title?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 错误状态 */
  error?: boolean;
  /** 错误提示文本 */
  errorText?: string;
  /** 选择器大小 */
  size?: 'small' | 'default' | 'large';
  /** 是否圆角 */
  rounded?: boolean;
  /** 容器样式 */
  style?: StyleProp<ViewStyle>;
  /** 选择器文本样式 */
  textStyle?: StyleProp<TextStyle>;
  /** 测试ID */
  testID?: string;
}

const Picker: React.FC<PickerProps> = ({
  options,
  value: propValue,
  defaultValue,
  onChange,
  onPress,
  placeholder = '请选择',
  title = '请选择',
  disabled = false,
  error = false,
  errorText,
  size = 'default',
  rounded = false,
  style,
  textStyle,
  testID,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | number | undefined>(
    propValue !== undefined ? propValue : defaultValue
  );
  const componentStyles = useComponentStyles('Picker', style);

  // 同步外部 value 变化
  useEffect(() => {
    if (propValue !== undefined) {
      setSelectedValue(propValue);
    }
  }, [propValue]);

  // 处理 Android 返回键
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (modalVisible) {
          setModalVisible(false);
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, [modalVisible]);

  // 打开选择器
  const handlePress = useCallback(() => {
    if (disabled) return;
    setModalVisible(true);
    onPress?.();
  }, [disabled, onPress]);

  // 关闭选择器
  const handleClose = useCallback(() => {
    setModalVisible(false);
  }, []);

  // 选择选项
  const handleSelect = useCallback((option: PickerOption) => {
    if (option.disabled) return;

    const newValue = option.value;
    setSelectedValue(newValue);

    if (propValue === undefined) {
      // 非受控模式，内部更新状态
      setSelectedValue(newValue);
    }

    onChange?.(newValue, option);
    setModalVisible(false);
  }, [onChange, propValue]);

  // 获取当前选中的选项
  const getSelectedOption = useCallback(() => {
    return options.find(option => option.value === selectedValue);
  }, [options, selectedValue]);

  // 渲染选项
  const renderOption = useCallback(({ item }: { item: PickerOption }) => {
    const isSelected = item.value === selectedValue;

    return (
      <TouchableOpacity
        style={[
          defaultPickerStyles.optionItem,
          isSelected && defaultPickerStyles.selectedOption,
          item.disabled && defaultPickerStyles.disabled,
        ]}
        onPress={() => handleSelect(item)}
        disabled={item.disabled}
        testID={`${testID}-option-${item.value}`}
      >
        <Text
          style={[
            defaultPickerStyles.optionText,
            isSelected && defaultPickerStyles.selectedOptionText,
            item.disabled && { opacity: 0.5 },
          ]}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Text style={defaultPickerStyles.checkIcon}>✓</Text>
        )}
      </TouchableOpacity>
    );
  }, [selectedValue, handleSelect, testID]);

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  // 选择器样式
  const pickerContainerStyles = [
    defaultPickerStyles.pickerContainer,
    size === 'small' && defaultPickerStyles.small,
    size === 'large' && defaultPickerStyles.large,
    rounded && defaultPickerStyles.rounded,
    disabled && defaultPickerStyles.disabled,
    error && defaultPickerStyles.error,
  ];

  // 选择器文本样式
  const pickerTextStyles = [
    defaultPickerStyles.pickerText,
    !selectedValue && defaultPickerStyles.placeholderText,
    textStyle,
  ];

  const selectedOption = getSelectedOption();

  return (
    <View style={[defaultPickerStyles.container, componentStyles]} {...webProps}>
      <TouchableOpacity
        style={pickerContainerStyles}
        onPress={handlePress}
        disabled={disabled}
        testID={`${testID}-trigger`}
      >
        <Text style={pickerTextStyles}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={defaultPickerStyles.arrow}>▼</Text>
      </TouchableOpacity>

      {error && errorText && (
        <Text style={defaultPickerStyles.errorText} testID={`${testID}-error`}>
          {errorText}
        </Text>
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
        testID={`${testID}-modal`}
      >
        <TouchableOpacity
          style={defaultPickerStyles.modalOverlay}
          activeOpacity={1}
          onPress={handleClose}
          testID={`${testID}-overlay`}
        >
          <View
            style={defaultPickerStyles.modalContainer}
            onStartShouldSetResponder={() => true}
          >
            <View style={defaultPickerStyles.modalHeader}>
              <TouchableOpacity onPress={handleClose} testID={`${testID}-cancel`}>
                <Text style={defaultPickerStyles.modalCancel}>取消</Text>
              </TouchableOpacity>

              <Text style={defaultPickerStyles.modalTitle}>{title}</Text>

              <TouchableOpacity onPress={handleClose} testID={`${testID}-confirm`}>
                <Text style={defaultPickerStyles.modalConfirm}>确定</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item.value.toString()}
              style={defaultPickerStyles.optionsList}
              initialScrollIndex={options.findIndex(option => option.value === selectedValue)}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index,
              })}
              testID={`${testID}-list`}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Picker;
