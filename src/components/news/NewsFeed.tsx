'use client'

import { useState } from 'react'

interface Article {
  id: string
  title: string
  summary: string
  source: string
  published_at: string
  sentiment?: string
  url: string
}

export default function NewsFeed({ initialArticles }: { initialArticles: Article[] }) {
  const [articles, setArticles] = useState<Article[]>(initialArticles || [])
  const [loading, setLoading] = useState(false)

  const handleRefresh = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/scrape')
      const data = await res.json()
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles)
      } else {
        window.location.reload()
      }
    } catch (err) {
      console.error('Refresh failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
        <span className="text-xs text-zinc-400 font-mono">
          Showing {articles.length} articles
        </span>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded transition disabled:opacity-50"
        >
          {loading ? 'Fetching...' : '⚡ Sync Latest Feed'}
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="p-8 text-center bg-zinc-900/30 rounded-xl border border-zinc-800">
          <p className="text-zinc-400 text-sm">No articles loaded yet.</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs rounded-lg"
          >
            Trigger Scraper
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((item) => (
            <a
              key={item.id || item.url}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-xl transition group"
            >
              <div className="flex justify-between items-start gap-4">
                <h2 className="text-base font-semibold text-zinc-100 group-hover:text-emerald-400 transition">
                  {item.title}
                </h2>
                {item.sentiment && (
                  <span
                    className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                      item.sentiment === 'positive' || item.sentiment === 'bullish'
                        ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
                        : item.sentiment === 'negative' || item.sentiment === 'bearish'
                        ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {item.sentiment}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-400 mt-2 line-clamp-2">
                {item.summary || item.title}
              </p>
              <div className="flex items-center gap-3 mt-3 text-[11px] text-zinc-500 font-mono">
                <span>{item.source}</span>
                <span>•</span>
                <span>{new Date(item.published_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
