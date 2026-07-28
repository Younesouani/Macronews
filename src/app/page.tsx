'use client';

import { useEffect, useState, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import NewsCard from '@/components/news/NewsCard';

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  async function fetchNews() {
    setLoading(true);
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (!error && data) {
      setArticles(data);
    }
    setLoading(false);
  }

  async function triggerScraper() {
    setIngesting(true);
    try {
      const res = await fetch('/api/scrape');
      const data = await res.json();
      
      const inserted = data.insertedCount ?? 0;
      const skipped = data.skippedDuplicates ?? 0;
      
      alert(`Scraped & processed ${inserted} new articles! (${skipped} duplicates skipped)`);
      await fetchNews();
    } catch (error) {
      alert('Failed to run scraper. Check console.');
    } finally {
      setIngesting(false);
    }
  }

  useEffect(() => {
    fetchNews();
  }, []);

  // Filter articles based on sentiment tab and search query
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesSentiment =
        selectedSentiment === 'all' ||
        article.sentiment?.toLowerCase() === selectedSentiment.toLowerCase();

      const matchesSearch =
        article.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.source?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSentiment && matchesSearch;
    });
  }, [articles, selectedSentiment, searchQuery]);

  // Sentiment counts
  const counts = useMemo(() => {
    return {
      all: articles.length,
      bullish: articles.filter((a) => a.sentiment?.toLowerCase() === 'bullish').length,
      bearish: articles.filter((a) => a.sentiment?.toLowerCase() === 'bearish').length,
      neutral: articles.filter((a) => a.sentiment?.toLowerCase() === 'neutral').length,
    };
  }, [articles]);

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="border-b border-zinc-800 pb-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Macro<span className="text-emerald-500">News</span>
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Real-time macroeconomic summaries & AI-driven sentiment tracking.
          </p>
        </div>
        <button
          onClick={triggerScraper}
          disabled={ingesting}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition border border-emerald-500/30"
        >
          {ingesting ? 'Processing AI Pipeline...' : 'Fetch Latest News'}
        </button>
      </header>

      {/* Search & Sentiment Filters Bar */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-8">
        {/* Sentiment Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Stories', count: counts.all, activeClass: 'bg-zinc-800 text-white' },
            { id: 'bullish', label: 'Bullish 🐂', count: counts.bullish, activeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
            { id: 'bearish', label: 'Bearish 🐻', count: counts.bearish, activeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
            { id: 'neutral', label: 'Neutral ⚖️', count: counts.neutral, activeClass: 'bg-zinc-800 text-zinc-300' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedSentiment(tab.id)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-lg border transition flex items-center gap-2 whitespace-nowrap ${
                selectedSentiment === tab.id
                  ? `${tab.activeClass} border-zinc-700`
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className="bg-zinc-900 px-1.5 py-0.5 rounded text-[10px] text-zinc-400">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Search headlines or summary..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-zinc-500 hover:text-zinc-300"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Feed */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
          <p className="text-zinc-300 text-lg font-medium mb-2">No matching news found!</p>
          <p className="text-sm text-zinc-500 mb-6">
            {searchQuery
              ? `No articles match "${searchQuery}". Try clearing your search.`
              : `No ${selectedSentiment} articles available right now.`}
          </p>
          {(searchQuery || selectedSentiment !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedSentiment('all');
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-4 py-2 rounded-lg transition"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
