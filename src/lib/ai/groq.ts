import Groq from 'groq-sdk';

export async function summarizeArticle(title: string, text: string) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return { summary: text.slice(0, 150), sentiment: 'neutral' };
  }

  const groq = new Groq({ apiKey });

  try {
    const response = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a financial analyst. Provide a 2-sentence concise summary and sentiment (positive, negative, or neutral) in JSON format: {"summary": "...", "sentiment": "..."}'
        },
        {
          role: 'user',
          content: `Title: ${title}\nContent: ${text.slice(0, 1000)}`
        }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content;
    if (content) {
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Groq Error:', err);
  }

  return { summary: text.slice(0, 150), sentiment: 'neutral' };
}
