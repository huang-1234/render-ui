import React from 'react';

interface ViewProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onPress?: (event: React.MouseEvent<HTMLDivElement>) => void;
  [key: string]: any;
}

const View: React.FC<ViewProps> = ({ 
  children, 
  style, 
  className,
  onClick,
  onPress,
  ...props 
}) => {
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    onClick?.(event);
    onPress?.(event as any);
  };

  const combinedClassName = className ? `cross-view ${className}` : 'cross-view';

  return (
    <div 
      className={combinedClassName}
      style={style}
      onClick={handleClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default View;