import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center py-8 px-4">
      <div className="inline-block relative">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight font-sans relative z-10">
          <span className="text-primary">Miao</span>Prompt
        </h1>
        <div className="absolute -top-4 -right-6 text-4xl animate-bounce-slow">🎨</div>
        <div className="absolute -bottom-2 -left-4 text-2xl animate-pulse">✨</div>
      </div>
      <p className="mt-4 text-gray-500 text-lg max-w-md mx-auto">
        输入简单的想法，为您变出<span className="text-primary font-bold">绝美</span>的绘画咒语
      </p>
    </header>
  );
};