import React from 'react';

interface ScrollViewProps {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  horizontal?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  showsVerticalScrollIndicator?: boolean;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  [key: string]: any;
}

const ScrollView: React.FC<ScrollViewProps> = ({ 
  children, 
  style, 
  className,
  horizontal = false,
  showsHorizontalScrollIndicator = true,
  showsVerticalScrollIndicator = true,
  onScroll,
  ...props 
}) => {
  const scrollStyle: React.CSSProperties = {
    ...style,
    overflow: 'auto',
    overflowX: horizontal ? 'auto' : (showsHorizontalScrollIndicator ? 'auto' : 'hidden'),
    overflowY: horizontal ? 'hidden' : (showsVerticalScrollIndicator ? 'auto' : 'hidden'),
    display: horizontal ? 'flex' : 'block',
    flexDirection: horizontal ? 'row' : undefined
  };

  const combinedClassName = className ? `cross-scroll-view ${className}` : 'cross-scroll-view';

  return (
    <div 
      className={combinedClassName}
      style={scrollStyle}
      onScroll={onScroll}
      {...props}
    >
      {children}
    </div>
  );
};

export default ScrollView;