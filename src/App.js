import React, { useState, useEffect } from 'react';
import './App.css';
import ChatWindow from './components/ChatWindow';

function App() {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // 尝试从环境变量获取 API key
    const envApiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;
    // 尝试从 localStorage 获取 API key
    const savedApiKey = localStorage.getItem('deepseek_api_key');
    
    if (envApiKey) {
      setApiKey(envApiKey);
    } else if (savedApiKey) {
      setApiKey(savedApiKey);
    } else {
      // 使用备用的 API key
      const fallbackApiKey = 'sk-45a1c3e7259d45448abc85c56babcb76';
      setApiKey(fallbackApiKey);
      localStorage.setItem('deepseek_api_key', fallbackApiKey);
    }
  }, []);

  if (!apiKey) {
    return (
      <div className="App">
        <div className="loading-message">
          正在初始化...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="error-message">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ChatWindow 
        apiKey={apiKey} 
        onError={(errorMessage) => setError(errorMessage)}
      />
    </div>
  );
}

export default App;