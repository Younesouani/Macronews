import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { summarizeArticle } from '@/lib/ai/groq';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

const RSS_FEEDS = [
  'https://finance.yahoo.com/news/rssindex',
  'https://www.cnbc.com/id/100003114/device/rss/rss.html',
  'https://feeds.content.dowjones.io/public/rss/mw_topstories',
];

const SUPABASE_URL = 'https://mujxnzazkqqxpjbftvtb.supabase.co';

// Helper to extract image URL from various RSS formats
function extractImageUrl(item: any): string | null {
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url) return item.enclosure.url;

  // Fallback: extract <img> tag src from content HTML
  const content = item.content || item['content:encoded'] || '';
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  if (imgMatch && imgMatch[1]) return imgMatch[1];

  return null;
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

        // Take top 15 from each feed
        for (const item of items.slice(0, 15)) {
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

          try {
            const aiData = await summarizeArticle(item.title, textToAnalyze);
            if (aiData?.summary) aiSummary = aiData.summary;
          } catch (aiErr: any) {
            errors.push(`AI Error (${item.title.slice(0, 20)}...): ${aiErr.message}`);
          }

          const extractedImage = extractImageUrl(item);

          const newArticle: Record<string, any> = {
            title: item.title,
            description: item.contentSnippet || item.title,
            content: item.content || item.contentSnippet || item.title,
            url: cleanUrl,
            image_url: extractedImage,
            source: feed.title || 'Financial News',
            category: 'Macro',
            summary: aiSummary,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          };

          let { data, error } = await supabase.from('articles').insert([newArticle]).select();

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

    // Increased limit to 60 articles
    const { data: allArticles } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(60);

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
