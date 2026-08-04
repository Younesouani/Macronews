'use client';

import { useState } from 'react';
import { useRealtimeNews } from '@/hooks/useRealtimeNews';

export interface Article {
  id: string;
  title: string;
  summary: string;
  url: string;
  image_url?: string | null;
  source: string;
  published_at: string;
  sentiment?: string;
  category?: string;
  description?: string;
  content?: string;
}

interface ArticleGridProps {
  darkMode: boolean;
  articles: Article[];
  loading: boolean;
  onSelectArticle: (article: Article) => void;
  activeCategory?: string;
  searchQuery?: string;
}

const matchesCategoryFilter = (article: Article, categoryId: string) => {
  if (!categoryId || categoryId === 'ALL') return true;
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

export default function ArticleGrid({
  darkMode,
  articles: initialArticles,
  loading,
  onSelectArticle,
  activeCategory = 'ALL',
  searchQuery = '',
}: ArticleGridProps) {
  const realtimeData = useRealtimeNews(initialArticles);
  const rawList: Article[] = Array.isArray(realtimeData)
    ? realtimeData
    : (realtimeData as any)?.articles || initialArticles || [];

  const articlesList = rawList.filter((art) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      art.title?.toLowerCase().includes(query) ||
      art.summary?.toLowerCase().includes(query) ||
      art.source?.toLowerCase().includes(query);

    return matchesSearch && matchesCategoryFilter(art, activeCategory);
  });

  const [activeModalArticle, setActiveModalArticle] = useState<Article | null>(null);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          ⚡ Scraping live institutional feeds...
        </p>
      </div>
    );
  }

  if (!articlesList || articlesList.length === 0) {
    return (
      <div className="text-center py-12">
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          No macro news matches your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {articlesList.map((article: Article) => {
          const displaySummary =
            article.summary || article.description || article.content || article.title;

          return (
            <div
              key={article.id || article.url}
              className={`rounded-xl p-4 flex flex-col justify-between border space-y-3 transition-all duration-200 hover:border-[#3A86FF]/50 ${
                darkMode
                  ? 'bg-[#1C2541]/70 border-slate-800 text-white'
                  : 'bg-white border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              {article.image_url && (
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-40 rounded-lg overflow-hidden bg-slate-900 block"
                >
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </a>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold text-slate-400">
                    {article.source}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveModalArticle(article);
                      onSelectArticle(article);
                    }}
                    className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3A86FF]/20 text-[#3A86FF] hover:bg-[#3A86FF] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    ⚡ AI Brief
                  </button>
                </div>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <h3 className="text-base font-bold line-clamp-2 group-hover:text-[#3A86FF] transition-colors">
                    {article.title}
                  </h3>
                </a>

                <p className="text-xs line-clamp-3 text-slate-400 leading-relaxed">
                  {displaySummary}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {article.published_at
                    ? new Date(article.published_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : 'Live Feed'}
                </span>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#3A86FF] font-semibold hover:underline flex items-center gap-1"
                >
                  Read Source &rarr;
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {activeModalArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-2xl p-6 border shadow-2xl relative space-y-4 ${
              darkMode ? 'bg-[#0B132B] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setActiveModalArticle(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#3A86FF]/20 text-[#3A86FF]">
                ⚡ AI Executive Brief
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase">
                {activeModalArticle.source}
              </span>
            </div>

            <h2 className="text-lg font-bold leading-snug">{activeModalArticle.title}</h2>

            <div
              className={`p-4 rounded-xl text-xs leading-relaxed border ${
                darkMode ? 'bg-[#1C2541] border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}
            >
              {activeModalArticle.summary ||
                activeModalArticle.description ||
                activeModalArticle.content ||
                'No additional summary content available.'}
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setActiveModalArticle(null)}
                className="px-4 py-2 text-xs font-bold rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close
              </button>
              <a
                href={activeModalArticle.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-xs font-bold rounded-lg bg-[#3A86FF] text-white hover:bg-blue-600 transition-colors"
              >
                Open Original Source &rarr;
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
