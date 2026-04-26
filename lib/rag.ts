import { sql } from './db';
import { embedText } from './embeddings';

function vectorToSql(vector: number[]) {
  return `[${vector.join(',')}]`;
}

export async function retrieveRelevantChunks(query: string) {
  const embedding = await embedText(query);
  const vector = vectorToSql(embedding);

  const result = await sql`
    SELECT content, metadata, 1 - (embedding <=> ${vector}::vector) AS similarity
    FROM documents
    ORDER BY embedding <=> ${vector}::vector
    LIMIT 5;
  `;

  return result.rows;
}