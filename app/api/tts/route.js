import { NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';
import path from 'path';

const client = new textToSpeech.TextToSpeechClient({
  keyFilename: path.join(process.cwd(), process.env.GOOGLE_TTS),
});

export async function POST(req) {
  const { text } = await req.json();

  // replace all the . from text with a ''
  text.replaceAll(/\./g, '');

  const request = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: process.env.GOOGLE_TTS_VOICE || 'en-US-Chirp3-HD-Autonoe',
    },
    audioConfig: { 
      audioEncoding: 'MP3',
      speakingRate: process.env.GOOGLE_TTS_SPEED || 1.0,
      pitch: process.env.GOOGLE_TTS_PITCH || 0.0,
    },
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
