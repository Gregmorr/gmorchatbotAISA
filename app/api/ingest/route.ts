import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { embedText } from '@/lib/embeddings';

function chunkText(text: string, chunkSize = 800, overlap = 100) {
  const chunks: string[] = [];

  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  return chunks;
}

function vectorToSql(vector: number[]) {
  return `[${vector.join(',')}]`;
}

export async function POST(req: Request) {
  const { text, metadata = {} } = await req.json();

  if (!text || typeof text !== 'string') {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  const chunks = chunkText(text);

  for (const chunk of chunks) {
    const embedding = await embedText(chunk);
    const vector = vectorToSql(embedding);

    await sql`
      INSERT INTO documents (content, embedding, metadata)
      VALUES (${chunk}, ${vector}::vector, ${JSON.stringify(metadata)}::jsonb);
    `;
  }

  return NextResponse.json({
    success: true,
    chunksInserted: chunks.length,
  });
}