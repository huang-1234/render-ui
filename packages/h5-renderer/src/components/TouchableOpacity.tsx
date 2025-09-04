import React, { useState } from 'react';

interface TouchableOpacityProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  activeOpacity?: number;
  disabled?: boolean;
  onPress?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPressIn?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPressOut?: (event: React.MouseEvent<HTMLDivElement>) => void;
  [key: string]: any;
}

const TouchableOpacity: React.FC<TouchableOpacityProps> = ({ 
  children, 
  style, 
  className,
  activeOpacity = 0.7,
  disabled = false,
  onPress,
  onPressIn,
  onPressOut,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsPressed(true);
    onPressIn?.(event);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    setIsPressed(false);
    onPressOut?.(event);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    onPress?.(event);
  };

  const touchableStyle: React.CSSProperties = {
    ...style,
    opacity: isPressed ? activeOpacity : (disabled ? 0.5 : 1),
    cursor: disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    transition: 'opacity 0.1s ease'
  };

  const combinedClassName = className ? `cross-touchable-opacity ${className}` : 'cross-touchable-opacity';

  return (
    <div 
      className={combinedClassName}
      style={touchableStyle}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default TouchableOpacity;