import React, { useState } from 'react';
import { PromptResponse } from '../types';

interface ResultCardProps {
  data: PromptResponse;
}

export const ResultCard: React.FC<ResultCardProps> = ({ data }) => {
  const [copiedEn, setCopiedEn] = useState(false);
  const [copiedNeg, setCopiedNeg] = useState(false);

  const copyToClipboard = async (text: string, setCopied: (v: boolean) => void) => {
    if (!text) return;

    try {
      // 尝试使用现代 Clipboard API
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Clipboard API failed, trying fallback...', err);
      
      // 兼容方案：创建一个临时文本域来执行复制
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        
        // 确保它不可见但存在于 DOM 中
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          console.error('Fallback copy failed.');
        }
      } catch (fallbackErr) {
        console.error('Unable to copy', fallbackErr);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span>🎉</span> 生成成功！
          </h2>
          <span className="bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-mono text-gray-600 border border-white">
            Ratio: {data.suggestedAspectRatio}
          </span>
        </div>
        
        <p className="text-gray-700 italic mb-4 bg-white/50 p-3 rounded-xl border border-white/60">
          "{data.chineseTranslation}"
        </p>

        {/* Positive Prompt */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 relative group">
          <label className="text-xs font-bold text-primary uppercase tracking-wider mb-2 block">
            Positive Prompt (咒语)
          </label>
          <p className="text-gray-800 font-mono text-sm leading-relaxed break-words pr-8">
            {data.englishPrompt}
          </p>
          <button
            onClick={() => copyToClipboard(data.englishPrompt, setCopiedEn)}
            className="absolute top-2 right-2 p-2 rounded-lg bg-gray-50 hover:bg-primary hover:text-white transition-colors text-gray-400"
            title="复制"
          >
            {copiedEn ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Negative Prompt */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 relative">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Negative Prompt (反向咒语)
          </label>
           <p className="text-gray-500 font-mono text-xs leading-relaxed break-words pr-8">
            {data.negativePrompt}
          </p>
          <button
            onClick={() => copyToClipboard(data.negativePrompt, setCopiedNeg)}
            className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-400"
            title="复制"
          >
             {copiedNeg ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Reasoning */}
        <div className="flex items-start gap-2 text-sm text-gray-500 bg-amber-50 p-3 rounded-lg border border-amber-100">
           <span className="text-amber-400 text-lg">💡</span>
           <p>{data.reasoning}</p>
        </div>
      </div>
    </div>
  );
};