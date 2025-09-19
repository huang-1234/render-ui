import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  ChatWindow,
  ThemeProvider,
  ThemeToggle,
  registerTool,
} from '@lobe/ui-agent';
import { z } from 'zod';

// 注册自定义工具
registerTool({
  name: 'get_time',
  description: 'Get the current time',
  parameters: z.object({}),
  execute: async () => {
    return {
      time: new Date().toLocaleString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  },
  category: 'utility',
  tags: ['time', 'date'],
});

const App: React.FC = () => {
  const handleMessageSend = (message: string) => {
    console.log('Message sent:', message);
  };

  const handleError = (error: Error) => {
    console.error('Chat error:', error);
  };

  return (
    <ThemeProvider defaultTheme="light" enableSystemTheme>
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        {/* Header */}
        <header style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--lobe-agent-color-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--lobe-agent-color-surface)',
        }}>
          <h1 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 600,
            color: 'var(--lobe-agent-color-text)',
          }}>
            Lobe UI Agent Demo
          </h1>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main style={{
          flex: 1,
          padding: '24px',
          background: 'var(--lobe-agent-color-background)',
          display: 'flex',
          gap: '24px',
        }}>
          {/* Chat Window */}
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChatWindow
              title="AI Assistant"
              placeholder="Ask me anything..."
              showHeader={true}
              showTools={true}
              enabledTools={['weather', 'calculator', 'search', 'get_time']}
              onMessageSend={handleMessageSend}
              onError={handleError}
            />
          </div>

          {/* Sidebar */}
          <aside style={{
            width: '300px',
            background: 'var(--lobe-agent-color-surface)',
            borderRadius: 'var(--lobe-agent-radius-lg)',
            border: '1px solid var(--lobe-agent-color-border)',
            padding: '20px',
          }}>
            <h3 style={{
              margin: '0 0 16px 0',
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--lobe-agent-color-text)',
            }}>
              Available Tools
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Weather', desc: 'Get weather information' },
                { name: 'Calculator', desc: 'Perform calculations' },
                { name: 'Search', desc: 'Search for information' },
                { name: 'Time', desc: 'Get current time' },
              ].map((tool) => (
                <div
                  key={tool.name}
                  style={{
                    padding: '12px',
                    background: 'var(--lobe-agent-color-background)',
                    borderRadius: 'var(--lobe-agent-radius-md)',
                    border: '1px solid var(--lobe-agent-color-divider)',
                  }}
                >
                  <div style={{
                    fontWeight: 500,
                    fontSize: '14px',
                    color: 'var(--lobe-agent-color-text)',
                    marginBottom: '4px',
                  }}>
                    {tool.name}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: 'var(--lobe-agent-color-textSecondary)',
                  }}>
                    {tool.desc}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '24px',
              padding: '16px',
              background: 'var(--lobe-agent-color-background)',
              borderRadius: 'var(--lobe-agent-radius-md)',
              border: '1px solid var(--lobe-agent-color-divider)',
            }}>
              <h4 style={{
                margin: '0 0 12px 0',
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--lobe-agent-color-text)',
              }}>
                Try these examples:
              </h4>
              <ul style={{
                margin: 0,
                padding: '0 0 0 16px',
                fontSize: '12px',
                color: 'var(--lobe-agent-color-textSecondary)',
                lineHeight: 1.5,
              }}>
                <li>What's the weather in Tokyo?</li>
                <li>Calculate 15 * 23 + 45</li>
                <li>Search for React best practices</li>
                <li>What time is it now?</li>
              </ul>
            </div>
          </aside>
        </main>
      </div>
    </ThemeProvider>
  );
};

// 渲染应用
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);