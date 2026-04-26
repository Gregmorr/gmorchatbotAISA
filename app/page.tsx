'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Page() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-3xl font-bold">AISA RAG Chatbot</h1>

      <div className="flex-1 space-y-4 rounded-lg border p-4">
        {messages.map((message) => (
          <div key={message.id} className="whitespace-pre-wrap">
            <strong>{message.role === 'user' ? 'You' : 'Bot'}: </strong>
            {message.parts.map((part, index) =>
              part.type === 'text' ? <span key={index}>{part.text}</span> : null
            )}
          </div>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="flex-1 rounded border p-2"
          value={input}
          placeholder="Ask your documents something..."
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="rounded bg-black px-4 py-2 text-white" type="submit">
          {status === 'streaming' ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </main>
  );
}