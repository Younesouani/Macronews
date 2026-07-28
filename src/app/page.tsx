'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import NewsCard from '@/components/news/NewsCard';

export default function Home() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ingesting, setIngesting] = useState(false);

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
      alert(`Scraped & processed ${data.count || 0} new articles!`);
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

  return (
    <main className="min-h-screen bg-black text-white p-6 max-w-7xl mx-auto">
      <header className="border-b border-zinc-800 pb-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-zinc-900 border border-zinc-800 rounded-xl h-72 animate-pulse" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border border-zinc-800 p-6">
          <p className="text-zinc-300 text-lg font-medium mb-2">No news stored in your database yet!</p>
          <p className="text-sm text-zinc-500 mb-6">Tap the button above to pull live economic headlines and generate AI summaries.</p>
          <button
            onClick={triggerScraper}
            disabled={ingesting}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition"
          >
            {ingesting ? 'Processing...' : 'Fetch First Articles'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </main>
  );
}
