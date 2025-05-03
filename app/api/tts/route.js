import { NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';
import path from 'path';

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.join(process.cwd(), process.env.GOOGLE_TTS),
});

export async function POST(req) {
  const { text } = await req.json();

  const request = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Chirp3-HD-Algenib',
    },
    audioConfig: { audioEncoding: 'MP3' },
  };

  try {
    const [response] = await client.synthesizeSpeech(request);
    return new NextResponse(response.audioContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
