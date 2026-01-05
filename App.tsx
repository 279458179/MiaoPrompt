import React, { useState } from 'react';
import { Header } from './components/Header';
import { StyleSelector } from './components/StyleSelector';
import { ResultCard } from './components/ResultCard';
import { generateAiPrompt } from './services/geminiService';
import { PromptResponse } from './types';

const SAMPLE_IDEAS = [
  "一只穿着宇航服的柯基犬，在月球上追逐发光的骨头",
  "一座漂浮在云端的糖果城堡，由棉花糖和巧克力组成",
  "深海中的发光水母森林，巨大的鲸鱼在其中穿梭",
  "一位少女在雨中的古老小巷撑伞回眸，眼神清澈",
  "未来的火星殖民地，飞行汽车穿梭在摩天大楼之间",
  "水晶球里的微观世界，包含着四季的景色变化",
  "巨大的机械龙盘旋在废弃的城市上空，夕阳西下",
  "森林深处的树屋图书馆，萤火虫环绕着书架",
  "赛博朋克风格的拉面店，机器人厨师正在煮面",
  "一杯冒着热气的咖啡，拉花是银河系的图案",
  "一只戴着眼镜的猫头鹰在复古书房里写信",
  "巨大的浮空岛屿，瀑布从边缘倾泻而下"
];

function App() {
  const [userInput, setUserInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRandomIdea = () => {
    return SAMPLE_IDEAS[Math.floor(Math.random() * SAMPLE_IDEAS.length)];
  };

  const handleRandomFill = () => {
    const idea = getRandomIdea();
    setUserInput(idea);
  };

  const handleGenerate = async () => {
    // 1. 获取当前输入，如果为空则随机取一个
    let currentInput = userInput.trim();
    if (!currentInput) {
      currentInput = getRandomIdea();
      setUserInput(currentInput); // 更新界面显示
    }

    if (!currentInput) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateAiPrompt(currentInput, selectedStyle, selectedRatio);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Check for both Meta (Command on Mac) and Ctrl (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault(); 
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Header />

        <main className="space-y-8">
          {/* Input Section */}
          <section className="bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-white/50 relative overflow-hidden">
             {/* Decorative circles */}
             <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
             <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div>
                 <div className="flex justify-between items-center mb-3 px-1">
                    <label className="block text-gray-700 font-bold flex items-center gap-2">
                      <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">3</span> 
                      描述你的想法
                    </label>
                    <button 
                      onClick={handleRandomFill}
                      className="text-xs font-medium text-primary bg-primary/5 hover:bg-primary hover:text-white border border-primary/20 px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 group"
                      title="随机生成一个灵感"
                    >
                      <span className="group-hover:rotate-180 transition-transform duration-500">🎲</span> 
                      随机灵感
                    </button>
                 </div>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="例如：一只戴着宇航员头盔的小猫，在太空中抓星星，梦幻色彩..."
                    className="w-full h-32 p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-gray-700 text-lg placeholder-gray-300"
                  />
                  <div className="text-right mt-2 text-xs text-gray-400">
                    {userInput.trim() ? '按 Command/Ctrl + Enter 快速生成' : '按 Command/Ctrl + Enter 随机生成'}
                  </div>
              </div>

              <StyleSelector
                selectedStyle={selectedStyle}
                onSelectStyle={setSelectedStyle}
                selectedRatio={selectedRatio}
                onSelectRatio={setSelectedRatio}
              />

              <button
                onClick={handleGenerate}
                disabled={loading}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg shadow-primary/30 transition-all transform
                  flex items-center justify-center gap-3
                  ${loading
                    ? 'bg-gray-300 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-primary to-primary-dark hover:scale-[1.01] hover:shadow-primary/40 active:scale-[0.98]'
                  }
                `}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>正在施法...</span>
                  </>
                ) : (
                  <>
                    <span>✨ {userInput.trim() ? '开始生成咒语' : '帮我想个点子并生成'}</span>
                  </>
                )}
              </button>
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-center border border-red-100 animate-bounce">
              {error}
            </div>
          )}

          {/* Result Section */}
          {result && (
            <ResultCard data={result} />
          )}

        </main>
        
        <footer className="mt-20 text-center text-gray-400 text-sm">
          <p>Powered by Google Gemini 3 Flash</p>
          <p className="mt-1">Making magic for art lovers 💖</p>
        </footer>
      </div>
    </div>
  );
}

export default App;