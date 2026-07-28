import { NextResponse } from 'next/server';
import axios from 'axios';
import { supabase } from '@/lib/supabase/client';
import { summarizeArticle } from '@/lib/ai/groq';

export async function GET() {
  try {
    const newsApiKey = process.env.NEWS_API_KEY;
    if (!newsApiKey) {
      return NextResponse.json({ error: 'Missing News API key' }, { status: 500 });
    }

    // Fetch top economic/financial news
    const newsRes = await axios.get(
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=10&apiKey=${newsApiKey}`
    );

    const articles = newsRes.data.articles || [];
    const insertedArticles = [];

    for (const item of articles) {
      if (!item.title || !item.url || item.title === '[Removed]') continue;

      // Check if article already exists
      const { data: existing } = await supabase
        .from('articles')
        .select('id')
        .eq('url', item.url)
        .single();

      if (existing) continue;

      // Process with Groq AI
      const textToAnalyze = item.content || item.description || item.title;
      const aiData = await summarizeArticle(item.title, textToAnalyze);

      const newArticle = {
        title: item.title,
        description: item.description,
        content: item.content,
        url: item.url,
        image_url: item.urlToImage,
        source: item.source?.name || 'Economic News',
        category: 'Macro',
        summary: aiData.summary,
        sentiment: aiData.sentiment,
        published_at: item.publishedAt || new Date().toISOString(),
      };

      const { data, error } = await supabase.from('articles').insert([newArticle]).select();

      if (!error && data) {
        insertedArticles.push(data[0]);
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
