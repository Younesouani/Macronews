import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function summarizeArticle(title: string, content: string) {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an expert financial strategist. Analyze the provided news text and return a JSON object with two fields: "summary" (a short 2-bullet summary highlighting economic impact) and "sentiment" ("Bullish", "Bearish", or "Neutral"). Output valid JSON only.',
        },
        {
          role: 'user',
          content: `Title: ${title}\nContent: ${content}`,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    return {
      summary: result.summary || 'No summary available.',
      sentiment: result.sentiment || 'Neutral',
    };
  } catch (error) {
    console.error('Groq AI Summarization error:', error);
    return { summary: content.slice(0, 150) + '...', sentiment: 'Neutral' };
  }
}
