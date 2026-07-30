import React from 'react';

interface Article {
  id: string;
  title: string;
  description: string;
  summary: string;
  sentiment: string;
  source: string;
  url: string;
  published_at: string;
}

// Helper function to render AI JSON summaries as bullet points
const renderSummary = (summary: string) => {
  if (!summary) return null;
  try {
    const parsed = JSON.parse(summary);
    if (Array.isArray(parsed)) {
      return (
        <ul className="list-disc list-inside space-y-1.5 text-xs text-zinc-300">
          {parsed.map((point, idx) => (
            <li key={idx} className="leading-relaxed">{point}</li>
          ))}
        </ul>
      );
    }
  } catch {
    // If it's standard text, render as standard paragraph
  }
  return <p className="text-xs text-zinc-300 leading-relaxed">{summary}</p>;
};

export default function NewsCard({ article }: { article: Article }) {
  const getSentimentBadge = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'bullish':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'bearish':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20';
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between hover:border-zinc-700 transition shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">{article.source}</span>
          <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${getSentimentBadge(article.sentiment)}`}>
            {article.sentiment || 'Neutral'}
          </span>
        </div>

        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-base font-bold text-white hover:text-emerald-400 transition line-clamp-2 mb-3"
        >
          {article.title}
        </a>

        <div className="bg-zinc-950/80 p-3.5 rounded-lg border border-zinc-800/80 mb-4">
          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-2">AI Key Takeaways</p>
          {renderSummary(article.summary)}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 border-t border-zinc-800/60 pt-3 mt-auto">
        <span>{new Date(article.published_at).toLocaleDateString()}</span>
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-emerald-400 hover:underline flex items-center gap-1 text-xs font-semibold"
        >
          Read Source →
        </a>
      </div>
    </div>
  );
}
