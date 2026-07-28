import React from 'react';

interface ArticleProps {
  article: {
    id: string;
    title: string;
    description: string;
    url: string;
    image_url: string;
    source: string;
    category: string;
    summary: string;
    sentiment: 'Bullish' | 'Bearish' | 'Neutral';
    published_at: string;
  };
}

export default function NewsCard({ article }: ArticleProps) {
  const sentimentColor =
    article.sentiment === 'Bullish'
      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
      : article.sentiment === 'Bearish'
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
      : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition flex flex-col justify-between">
      {article.image_url && (
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-400 font-mono uppercase">{article.source}</span>
            <span className={`text-xs px-2.5 py-1 rounded-full border ${sentimentColor}`}>
              {article.sentiment}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">{article.title}</h2>
          <p className="text-zinc-400 text-sm mb-4 line-clamp-3">{article.summary || article.description}</p>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
          <span>{new Date(article.published_at).toLocaleDateString()}</span>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline font-semibold"
          >
            Read Source →
          </a>
        </div>
      </div>
    </div>
  );
}
