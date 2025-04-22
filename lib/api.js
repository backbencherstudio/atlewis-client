export const speakText = async (text) => {
  const res = await fetch("http://192.168.4.2:8000/tts/speak", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!res.ok) {
    throw new Error("TTS request failed");
  }

  return await res.blob(); // Get audio stream as Blob
};
