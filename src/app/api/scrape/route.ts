import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { supabase } from '@/lib/supabase/client';
import { summarizeArticle } from '@/lib/ai/groq';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

const RSS_FEEDS = [
  'https://search.yahoo.com/rss/headlines?s=finance',
  'https://www.cnbc.com/id/10000664/device/rss/rss.html',
  'https://feeds.content.dowjones.io/public/rss/mw_topstories',
];

export async function GET() {
  try {
    const insertedArticles = [];
    let totalItemsFound = 0;
    let skippedDuplicates = 0;

    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = feed.items || [];
        totalItemsFound += items.length;

        for (const item of items.slice(0, 5)) {
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
          const aiData = await summarizeArticle(item.title, textToAnalyze);

          const newArticle = {
            title: item.title,
            description: item.contentSnippet || item.title,
            content: item.content || item.contentSnippet || item.title,
            url: cleanUrl,
            image_url: null,
            source: feed.title || 'Financial News',
            category: 'Macro',
            summary: aiData.summary,
            sentiment: aiData.sentiment,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          };

          const { data, error } = await supabase.from('articles').insert([newArticle]).select();

          if (error) {
            console.error('Supabase Insert Error:', error.message);
          } else if (data && data.length > 0) {
            insertedArticles.push(data[0]);
          }
        }
      } catch (feedErr) {
        console.error(`Error reading feed ${feedUrl}:`, feedErr);
      }
    }

    return NextResponse.json({
      message: 'Scrape finished',
      totalItemsFound,
      skippedDuplicates,
      insertedCount: insertedArticles.length,
      articles: insertedArticles,
    });
  } catch (error: any) {
    console.error('Scrape API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
