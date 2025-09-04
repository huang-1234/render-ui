import React from 'react';
import { type SafeAreaViewProps } from '@cross-platform/core';

const SafeAreaView: React.FC<SafeAreaViewProps> = ({
  children,
  style,
  className,
  edges = ['top', 'bottom', 'left', 'right'],
  ...props
}) => {
  const safeAreaStyle: React.CSSProperties = {
    ...style,
    paddingTop: edges.includes('top') ? 'env(safe-area-inset-top, 0px)' : undefined,
    paddingBottom: edges.includes('bottom') ? 'env(safe-area-inset-bottom, 0px)' : undefined,
    paddingLeft: edges.includes('left') ? 'env(safe-area-inset-left, 0px)' : undefined,
    paddingRight: edges.includes('right') ? 'env(safe-area-inset-right, 0px)' : undefined,
  };

  const combinedClassName = className ? `cross-safe-area ${className}` : 'cross-safe-area';

  return (
    <div
      className={combinedClassName}
      style={safeAreaStyle}
      {...props}
    >
      {children}
    </div>
  );
};

export default SafeAreaView;d