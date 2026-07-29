import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { summarizeArticle } from '@/lib/ai/groq';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser();

// Initialize backend client bypassing RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mujxnzazkqqxpjbftvtb.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

const RSS_FEEDS = [
  'https://finance.yahoo.com/news/rssindex',
  'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  'https://feeds.content.dowjones.io/public/rss/mw_topstories',
];

export async function GET() {
  try {
    const insertedArticles = [];
    let totalItemsFound = 0;
    let skippedDuplicates = 0;
    let errors: string[] = [];

    for (const feedUrl of RSS_FEEDS) {
      try {
        const feed = await parser.parseURL(feedUrl);
        const items = feed.items || [];
        totalItemsFound += items.length;

        // Take up to 10 latest articles per feed
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
          let aiSentiment = 'neutral';

          try {
            const aiData = await summarizeArticle(item.title, textToAnalyze);
            if (aiData?.summary) aiSummary = aiData.summary;
            if (aiData?.sentiment) aiSentiment = aiData.sentiment;
          } catch (aiErr: any) {
            errors.push(`AI Error (${item.title.slice(0, 20)}...): ${aiErr.message}`);
          }

          const newArticle = {
            title: item.title,
            description: item.contentSnippet || item.title,
            content: item.content || item.contentSnippet || item.title,
            url: cleanUrl,
            image_url: null,
            source: feed.title || 'Financial News',
            category: 'Macro',
            summary: aiSummary,
            sentiment: aiSentiment,
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

    return NextResponse.json({
      message: 'Scrape finished',
      totalItemsFound,
      skippedDuplicates,
      insertedCount: insertedArticles.length,
      errors,
      articles: insertedArticles,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
