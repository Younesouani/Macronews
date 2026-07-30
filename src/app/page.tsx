'use client';

import { useEffect, useState, useRef } from 'react';
import LiquidityCharts from "@/components/news/LiquidityCharts";

interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  image_url?: string | null;
  source: string;
  published_at: string;
  sentiment?: string;
  category?: string;
}

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: string;
  isUp: boolean;
  icon: string;
}

const CATEGORIES = [
  { id: 'ALL', label: '🌐 All Feeds' },
  { id: 'FED_MACRO', label: '🏛️ Fed & Macro' },
  { id: 'TECH_STOCKS', label: '💻 Tech & Equities' },
  { id: 'ENERGY_COMMODITIES', label: '🛢️ Energy & Gold' },
  { id: 'CRYPTO', label: '🪙 Crypto & Web3' },
];

export default function Home() {
  const [activeView, setActiveView] = useState<'news' | 'charts'>('news');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showCharts, setShowCharts] = useState<boolean>(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current.volume = 0.3;
  }, []);

  const playNewsSound = () => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  const tickerData: TickerItem[] = [
    { symbol: 'SPX', name: 'S&P 500', price: '5,432.10', change: '+0.45%', isUp: true, icon: '📈' },
    { symbol: 'NDX', name: 'NASDAQ', price: '17,890.50', change: '+0.82%', isUp: true, icon: '💻' },
    { symbol: 'XAU', name: 'GOLD', price: '$2,385.40', change: '-0.15%', isUp: false, icon: '🥇' },
    { symbol: 'EUR', name: 'EUR/USD', price: '1.0854', change: '+0.08%', isUp: true, icon: '💶' },
    { symbol: 'GBP', name: 'GBP/USD', price: '1.2740', change: '-0.21%', isUp: false, icon: '💷' },
    { symbol: 'OIL', name: 'BRENT', price: '$82.45', change: '+1.12%', isUp: true, icon: '🛢️' },
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme !== 'light');
    fetchArticles();
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scrape');
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
        playNewsSound();
      }
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const matchesCategoryFilter = (article: Article, categoryId: string) => {
    if (categoryId === 'ALL') return true;
    const text = `${article.title} ${article.summary} ${article.category || ''}`.toLowerCase();
    switch (categoryId) {
      case 'FED_MACRO':
        return /fed|federal reserve|inflation|cpi|rate|treasury|policy|strike|iran|us |war|economy|gdp|yield/.test(text);
      case 'TECH_STOCKS':
        return /tech|semiconductor|ai|nvidia|apple|microsoft|spacex|stock|shares|lam research|earnings|ceo|business/.test(text);
      case 'ENERGY_COMMODITIES':
        return /oil|brent|crude|gas|commodity|gold|metal|chevron|beef|prices|energy/.test(text);
      case 'CRYPTO':
        return /crypto|bitcoin|ethereum|solana|etf|trust|blockchain|morgan stanley|sec/.test(text);
      default:
        return true;
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.source?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch && matchesCategoryFilter(art, activeCategory);
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans pb-24 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      <style jsx global>{`
        @keyframes ticker-slide {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          width: max-content;
          animation: ticker-slide 20s linear infinite;
        }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>

      {/* Ticker Bar */}
      <div className={`border-b sticky top-0 z-40 backdrop-blur overflow-hidden py-2 ${
        darkMode ? 'border-[#1C2541] bg-[#0B132B]/95' : 'border-slate-200 bg-white/95'
      }`}>
        <div className="ticker-track text-xs font-semibold whitespace-nowrap flex gap-8">
          {[...tickerData, ...tickerData].map((item, idx) => (
            <div key={`${item.symbol}-${idx}`} className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm">{item.icon}</span>
              <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{item.name}</span>
              <span className="font-mono">{item.price}</span>
              <span className={`flex items-center text-[11px] font-bold ${item.isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
                {item.isUp ? '▲' : '▼'} {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Header Navigation */}
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 ${
          darkMode ? 'border-[#1C2541]' : 'border-slate-200'
        }`}>
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
              <span className={darkMode ? 'text-white' : 'text-[#0B132B]'}>MACRO</span>
              <span className="text-[#3A86FF]">NEWS</span>
            </h1>
            <p className={`text-xs mt-1 flex items-center gap-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              <span className="w-2 h-2 rounded-full bg-[#3A86FF] animate-pulse"></span>
              Institutional macro catalyst & liquidity monitor
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Desktop View Switcher Toggle */}
            <div className={`hidden sm:flex p-1 rounded-xl border ${
              darkMode ? 'bg-[#1C2541] border-slate-700' : 'bg-slate-200/70 border-slate-300'
            }`}>
              <button
                onClick={() => setActiveView('news')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                  activeView === 'news'
                    ? 'bg-[#3A86FF] text-white shadow-sm'
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                📰 Feed
              </button>
              <button
                onClick={() => setActiveView('charts')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${
                  activeView === 'charts'
                    ? 'bg-[#3A86FF] text-white shadow-sm'
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-black'
                }`}
              >
                📊 Liquidity Charts
              </button>
            </div>

            <button
              onClick={toggleTheme}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                darkMode ? 'bg-[#1C2541] text-amber-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}</button><button onClick={() => setShowCharts(!showCharts)} className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${showCharts ? 'bg-[#3A86FF] text-white border-[#3A86FF]' : darkMode ? 'bg-[#1C2541] text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-300'}`}>{showCharts ? '📰 Feed' : '📈 Charts'}
            </button>
          </div>
        </div>

        {/* View 1: NEWS FEED */}
        {activeView === 'news' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Search macro topics, ticker symbols, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-[#3A86FF] ${
                  darkMode ? 'bg-[#1C2541] border-slate-700 text-slate-100' : 'bg-white border-slate-300 text-slate-900'
                }`}
              />

              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-lg border whitespace-nowrap shrink-0 ${
                      activeCategory === cat.id
                        ? 'bg-[#3A86FF] text-white border-[#3A86FF]'
                        : darkMode ? 'bg-[#1C2541] text-slate-300 border-slate-700' : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {!loading && filteredArticles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id || article.url}
                    onClick={() => setSelectedArticle(article)}
                    className={`rounded-xl p-4 flex flex-col justify-between border cursor-pointer space-y-3 ${
                      darkMode ? 'bg-[#1C2541]/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}
                  >
                    {article.image_url && (
                      <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-900">
                        <img src={article.image_url} alt={article.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-extrabold text-slate-400">{article.source}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3A86FF]/15 text-[#3A86FF]">⚡ AI Brief</span>
                      </div>
                      <h3 className="text-base font-bold line-clamp-2">{article.title}</h3>
                      <p className="text-xs mt-2 line-clamp-3 text-slate-400">{article.summary}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* View 2: LIQUIDITY CHARTS */}
        {activeView === 'charts' && (
          <div className="animate-fadeIn">
            {showCharts && <LiquidityCharts darkMode={darkMode} />}
          </div>
        )}
      </main>

      {/* Mobile Vercel-Style Floating Action Bar */}
      <div className={`sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2 rounded-full border shadow-2xl backdrop-blur-md flex items-center gap-6 ${darkMode ? "bg-[#0B132B]/90 border-slate-700 text-white" : "bg-white/90 border-slate-300 text-slate-900"}`}>
        <button onClick={() => setShowCharts(false)} className={`text-xs font-bold flex flex-col items-center gap-0.5 ${!showCharts ? "text-[#3A86FF]" : "text-slate-400"}`}>
          <span className="text-base">📰</span>
          <span className="text-[10px]">News</span>
        </button>

        {/* Centered Middle Action Button */}
        <button onClick={() => setShowCharts(!showCharts)} className="w-11 h-11 rounded-full bg-[#3A86FF] hover:bg-blue-600 text-white font-bold flex items-center justify-center shadow-lg -mt-5 border-2 border-[#0B132B] transition-transform active:scale-95">
          📊
        </button>

        <button onClick={() => setShowCharts(true)} className={`text-xs font-bold flex flex-col items-center gap-0.5 ${showCharts ? "text-[#3A86FF]" : "text-slate-400"}`}>
          <span className="text-base">📈</span>
          <span className="text-[10px]">Charts</span>
        </button>
      </div>

      {/* Vercel-style Mobile Floating Middle Button */}
      <div className="fixed bottom-6 inset-x-0 sm:hidden flex justify-center z-50 pointer-events-none">
        <div className="pointer-events-auto p-1.5 rounded-full border border-slate-700/60 bg-[#0B132B]/90 backdrop-blur-md shadow-2xl flex items-center gap-1">
          <button
            onClick={() => setActiveView('news')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
              activeView === 'news'
                ? 'bg-[#3A86FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📰 Feed
          </button>
          <button
            onClick={() => setActiveView('charts')}
            className={`px-4 py-2 rounded-full text-xs font-black transition-all ${
              activeView === 'charts'
                ? 'bg-[#3A86FF] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📊 Charts
          </button>
        </div>
      </div>
    </div>
  );
}
