import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { summarizeArticle } from '@/lib/ai/groq';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

const RSS_FEEDS = [
  'https://finance.yahoo.com/news/rssindex',
  'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  'https://feeds.content.dowjones.io/public/rss/mw_topstories',
];

const SUPABASE_URL = 'https://mujxnzazkqqxpjbftvtb.supabase.co';

// Helper to guarantee valid sentiment string for PostgreSQL check constraint
function sanitizeSentiment(raw: string): string {
  if (!raw) return 'neutral';
  const val = raw.toLowerCase().trim();
  if (val.includes('bull') || val.includes('pos')) return 'bullish';
  if (val.includes('bear') || val.includes('neg')) return 'bearish';
  return 'neutral';
}

export async function GET() {
  try {
    const supabaseKey = (
      process.env.SUPABASE_SERVICE_ROLE_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      ''
    ).trim();

    if (!supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase API Key is missing in Vercel settings.' },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, supabaseKey);

    const insertedArticles = [];
    let totalItemsFound = 0;
    let skippedDuplicates = 0;
    let errors: string[] = [];

    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = feed.items || [];
        totalItemsFound += items.length;

        for (const item of items.slice(0, 10)) {
          if (!item.title || !item.link) continue;

          const cleanUrl = item.link.trim();
          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('url', cleanUrl)
            .maybeSingle();

          if (existing) {
            skippedDuplicates++;
            continue;
          }

          const textToAnalyze = item.contentSnippet || item.content || item.title;
          let aiSummary = item.contentSnippet || item.title;
          let rawSentiment = 'neutral';

          try {
            const aiData = await summarizeArticle(item.title, textToAnalyze);
            if (aiData?.summary) aiSummary = aiData.summary;
            if (aiData?.sentiment) rawSentiment = aiData.sentiment;
          } catch (aiErr: any) {
            errors.push(`AI Error (${item.title.slice(0, 20)}...): ${aiErr.message}`);
          }

          const cleanSentiment = sanitizeSentiment(rawSentiment);

          const newArticle = {
            title: item.title,
            description: item.contentSnippet || item.title,
            content: item.content || item.contentSnippet || item.title,
            url: cleanUrl,
            image_url: null,
            source: feed.title || 'Financial News',
            category: 'Macro',
            summary: aiSummary,
            sentiment: cleanSentiment,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          };

          const { data, error } = await supabase.from('articles').insert([newArticle]).select();
          if (error) {
            console.error('Supabase Insert Error:', error.message);
            errors.push(`DB Insert Error: ${error.message}`);
          } else if (data && data.length > 0) {
            insertedArticles.push(data[0]);
          }
        }
      } catch (feedErr: any) {
        errors.push(`Feed Error (${feedUrl}): ${feedErr.message}`);
      }
    }

    const { data: allArticles } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    return NextResponse.json({
      message: 'Scrape finished',
      totalItemsFound,
      skippedDuplicates,
      insertedCount: insertedArticles.length,
      errors,
      articles: allArticles || insertedArticles,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
