'use client'

import { useRealtimeNews } from '@/hooks/useRealtimeNews'

export default function NewsFeed({ initialArticles }: { initialArticles: any[] }) {
  const { articles } = useRealtimeNews(initialArticles)

  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <div
          key={article.id}
          className={`p-4 border rounded-xl transition-all duration-700 ${
            article.isNew
              ? 'bg-emerald-950/40 border-emerald-500/50 animate-pulse'
              : 'bg-zinc-900/50 border-zinc-800'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="font-semibold text-emerald-400">
              {article.source || 'WIRE'}
            </span>
            <span>{new Date(article.created_at).toLocaleTimeString()}</span>
          </div>
          <h3 className="text-base font-bold text-zinc-100">{article.title}</h3>
          <p className="text-sm text-zinc-400 mt-1 line-clamp-2">
            {article.description || article.content}
          </p>
        </div>
      ))}
    </div>
  )
}
