import { google } from '@ai-sdk/google';
import { embed } from 'ai';

export async function embedText(text: string) {
  console.log("KEY BEING USED:", process.env.GOOGLE_GENERATIVE_AI_API_KEY);

  const { embedding } = await embed({
    model: google.textEmbeddingModel('gemini-embedding-001'),
    value: text,
  });

  return embedding;
}