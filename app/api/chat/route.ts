import { google } from '@ai-sdk/google';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { retrieveRelevantChunks } from '@/lib/rag';

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const latestUserMessage = messages
    .filter((message) => message.role === 'user')
    .at(-1);

  const latestText =
    latestUserMessage?.parts
      ?.filter((part) => part.type === 'text')
      .map((part) => part.text)
      .join('\n') ?? '';

  const chunks = await retrieveRelevantChunks(latestText);

  const context = chunks
    .map((chunk, index) => `Source ${index + 1}:\n${chunk.content}`)
    .join('\n\n');

  const result = streamText({
    model: google('gemini-2.5-flash'),
    system: `
You are a helpful RAG chatbot.
Answer using the provided context when relevant.
If the context does not contain the answer, say you do not know based on the uploaded documents.

Context:
${context}
    `,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}