# @lobe/ui-agent

[![NPM version](https://img.shields.io/npm/v/@lobe/ui-agent.svg?style=flat)](https://npmjs.org/package/@lobe/ui-agent)
[![NPM downloads](http://img.shields.io/npm/dm/@lobe/ui-agent.svg?style=flat)](https://npmjs.org/package/@lobe/ui-agent)
[![License](https://img.shields.io/npm/l/@lobe/ui-agent.svg)](https://github.com/lobehub/lobe-ui-agent/blob/main/LICENSE)

Enterprise-grade LLM application component library with high availability, extensibility, and performance. Built for modern AI chat applications with comprehensive tool integration and theme customization.

## ✨ Features

- 🎯 **Enterprise Ready**: Production-ready components with error handling and performance optimization
- 🔧 **Extensible Tools**: Plugin-based tool system with built-in weather, calculator, and search tools
- 🎨 **Theme System**: Complete theme customization with light/dark mode support
- 📱 **Responsive**: Mobile-first design with responsive layouts
- 🚀 **Performance**: Optimized for large message lists with virtual scrolling
- 🔒 **Type Safe**: Full TypeScript support with comprehensive type definitions
- 🧪 **Well Tested**: Comprehensive test coverage with Jest and React Testing Library
- 📖 **Documentation**: Complete documentation with interactive examples

## 📦 Installation

```bash
npm install @lobe/ui-agent
# or
yarn add @lobe/ui-agent
# or
pnpm add @lobe/ui-agent
```

## 🚀 Quick Start

### Basic Chat Window

```tsx
import React from 'react';
import { ChatWindow, ThemeProvider } from '@lobe/ui-agent';

function App() {
  const handleMessageSend = (message: string) => {
    console.log('Message sent:', message);
  };

  return (
    <ThemeProvider>
      <div style={{ height: '600px', width: '800px' }}>
        <ChatWindow
          title="AI Assistant"
          onMessageSend={handleMessageSend}
        />
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### Using Hooks

```tsx
import React from 'react';
import { useChat, ThemeProvider, MessageList, ChatInput } from '@lobe/ui-agent';

function CustomChatApp() {
  const {
    messages,
    isLoading,
    sendMessage,
    regenerateResponse,
    clearMessages,
  } = useChat({
    config: {
      apiEndpoint: '/api/chat',
      enableTools: true,
    },
  });

  return (
    <ThemeProvider>
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <MessageList
            messages={messages}
            onRegenerate={regenerateResponse}
          />
        </div>
        <ChatInput
          onSend={sendMessage}
          loading={isLoading}
          placeholder="Type your message..."
        />
      </div>
    </ThemeProvider>
  );
}
```

### Custom Tools

```tsx
import React from 'react';
import { registerTool, ChatWindow, ThemeProvider } from '@lobe/ui-agent';
import { z } from 'zod';

// Register a custom tool
registerTool({
  name: 'get_user_info',
  description: 'Get information about a user',
  parameters: z.object({
    userId: z.string().describe('The user ID'),
  }),
  execute: async ({ userId }) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
  },
  category: 'user',
  tags: ['user', 'info'],
});

function App() {
  return (
    <ThemeProvider>
      <ChatWindow
        title="Customer Support"
        enabledTools={['get_user_info', 'search']}
      />
    </ThemeProvider>
  );
}
```

### Custom Theme

```tsx
import React from 'react';
import { ThemeProvider, ChatWindow } from '@lobe/ui-agent';

const customTheme = {
  name: 'corporate',
  colors: {
    primary: '#2c5aa0',
    background: '#f8f9fa',
    text: '#212529',
    // ... other colors
  },
  // ... other theme properties
};

function App() {
  return (
    <ThemeProvider defaultTheme="corporate">
      <ChatWindow />
    </ThemeProvider>
  );
}
```

## 🔧 API Reference

### Components

#### ChatWindow

Main chat interface component with message list and input.

```tsx
interface ChatWindowProps {
  title?: string;
  placeholder?: string;
  showHeader?: boolean;
  showTools?: boolean;
  enabledTools?: string[];
  maxMessages?: number;
  onMessageSend?: (message: string) => void;
  onError?: (error: Error) => void;
}
```

#### MessageList

Displays a list of chat messages with actions.

```tsx
interface MessageListProps {
  messages: ChatMessage[];
  onRegenerate?: (messageId: string) => void;
  onRetry?: (messageId: string) => void;
  showActions?: boolean;
  showTimestamp?: boolean;
}
```

#### ChatInput

Input component for sending messages.

```tsx
interface ChatInputProps {
  onSend: (message: string) => void;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  maxLength?: number;
  enabledTools?: string[];
}
```

#### ThemeProvider

Provides theme context to child components.

```tsx
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: string;
  enableSystemTheme?: boolean;
}
```

### Hooks

#### useChat

Main hook for chat functionality.

```tsx
const {
  messages,
  isLoading,
  error,
  sendMessage,
  regenerateResponse,
  stopGeneration,
  clearMessages,
} = useChat(options);
```

#### useTools

Hook for tool management.

```tsx
const {
  tools,
  executeTool,
  registerTool,
  searchTools,
  isToolEnabled,
} = useTools(options);
```

#### useTheme

Hook for theme management.

```tsx
const {
  currentTheme,
  setTheme,
  toggleTheme,
  isDark,
} = useTheme();
```

## 🛠️ Built-in Tools

### Weather Tool
Get current weather information for any location.

### Calculator Tool
Perform mathematical calculations and evaluate expressions.

### Search Tool
Search for information across various sources.

## 🎨 Theming

The library supports comprehensive theming with CSS variables and styled-components:

```tsx
// Light theme
const lightTheme = {
  name: 'light',
  colors: {
    primary: '#1677ff',
    background: '#ffffff',
    text: '#1f1f1f',
    // ...
  },
  // ...
};

// Register custom theme
registerTheme(customTheme);
```

## 🧪 Testing

```bash
npm test
npm run test:coverage
npm run test:watch
```

## 📖 Documentation

Visit our [documentation site](https://lobe-ui-agent.vercel.app) for detailed guides and examples.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Lobe Hub](https://github.com/lobehub)