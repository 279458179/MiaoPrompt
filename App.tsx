import React, { useState } from 'react';
import { Header } from './components/Header';
import { StyleSelector } from './components/StyleSelector';
import { ResultCard } from './components/ResultCard';
import { generateAiPrompt } from './services/geminiService';
import { PromptResponse } from './types';

function App() {
  const [userInput, setUserInput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('none');
  const [selectedRatio, setSelectedRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PromptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!userInput.trim()) return;
    
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await generateAiPrompt(userInput, selectedStyle, selectedRatio);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
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
                 <label className="block text-gray-700 font-bold mb-3 px-1 flex items-center gap-2">
                    <span className="bg-accent text-white text-xs px-2 py-1 rounded-full">3</span> 
                    描述你的想法
                  </label>
                  <textarea
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="例如：一只戴着宇航员头盔的小猫，在太空中抓星星，梦幻色彩..."
                    className="w-full h-32 p-4 rounded-2xl bg-gray-50 border-2 border-gray-100 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none text-gray-700 text-lg placeholder-gray-300"
                  />
                  <div className="text-right mt-2 text-xs text-gray-400">
                    按 Command/Ctrl + Enter 快速生成
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
                disabled={loading || !userInput.trim()}
                className={`
                  w-full py-4 rounded-2xl font-bold text-lg text-white shadow-lg shadow-primary/30 transition-all transform
                  flex items-center justify-center gap-3
                  ${loading || !userInput.trim()
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
                    <span>✨ 开始生成咒语</span>
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