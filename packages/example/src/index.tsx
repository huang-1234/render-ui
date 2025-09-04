import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// H5 入口文件
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root container not found');
}