'use client';
import { useState } from 'react';

export default function SpeechPlayer() {
  const [text, setText] = useState('');

  const handlePlay = async () => {
    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    new Audio(url).play();
  };

  return (
    <div className="space-y-4">
      <textarea
        className="border p-2 w-full"
        placeholder="Enter text"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handlePlay} className="bg-blue-600 text-white px-4 py-2 rounded">
        Play with Chirp3 Voice
      </button>
    </div>
  );
}
