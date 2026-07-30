'use client';

import { useEffect, useState, useRef } from 'react';

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
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

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
    if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
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

  const handleSync = async () => {
    setSyncing(true);
    await fetchArticles();
    setSyncing(false);
  };

  const handleShare = (article: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.summary,
        url: article.url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(article.url);
      alert('Article link copied!');
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

    const matchesCat = matchesCategoryFilter(art, activeCategory);

    return matchesSearch && matchesCat;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans pb-12 ${
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
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Live Market Price Ticker */}
      <div className={`border-b sticky top-0 z-50 backdrop-blur overflow-hidden py-2 ${
        darkMode ? 'border-[#1C2541] bg-[#0B132B]/95' : 'border-slate-200 bg-white/95'
      }`}>
        <div className="ticker-track text-xs font-semibold whitespace-nowrap flex gap-8">
          {[...tickerData, ...tickerData].map((item, idx) => (
            <div key={`${item.symbol}-${idx}`} className="flex items-center gap-1.5 shrink-0">
              <span className="text-sm">{item.icon}</span>
              <span className={darkMode ? 'text-slate-200' : 'text-slate-800'}>{item.name}</span>
              <span className="font-mono">{item.price}</span>
              <span className={`flex items-center text-[11px] font-bold ${
                item.isUp ? 'text-emerald-500' : 'text-rose-500'
              }`}>
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
              Institutional-grade macro catalyst feed
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const nextSound = !soundEnabled;
                setSoundEnabled(nextSound);
                if (nextSound && audioRef.current) {
                  audioRef.current.play().catch(() => {});
                }
              }}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                soundEnabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : darkMode
                  ? 'bg-[#1C2541] text-slate-400 border-slate-700'
                  : 'bg-white text-slate-500 border-slate-300'
              }`}
            >
              {soundEnabled ? '🔔 Sound ON' : '🔕 Sound OFF'}
            </button>

            <button
              onClick={toggleTheme}
              className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 ${
                darkMode
                  ? 'bg-[#1C2541] text-amber-300 border-slate-700 hover:bg-slate-800'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100 shadow-sm'
              }`}
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>

            <button
              onClick={handleSync}
              disabled={syncing}
              className="px-4 py-2 bg-[#3A86FF] hover:bg-blue-600 text-white font-medium text-sm rounded-lg transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : '⚡ Sync Feed'}
            </button>
          </div>
        </div>

        {/* Search Bar + Scrollable Category Tabs */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search macro topics, ticker symbols, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full text-sm rounded-xl px-4 py-3 border focus:outline-none focus:border-[#3A86FF] transition-colors ${
              darkMode
                ? 'bg-[#1C2541] border-slate-700 text-slate-100 placeholder-slate-400'
                : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
            }`}
          />

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-lg border transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat.id
                    ? 'bg-[#3A86FF] text-white border-[#3A86FF] shadow-sm'
                    : darkMode
                    ? 'bg-[#1C2541] text-slate-300 border-slate-700 hover:border-slate-500 hover:text-white'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 shadow-xs'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className={`text-center py-12 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Loading articles...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredArticles.length === 0 && (
          <div className={`text-center py-12 border rounded-xl ${
            darkMode ? 'bg-[#1C2541]/40 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
          }`}>
            No articles match the selected sector or search query.
          </div>
        )}

        {/* Articles Feed Grid */}
        {!loading && filteredArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id || article.url}
                onClick={() => setSelectedArticle(article)}
                className={`rounded-xl p-4 flex flex-col justify-between border transition-all space-y-3 cursor-pointer ${
                  darkMode
                    ? 'bg-[#1C2541]/70 border-slate-800 hover:border-[#3A86FF]/50'
                    : 'bg-white border-slate-200 hover:border-[#3A86FF]/50 shadow-sm'
                }`}
              >
                {article.image_url && (
                  <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-900">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-extrabold truncate ${
                      darkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {article.source}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3A86FF]/15 text-[#3A86FF] border border-[#3A86FF]/30">
                      ⚡ AI Brief
                    </span>
                  </div>

                  <h3 className={`text-base font-bold line-clamp-2 transition-colors ${
                    darkMode ? 'text-white hover:text-[#3A86FF]' : 'text-slate-900 hover:text-[#3A86FF]'
                  }`}>
                    {article.title}
                  </h3>

                  <p className={`text-xs mt-2 line-clamp-3 leading-relaxed ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {article.summary}
                  </p>
                </div>

                <div className={`flex items-center justify-between pt-2 border-t text-[11px] ${
                  darkMode ? 'border-slate-700/50 text-slate-400' : 'border-slate-100 text-slate-500'
                }`}>
                  <span>
                    {article.published_at
                      ? new Date(article.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : 'Recently'}
                  </span>

                  <button
                    onClick={(e) => handleShare(article, e)}
                    className="hover:text-[#3A86FF] transition-colors flex items-center gap-1 font-semibold"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* 1-Click AI Executive Summary Modal */}
      {selectedArticle && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedArticle(null)}
        >
          <div 
            className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-5 transition-all ${
              darkMode ? 'bg-[#0B132B] border-[#1C2541] text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b pb-4 border-slate-700/40">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#3A86FF] bg-[#3A86FF]/10 px-2 py-0.5 rounded border border-[#3A86FF]/30">
                  ⚡ Executive Catalyst Brief
                </span>
                <h2 className="text-lg font-bold leading-snug pt-1">
                  {selectedArticle.title}
                </h2>
                <p className="text-xs text-slate-400">Source: {selectedArticle.source}</p>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className={`p-1.5 rounded-lg text-xs font-bold transition-colors ${
                  darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                ✕
              </button>
            </div>

            {/* Structured 3-Bullet Breakdown */}
            <div className="space-y-4 text-xs leading-relaxed">
              <div className={`p-3.5 rounded-xl border ${
                darkMode ? 'bg-[#1C2541]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-extrabold text-[#3A86FF] mb-1 flex items-center gap-1.5 text-xs">
                  📌 Key Macro Takeaway
                </h4>
                <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                  {selectedArticle.summary}
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                darkMode ? 'bg-[#1C2541]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-extrabold text-emerald-400 mb-1 flex items-center gap-1.5 text-xs">
                  📈 Market Impact & Sentiment
                </h4>
                <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                  Directly influences broad market sentiment, rates outlook, and sector valuations. Macro traders should track immediate volume shifts across related equities and asset classes.
                </p>
              </div>

              <div className={`p-3.5 rounded-xl border ${
                darkMode ? 'bg-[#1C2541]/60 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <h4 className="font-extrabold text-amber-400 mb-1 flex items-center gap-1.5 text-xs">
                  👀 Key Metrics / What to Watch Next
                </h4>
                <p className={darkMode ? 'text-slate-300' : 'text-slate-700'}>
                  Monitor upcoming central bank statements, official corporate press filings, and weekly institutional flow reports for confirmation of follow-through momentum.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-700/40">
              <a
                href={selectedArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#3A86FF] hover:bg-blue-600 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5"
              >
                Read Full Source Article ↗
              </a>

              <button
                onClick={() => setSelectedArticle(null)}
                className={`px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
                  darkMode ? 'border-slate-700 text-slate-300 hover:bg-slate-800' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
