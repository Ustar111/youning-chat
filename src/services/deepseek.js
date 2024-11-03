import axios from 'axios';

const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const getChatResponse = async (messages, apiKey) => {
  try {
    const response = await axios.post(
      API_URL,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是宥宁助手，一个友善、专业的AI助手。"
          },
          ...messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }))
        ],
        temperature: 0.7,
        max_tokens: 2000,
        stream: false,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'Accept': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data && response.data.choices && response.data.choices[0]) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('API 响应格式不正确');
    }

  } catch (error) {
    console.error('Deepseek API调用错误:', error);
    if (error.response) {
      console.error('错误状态码:', error.response.status);
      console.error('错误详情:', error.response.data);
    } else if (error.request) {
      console.error('未收到响应:', error.request);
    } else {
      console.error('请求配置错误:', error.message);
    }
    throw new Error(error.response?.data?.error?.message || '无法获取AI响应');
  }
};