'use client';

import { useEffect, useState } from 'react';

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

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>('ALL');
  const [darkMode, setDarkMode] = useState<boolean>(true);

  // Read saved theme from localStorage on load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setDarkMode(false);
    } else {
      setDarkMode(true);
    }
    fetchArticles();
  }, []);

  // Toggle Dark / Light Theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Embed Compact TradingView Ticker Widget
  useEffect(() => {
    const container = document.getElementById('tv-ticker-container');
    if (!container) return;

    container.innerHTML = ''; // Re-render widget clean on theme change

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
        { proName: 'FOREXCOM:NSXUSD', title: 'NASDAQ' },
        { proName: 'OANDA:XAUUSD', title: 'Gold' },
        { proName: 'FX_IDC:EURUSD', title: 'EUR/USD' },
        { proName: 'FX_IDC:GBPUSD', title: 'GBP/USD' }
      ],
      showSymbolLogo: true,
      colorTheme: darkMode ? 'dark' : 'light',
      isTransparent: true,
      displayMode: 'compact',
      locale: 'en'
    });

    container.appendChild(script);
  }, [darkMode]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scrape');
      const data = await res.json();
      if (data.articles) {
        setArticles(data.articles);
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

  const handleShare = (article: Article) => {
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

  const filteredArticles = articles.filter((art) => {
    const matchesSearch = 
      art.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.source?.toLowerCase().includes(searchQuery.toLowerCase());

    const artSentiment = (art.sentiment || 'neutral').toUpperCase();
    const matchesFilter = activeFilter === 'ALL' || artSentiment === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const getSentimentBadge = (sentiment?: string) => {
    const val = (sentiment || 'neutral').toUpperCase();
    if (val === 'BULLISH' || val === 'POSITIVE') {
      return darkMode 
        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
        : 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
    if (val === 'BEARISH' || val === 'NEGATIVE') {
      return darkMode
        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
        : 'bg-rose-50 text-rose-700 border border-rose-200';
    }
    return darkMode
      ? 'bg-slate-800 text-slate-300 border border-slate-700'
      : 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans pb-12 ${
      darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Slim, Compact Top Market Ticker Bar */}
      <div className={`border-b sticky top-0 z-50 backdrop-blur ${
        darkMode ? 'border-[#1C2541] bg-[#0B132B]/90' : 'border-slate-200 bg-white/90'
      }`}>
        <div id="tv-ticker-container" className="w-full h-[36px] overflow-hidden"></div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Top Header Navigation */}
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
              Navy & White Catalyst Intelligence Feed
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark / Light Mode Switch */}
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

        {/* Controls: Search Bar & Sentiment Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search macro topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full text-sm rounded-lg px-4 py-2 border focus:outline-none focus:border-[#3A86FF] transition-colors ${
                darkMode
                  ? 'bg-[#1C2541] border-slate-700 text-slate-100 placeholder-slate-400'
                  : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-sm'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md border transition-all ${
                  activeFilter === filter
                    ? 'bg-[#3A86FF] text-white border-[#3A86FF]'
                    : darkMode
                    ? 'bg-[#1C2541] text-slate-300 border-slate-700 hover:text-white'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 shadow-sm'
                }`}
              >
                {filter}
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

        {/* Articles Feed */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id || article.url}
                className={`rounded-xl p-4 flex flex-col justify-between border transition-all space-y-3 ${
                  darkMode
                    ? 'bg-[#1C2541]/70 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
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
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSentimentBadge(article.sentiment)}`}>
                      {(article.sentiment || 'NEUTRAL').toUpperCase()}
                    </span>
                  </div>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-base font-bold line-clamp-2 transition-colors ${
                      darkMode ? 'text-white hover:text-[#3A86FF]' : 'text-slate-900 hover:text-[#3A86FF]'
                    }`}
                  >
                    {article.title}
                  </a>

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
                    onClick={() => handleShare(article)}
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
    </div>
  );
}
