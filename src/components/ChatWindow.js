import React, { useState, useEffect, useRef } from 'react';
import './ChatWindow.css';
import { getChatResponse } from '../services/deepseek';
import TypeWriter from './TypeWriter';
import CodeBlock from './CodeBlock';

function ChatWindow({ apiKey }) {
  // 从localStorage加载历史消息
  const loadMessages = () => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [{
      text: '你好！我是宥宁助手，很高兴为您服务。',
      sender: 'bot',
      timestamp: new Date().getTime()
    }];
  };

  const [messages, setMessages] = useState(loadMessages);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 保存消息到localStorage
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(messages));
  }, [messages]);

  // 自动滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      text: inputText,
      sender: 'user',
      timestamp: new Date().getTime()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const aiResponse = await getChatResponse(
        [...messages, userMessage],
        apiKey
      );

      const botMessage = {
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date().getTime(),
        isNew: true
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        text: '抱歉，我现在无法回应。请稍后再试。',
        sender: 'bot',
        timestamp: new Date().getTime(),
        isNew: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 清除聊天历史
  const clearHistory = () => {
    const confirmClear = window.confirm('确定要清除所有聊天记录吗？');
    if (confirmClear) {
      setMessages([{
        text: '你好！我是宥宁助手，很高兴为您服务。',
        sender: 'bot',
        timestamp: new Date().getTime()
      }]);
    }
  };

  // 添加代码检测函数
  const detectCodeBlock = (text) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index)
        });
      }

      parts.push({
        type: 'code',
        language: match[1] || 'plaintext',
        content: match[2].trim()
      });

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex)
      });
    }

    return parts;
  };

  const renderMessage = (message) => {
    if (message.isNew && message.sender === 'bot') {
      return <TypeWriter text={message.text} />;
    }

    const parts = detectCodeBlock(message.text);
    return parts.map((part, index) => (
      part.type === 'code' ? (
        <CodeBlock 
          key={index}
          code={part.content}
          language={part.language}
        />
      ) : (
        <span key={index}>{part.content}</span>
      )
    ));
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <span>宥宁助手</span>
        <button onClick={clearHistory} className="clear-button">
          清除记录
        </button>
      </div>
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.sender}`}
          >
            {renderMessage(message)}
          </div>
        ))}
        {isLoading && (
          <div className="message bot loading">
            正在思考...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="输入消息..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? '发送中...' : '发送'}
        </button>
      </form>
    </div>
  );
}

export default ChatWindow;