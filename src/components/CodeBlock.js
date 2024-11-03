import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import copy from 'copy-to-clipboard';

function CodeBlock({ code, language }) {
  const handleCopy = () => {
    copy(code);
    // 显示复制成功提示
    const tooltip = document.createElement('div');
    tooltip.className = 'copy-tooltip';
    tooltip.textContent = '已复制！';
    document.body.appendChild(tooltip);
    setTimeout(() => document.body.removeChild(tooltip), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-language">{language}</span>
        <button onClick={handleCopy} className="copy-button">
          复制代码
        </button>
      </div>
      <SyntaxHighlighter 
        language={language} 
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 4px 4px',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

export default CodeBlock;