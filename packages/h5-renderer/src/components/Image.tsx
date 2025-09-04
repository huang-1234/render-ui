import React from 'react';

interface ImageProps {
  src: string;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  [key: string]: any;
}

const Image: React.FC<ImageProps> = ({ 
  src,
  alt,
  style, 
  className,
  onLoad,
  onError,
  ...props 
}) => {
  const combinedClassName = className ? `cross-image ${className}` : 'cross-image';

  return (
    <img 
      src={src}
      alt={alt}
      className={combinedClassName}
      style={style}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  );
};

export default Image;