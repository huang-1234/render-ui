import React from 'react';
import { TextProps } from '@cross-platform/core';

const Text: React.FC<TextProps> = ({ 
  children, 
  style, 
  className,
  numberOfLines,
  ellipsizeMode = 'tail',
  selectable = true,
  onClick,
  onPress,
  ...props 
}) => {
  const handleClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    onClick?.(event);
    onPress?.(event as any);
  };

  const textStyle: React.CSSProperties = {
    ...style,
    userSelect: selectable ? 'text' : 'none',
    cursor: (onClick || onPress) ? 'pointer' : 'default'
  };

  // 处理行数限制
  if (numberOfLines && numberOfLines > 0) {
    textStyle.display = '-webkit-box';
    textStyle.WebkitLineClamp = numberOfLines;
    textStyle.WebkitBoxOrient = 'vertical';
    textStyle.overflow = 'hidden';
    
    // 处理省略模式
    switch (ellipsizeMode) {
      case 'head':
        textStyle.textOverflow = 'ellipsis';
        textStyle.direction = 'rtl';
        textStyle.textAlign = 'left';
        break;
      case 'middle':
        // CSS 不直接支持中间省略，需要 JavaScript 处理
        textStyle.textOverflow = 'ellipsis';
        break;
      case 'tail':
      default:
        textStyle.textOverflow = 'ellipsis';
        break;
    }
  }

  const combinedClassName = className ? `cross-text ${className}` : 'cross-text';

  return (
    <span 
      className={combinedClassName}
      style={textStyle}
      onClick={handleClick}
      {...props}
    >
      {children}
    </span>
  );
};

export default Text;