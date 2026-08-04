'use client';

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
  content?: string;
  description?: string;
}

interface ArticleGridProps {
  darkMode: boolean;
  articles: Article[];
  loading: boolean;
  onSelectArticle?: (article: Article) => void;
  selectedCategory?: string;
  searchQuery?: string;
}

export default function ArticleGrid({
  darkMode,
  articles: initialArticles,
  loading,
  onSelectArticle,
  selectedCategory = 'All Feeds',
  searchQuery = '',
}: ArticleGridProps) {
  const realtimeData = useRealtimeNews(initialArticles);
  const articlesList: Article[] = Array.isArray(realtimeData)
    ? realtimeData
    : (realtimeData as any)?.articles || initialArticles || [];

  const filteredArticles = articlesList.filter((article) => {
    const category = article.category || 'Macro';
    const catUpper = selectedCategory.toUpperCase();
    
    let matchesCategory = true;
    if (selectedCategory && selectedCategory !== 'All Feeds') {
      if (catUpper.includes('FED') || catUpper.includes('MACRO')) {
        matchesCategory = category === 'Macro' || category === 'Fed & Macro';
      } else if (catUpper.includes('TECH') || catUpper.includes('EQUIT')) {
        matchesCategory = category === 'Tech & Equities';
      } else if (catUpper.includes('CRYPTO')) {
        matchesCategory = category === 'Crypto';
      } else {
        matchesCategory = category.toLowerCase() === selectedCategory.toLowerCase();
      }
    }

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      article.title?.toLowerCase().includes(query) ||
      article.summary?.toLowerCase().includes(query) ||
      article.source?.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          ⚡ Scraping live institutional feeds...
        </p>
      </div>
    );
  }

  if (!filteredArticles || filteredArticles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          No macro news matches your search or category filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {filteredArticles.map((article: Article) => (
        <a
          key={article.id || article.url}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (onSelectArticle) {
              onSelectArticle(article);
            }
          }}
          className={`rounded-xl p-4 flex flex-col justify-between border cursor-pointer space-y-3 transition-all duration-200 hover:border-[#3A86FF]/50 ${
            darkMode ? 'bg-[#1C2541]/70 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
          }`}
        >
          {article.image_url && (
            <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-900">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-extrabold text-slate-400">
                {article.source}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#3A86FF]/15 text-[#3A86FF]">
                ⚡ AI Brief
              </span>
            </div>
            <h3 className="text-base font-bold line-clamp-2">{article.title}</h3>
            <p className="text-xs mt-2 line-clamp-3 text-slate-400">
              {article.summary || article.description || article.content || article.title}
            </p>
          </div>
        </a>
      ))}
    </div>
  );
}
