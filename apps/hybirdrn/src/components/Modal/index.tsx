import React, { useEffect } from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleProp,
  ViewStyle,
  TextStyle,
  BackHandler,
  Platform,
  Animated,
} from 'react-native';
import { useComponentStyles } from '../../hooks';
import defaultModalStyles from './style';
import Button from '../Button';

export type ModalPosition = 'center' | 'top' | 'bottom' | 'fullscreen';

export interface ModalProps {
  /** 是否可见 */
  visible: boolean;
  /** 标题 */
  title?: React.ReactNode;
  /** 关闭回调 */
  onClose?: () => void;
  /** 点击遮罩层是否关闭 */
  maskClosable?: boolean;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 弹窗位置 */
  position?: ModalPosition;
  /** 动画类型 */
  animationType?: 'none' | 'slide' | 'fade';
  /** 遮罩层样式 */
  maskStyle?: StyleProp<ViewStyle>;
  /** 内容容器样式 */
  contentStyle?: StyleProp<ViewStyle>;
  /** 标题样式 */
  titleStyle?: StyleProp<TextStyle>;
  /** 内容区域样式 */
  bodyStyle?: StyleProp<ViewStyle>;
  /** 底部区域样式 */
  footerStyle?: StyleProp<ViewStyle>;
  /** 底部内容 */
  footer?: React.ReactNode;
  /** 确认按钮文本 */
  okText?: string;
  /** 确认按钮回调 */
  onOk?: () => void;
  /** 确认按钮属性 */
  okButtonProps?: any;
  /** 取消按钮文本 */
  cancelText?: string;
  /** 取消按钮回调 */
  onCancel?: () => void;
  /** 取消按钮属性 */
  cancelButtonProps?: any;
  /** 测试ID */
  testID?: string;
  /** 子元素 */
  children?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  title,
  onClose,
  maskClosable = true,
  closable = true,
  position = 'center',
  animationType = 'fade',
  maskStyle,
  contentStyle,
  titleStyle,
  bodyStyle,
  footerStyle,
  footer,
  okText = '确定',
  onOk,
  okButtonProps,
  cancelText = '取消',
  onCancel,
  cancelButtonProps,
  testID,
  children,
}) => {
  const componentStyles = useComponentStyles('Modal');

  // 处理 Android 返回键
  useEffect(() => {
    if (Platform.OS === 'android') {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        if (visible) {
          onClose?.();
          return true;
        }
        return false;
      });

      return () => backHandler.remove();
    }
  }, [visible, onClose]);

  // 处理遮罩层点击
  const handleMaskPress = () => {
    if (maskClosable) {
      onClose?.();
    }
  };

  // 处理关闭按钮点击
  const handleClosePress = () => {
    onClose?.();
  };

  // 处理确认按钮点击
  const handleOkPress = () => {
    onOk?.();
  };

  // 处理取消按钮点击
  const handleCancelPress = () => {
    onCancel?.();
    onClose?.();
  };

  // 阻止内容区域点击冒泡
  const handleContentPress = (e: any) => {
    e.stopPropagation();
  };

  // 根据位置计算内容样式
  const getPositionStyle = () => {
    switch (position) {
      case 'center':
        return defaultModalStyles.centered;
      case 'top':
        return defaultModalStyles.top;
      case 'bottom':
        return defaultModalStyles.bottom;
      case 'fullscreen':
        return defaultModalStyles.fullscreen;
      default:
        return defaultModalStyles.centered;
    }
  };

  // 处理Web特有属性
  const webProps = Platform.OS === 'web' ? { 'data-testid': testID } : {};

  // 渲染默认页脚
  const renderDefaultFooter = () => {
    return (
      <View style={[defaultModalStyles.footer, footerStyle]}>
        <Button
          title={cancelText}
          ghost
          onPress={handleCancelPress}
          style={defaultModalStyles.button}
          testID={`${testID}-cancel`}
          {...cancelButtonProps}
        />
        <Button
          title={okText}
          onPress={handleOkPress}
          style={defaultModalStyles.button}
          testID={`${testID}-ok`}
          {...okButtonProps}
        />
      </View>
    );
  };

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={defaultModalStyles.container} {...webProps}>
        <TouchableWithoutFeedback onPress={handleMaskPress} testID={`${testID}-mask`}>
          <View style={[defaultModalStyles.overlay, maskStyle]} />
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={handleContentPress}>
          <View
            style={[
              defaultModalStyles.content,
              getPositionStyle(),
              contentStyle,
            ]}
            testID={`${testID}-content`}
          >
            {(title || closable) && (
              <View style={defaultModalStyles.header}>
                <View style={{ width: 20 }} />
                {typeof title === 'string' ? (
                  <Text style={[defaultModalStyles.title, titleStyle]} numberOfLines={1}>
                    {title}
                  </Text>
                ) : (
                  <View style={{ flex: 1 }}>{title}</View>
                )}

                {closable && (
                  <TouchableOpacity
                    style={defaultModalStyles.closeButton}
                    onPress={handleClosePress}
                    testID={`${testID}-close`}
                  >
                    <Text style={defaultModalStyles.closeIcon}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <View style={[defaultModalStyles.body, bodyStyle]}>
              {children}
            </View>

            {footer !== null && (
              footer || renderDefaultFooter()
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </RNModal>
  );
};

export default Modal;
