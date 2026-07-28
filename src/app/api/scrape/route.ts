import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { supabase } from '@/lib/supabase/client';
import { summarizeArticle } from '@/lib/ai/groq';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Reliable public economic RSS feeds
const RSS_FEEDS = [
  'https://search.yahoo.com/rss/headlines?s=finance',
  'https://www.cnbc.com/id/10000664/device/rss/rss.html',
  'https://feeds.content.dowjones.io/public/rss/mw_topstories',
];

export async function GET() {
  try {
    const insertedArticles = [];

    for (const feedUrl of RSS_FEEDS) {
      const feed = await parser.parseURL(feedUrl);

      for (const item of feed.items.slice(0, 5)) {
        if (!item.title || !item.link) continue;

        // Check if article is already stored in Supabase
        const { data: existing } = await supabase
          .from('articles')
          .select('id')
          .eq('url', item.link)
          .maybeSingle();

        if (existing) continue;

        const textToAnalyze = item.contentSnippet || item.content || item.title;
        const aiData = await summarizeArticle(item.title, textToAnalyze);

        const newArticle = {
          title: item.title,
          description: item.contentSnippet || item.title,
          content: item.content || item.contentSnippet || item.title,
          url: item.link,
          image_url: null,
          source: feed.title || 'Financial News',
          category: 'Macro',
          summary: aiData.summary,
          sentiment: aiData.sentiment,
          published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
        };

        const { data, error } = await supabase.from('articles').insert([newArticle]).select();

        if (!error && data) {
          insertedArticles.push(data[0]);
        }
      }
    }

    return NextResponse.json({
      message: 'Scraping and AI processing completed successfully',
      count: insertedArticles.length,
      articles: insertedArticles,
    });
  } catch (error: any) {
    console.error('Scrape API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
