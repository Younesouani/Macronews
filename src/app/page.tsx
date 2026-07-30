'use client';

import { useEffect, useState, useRef } from 'react';
import TickerTape, { TickerItem } from '@/components/layout/TickerTape';
import Header from '@/components/layout/Header';
import FloatingBottomBar from '@/components/layout/FloatingBottomBar';
import LiquidityCharts from '@/components/news/LiquidityCharts';
import SearchBar from '@/components/news/SearchBar';
import ArticleGrid, { Article } from '@/components/news/ArticleGrid';
import EconomicCalendar from '@/components/calendar/EconomicCalendar';

const CATEGORIES = [
  { id: 'ALL', label: '🌐 All Feeds' },
  { id: 'FED_MACRO', label: '🏛️ Fed & Macro' },
  { id: 'TECH_STOCKS', label: '💻 Tech & Equities' },
  { id: 'ENERGY_COMMODITIES', label: '🛢️ Energy & Gold' },
  { id: 'CRYPTO', label: '🪙 Crypto & Web3' },
];

const TICKER_DATA: TickerItem[] = [
  { symbol: 'SPX', name: 'S&P 500', price: '5,432.10', change: '+0.45%', isUp: true, icon: '📈' },
  { symbol: 'NDX', name: 'NASDAQ', price: '17,890.50', change: '+0.82%', isUp: true, icon: '💻' },
  { symbol: 'XAU', name: 'GOLD', price: '$2,385.40', change: '-0.15%', isUp: false, icon: '🥇' },
  { symbol: 'EUR', name: 'EUR/USD', price: '1.0854', change: '+0.08%', isUp: true, icon: '💶' },
  { symbol: 'GBP', name: 'GBP/USD', price: '1.2740', change: '-0.21%', isUp: false, icon: '💷' },
  { symbol: 'OIL', name: 'BRENT', price: '$82.45', change: '+1.12%', isUp: true, icon: '🛢️' },
];

export default function Home() {
  const [activeView, setActiveView] = useState<'news' | 'charts' | 'calendar'>('news');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [, setSelectedArticle] = useState<Article | null>(null);

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
    <div
      className={`min-h-screen transition-colors duration-300 font-sans pb-24 ${
        darkMode ? 'bg-[#0B132B] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <TickerTape darkMode={darkMode} data={TICKER_DATA} />

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        <Header
          darkMode={darkMode}
          activeView={activeView}
          setActiveView={setActiveView}
          toggleTheme={toggleTheme}
        />

        {/* View 1: NEWS FEED */}
        {activeView === 'news' && (
          <div className="space-y-6 animate-fadeIn">
            <SearchBar
              darkMode={darkMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categories={CATEGORIES}
            />

            <ArticleGrid
              darkMode={darkMode}
              articles={filteredArticles}
              loading={loading}
              onSelectArticle={setSelectedArticle}
            />
          </div>
        )}

        {/* View 2: LIQUIDITY CHARTS */}
        {activeView === 'charts' && (
          <div className="animate-fadeIn">
            <LiquidityCharts darkMode={darkMode} />
          </div>
        )}

        {/* View 3: ECONOMIC CALENDAR */}
        {activeView === 'calendar' && (
          <div className="animate-fadeIn">
            <EconomicCalendar
              darkMode={darkMode}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
            />
          </div>
        )}
      </main>

      <FloatingBottomBar
        darkMode={darkMode}
        activeView={activeView}
        setActiveView={setActiveView}
      />
    </div>
  );
}
