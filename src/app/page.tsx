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

  // Load articles automatically when entering the website
  useEffect(() => {
    fetchArticles();
  }, []);

  // Embed TradingView Ticker Widget
  useEffect(() => {
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
      colorTheme: 'dark',
      isTransparent: true,
      displayMode: 'adaptive',
      locale: 'en'
    });

    const container = document.getElementById('tv-ticker-container');
    if (container && container.childElementCount === 0) {
      container.appendChild(script);
    }
  }, []);

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
      alert('Article link copied to clipboard!');
    }
  };

  // Filter articles based on Search + Sentiment
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
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
    }
    if (val === 'BEARISH' || val === 'NEGATIVE') {
      return 'bg-rose-500/10 text-rose-400 border border-rose-500/30';
    }
    return 'bg-slate-800 text-slate-300 border border-slate-700';
  };

  return (
    <div className="min-h-screen bg-black text-slate-100 font-sans pb-12">
      {/* 1. CNBC-Style Top Live Market Ticker */}
      <div className="border-b border-slate-800 bg-slate-950/80 sticky top-0 z-50 backdrop-blur">
        <div id="tv-ticker-container" className="w-full"></div>
      </div>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              MACRO<span className="text-emerald-500">NEWS</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Institutional-grade macro catalyst feed
            </p>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : '⚡ Sync Latest Feed'}
          </button>
        </div>

        {/* 2. Controls: Search Bar & Sentiment Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search news or tickers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1">
            {['ALL', 'BULLISH', 'BEARISH', 'NEUTRAL'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all ${
                  activeFilter === filter
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="text-center py-12 text-slate-500 text-sm">
            Loading latest macro articles...
          </div>
        )}

        {/* 3. Articles Feed Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id || article.url}
                className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all space-y-3"
              >
                {/* Optional Image */}
                {article.image_url && (
                  <div className="w-full h-44 rounded-lg overflow-hidden bg-slate-950">
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
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold truncate">
                      {article.source}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${getSentimentBadge(
                        article.sentiment
                      )}`}
                    >
                      {(article.sentiment || 'NEUTRAL').toUpperCase()}
                    </span>
                  </div>

                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base font-bold text-slate-100 hover:text-emerald-400 transition-colors line-clamp-2"
                  >
                    {article.title}
                  </a>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/50 text-[11px] text-slate-500">
                  <span>
                    {article.published_at
                      ? new Date(article.published_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Recently'}
                  </span>

                  <button
                    onClick={() => handleShare(article)}
                    className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    🔗 Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filteredArticles.length === 0 && (
          <div className="text-center py-12 text-slate-500 text-sm">
            No articles found matching your criteria.
          </div>
        )}
      </main>
    </div>
  );
}
