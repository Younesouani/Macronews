import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { createClient } from '@supabase/supabase-js';
import { summarizeArticle } from '@/lib/ai/groq';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const parser = new Parser({
  timeout: 4000, // 4s timeout per feed so slow sources don't stall execution
  customFields: {
    item: [
      ['media:content', 'mediaContent'],
      ['media:thumbnail', 'mediaThumbnail'],
      ['enclosure', 'enclosure'],
    ],
  },
});

const RSS_FEEDS = [
  { url: 'https://finance.yahoo.com/news/rssindex', title: 'Yahoo Finance' },
  { url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', title: 'CNBC' },
  { url: 'https://feeds.content.dowjones.io/public/rss/mw_topstories', title: 'MarketWatch' },
  { url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', title: 'CoinDesk' },
];

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mujxnzazkqqxpjbftvtb.supabase.co';

function extractImageUrl(item: any): string | null {
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.enclosure?.url) return item.enclosure.url;

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
        { error: 'Supabase API Key is missing.' },
        { status: 500 }
      );
    }

    const supabase = createClient(SUPABASE_URL, supabaseKey);

    let totalItemsFound = 0;
    const errors: string[] = [];

    // 1. Parallel RSS feed fetching
    const feedResults = await Promise.allSettled(
      RSS_FEEDS.map((feed) => parser.parseURL(feed.url).then((res) => ({ feed, res })))
    );

    const candidates: Array<{ item: any; source: string }> = [];

    for (let i = 0; i < feedResults.length; i++) {
      const result = feedResults[i];
      const targetFeed = RSS_FEEDS[i];

      if (result.status === 'fulfilled') {
        const { feed, res } = result.value;
        const items = res.items || [];
        totalItemsFound += items.length;

        for (const item of items.slice(0, 5)) {
          if (item.title && item.link) {
            candidates.push({
              item,
              source: feed.title || res.title || 'Financial News',
            });
          }
        }
      } else {
        errors.push(`Feed Error (${targetFeed.url}): ${result.reason?.message || 'Failed to fetch'}`);
      }
    }

    if (candidates.length === 0) {
      const { data: cached } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(60);

      return NextResponse.json({
        message: 'No new items fetched',
        totalItemsFound: 0,
        skippedDuplicates: 0,
        insertedCount: 0,
        errors,
        articles: cached || [],
      });
    }

    // 2. Single batch DB check for existing URLs
    const candidateUrls = candidates.map((c) => c.item.link.trim());
    const { data: existingRows, error: checkErr } = await supabase
      .from('articles')
      .select('url')
      .in('url', candidateUrls);

    if (checkErr) {
      errors.push(`DB Existing Articles Check Error: ${checkErr.message}`);
    }

    const existingUrlSet = new Set((existingRows || []).map((row) => row.url));
    const newCandidates = candidates.filter((c) => !existingUrlSet.has(c.item.link.trim()));
    const skippedDuplicates = candidates.length - newCandidates.length;

    let insertedArticles: any[] = [];

    // 3. Parallel AI summarization and batch upsert for new articles
    if (newCandidates.length > 0) {
      const preparedArticles = await Promise.all(
        newCandidates.map(async ({ item, source }) => {
          const cleanUrl = item.link.trim();
          const textToAnalyze = item.contentSnippet || item.content || item.title;
          let aiSummary = item.contentSnippet || item.title;

          try {
            const aiData = await summarizeArticle(item.title, textToAnalyze);
            if (aiData?.summary) aiSummary = aiData.summary;
          } catch (aiErr: any) {
            errors.push(`AI Error (${item.title.slice(0, 20)}...): ${aiErr.message}`);
          }

          return {
            title: item.title,
            description: item.contentSnippet || item.title,
            content: item.content || item.contentSnippet || item.title,
            url: cleanUrl,
            image_url: extractImageUrl(item),
            source,
            category: 'Macro',
            summary: aiSummary,
            published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          };
        })
      );

      const { data, error: upsertErr } = await supabase
        .from('articles')
        .upsert(preparedArticles, { onConflict: 'url', ignoreDuplicates: true })
        .select();

      if (upsertErr) {
        errors.push(`DB Upsert Error: ${upsertErr.message}`);
      } else if (data) {
        insertedArticles = data;
      }
    }

    // 4. Return full sorted cache of articles instantly
    const { data: allArticles } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false })
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
