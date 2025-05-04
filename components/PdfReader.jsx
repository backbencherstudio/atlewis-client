// 'use client';
// import { useEffect, useRef, useState } from 'react';

// export default function PdfReader({ text, onReady }) {
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [lines, setLines] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [shouldPlayNext, setShouldPlayNext] = useState(false);
//   const [isReady, setIsReady] = useState(false);

//   const audioRef = useRef(null);
//   const audioCacheRef = useRef({});

//   // If the `text` prop is passed, split the text into smaller chunks (3-5 words)
//   useEffect(() => {
//     if (text) {
//       // Split the text into chunks of 3-5 words
//       const splitLines = text
//         .split(/\s+/) // Split by spaces to get individual words
//         .reduce((acc, word, index, words) => {
//           const chunkSize = 5; // Define the chunk size (3-5 words)
//           const chunk = Math.floor(index / chunkSize);

//           if (!acc[chunk]) acc[chunk] = [];
//           acc[chunk].push(word);

//           return acc;
//         }, [])
//         .map((chunk) => chunk.join(' ')); // Join the words back into a sentence

//       setLines(splitLines);
//       setIsReady(true);
//       onReady?.();
//     }
//   }, [text, onReady]);

//   const preloadAudio = async (line, index) => {
//     const trimmed = line?.trim();
//     if (!trimmed) return;

//     // const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`;
//     const API_URL = '/api/tts';

//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: trimmed }),
//       });

//       if (!response.ok) throw new Error('TTS request failed');
//       const blob = await response.blob();
//       audioCacheRef.current[index] = blob;
//     } catch (error) {
//       console.error(`Failed to preload audio for line ${index}:`, error);
//     }
//   };

//   const handleSpeakLineByLine = async () => {
//     if (!text.trim()) return;

//     handleStop();
//     const splitLines = text
//       .split(/[.?!]\s+/) // break on sentence-ending punctuation
//       .map((line) => line.trim())
//       .filter((line) => line); // remove empty lines

//     setLines(splitLines);
//     setCurrentIndex(0);
//     setIsLoading(true);
//     setShouldPlayNext(true);

//     await preloadAudio(splitLines[0], 0);
//   };

//   const playCurrentLine = async (line, index) => {
//     const trimmed = line.trim();
//     if (!trimmed) {
//       setCurrentIndex((prev) => prev + 1);
//       setShouldPlayNext(true);
//       return;
//     }

//     let blob = audioCacheRef.current[index];

//     if (!blob) {
//       // const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`;
//       const API_URL = '/api/tts';
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: trimmed }),
//       });

//       if (!response.ok) throw new Error('TTS request failed');
//       blob = await response.blob();
//     }

//     const audio = new Audio(URL.createObjectURL(blob));
//     audioRef.current = audio;
//     audio.play();

//     if (lines[index + 1]) {
//       preloadAudio(lines[index + 1], index + 1);
//     }

//     audio.onended = () => {
//       setCurrentIndex((prev) => prev + 1);
//       setShouldPlayNext(true);
//     };
//   };

//   useEffect(() => {
//     if (
//       lines.length === 0 ||
//       isPaused ||
//       !shouldPlayNext ||
//       currentIndex >= lines.length
//     ) {
//       if (currentIndex >= lines.length) setIsLoading(false);
//       return;
//     }

//     const currentLine = lines[currentIndex];
//     setShouldPlayNext(false);
//     playCurrentLine(currentLine, currentIndex);
//   }, [currentIndex, lines, isPaused, shouldPlayNext]);

//   const handlePause = () => {
//     if (audioRef.current && !audioRef.current.paused) {
//       audioRef.current.pause();
//       setIsPaused(true);
//     }
//   };

//   const handleResume = () => {
//     if (audioRef.current && audioRef.current.paused) {
//       audioRef.current.play();
//       setIsPaused(false);
//     }
//   };

//   const handleStop = () => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       audioRef.current.currentTime = 0;
//       audioRef.current = null;
//     }

//     setLines([]);
//     setCurrentIndex(0);
//     setIsPaused(false);
//     setShouldPlayNext(false);
//     setIsLoading(false);
//     audioCacheRef.current = {};
//   };

//   if (error)
//     return (
//       <div className="flex items-center absolute w-full justify-center h-screen bg-red-50">
//         <div className="flex items-center gap-4 bg-white border-2 border-red-300 rounded-xl shadow-lg p-8">
//           <svg
//             className="w-10 h-10 text-red-500"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               d="M12 9v2m0 4h.01M5.07 18.93A10 10 0 1 1 18.93 5.07 10 10 0 0 1 5.07 18.93z"
//             />
//           </svg>
//           <h1 className="text-2xl font-semibold text-red-700">Invalid PDF URL</h1>
//         </div>
//       </div>
//     );

//   if (!isReady) return null;

//   return (
//     <>
//       <div className="p-6 bg-[#004AAD] text-white w-full text-center">
//         <div className="max-w-5xl mx-auto">
//           <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-snug">
//             Washington State
//             <br />
//             Department of Social and Health Services
//           </h1>
//           <h5 className="font-semibold text-white text-lg sm:text-xl md:text-2xl mt-2">
//             Accessible Newsletter Viewer
//           </h5>

//           <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
//             <button
//               onClick={handleSpeakLineByLine}
//               disabled={isLoading}
//               className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base"
//             >
//               Listen
//             </button>
//             <button
//               onClick={handlePause}
//               disabled={!audioRef.current || isPaused}
//               className="px-5 py-2 bg-yellow-400 text-black rounded disabled:opacity-50 text-sm sm:text-base"
//             >
//               Pause
//             </button>
//             <button
//               onClick={handleResume}
//               disabled={!audioRef.current || !isPaused}
//               className="px-5 py-2 bg-lime-500 text-black rounded disabled:opacity-50 text-sm sm:text-base"
//             >
//               Resume
//             </button>
//             <button
//               onClick={handleStop}
//               disabled={!audioRef.current && !isLoading}
//               className="px-5 py-2 bg-red-500 text-white rounded disabled:opacity-50 text-sm sm:text-base"
//             >
//               Stop
//             </button>
//           </div>
//         </div>
//       </div>
//       {/* <div
//         dangerouslySetInnerHTML={{
//           __html: text,
//         }}
//       /> */}
//     </>
//   );
// }

'use client';
import { useEffect, useRef, useState } from 'react';

export default function PdfReader({ text, onReady }) {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldPlayNext, setShouldPlayNext] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const audioCacheRef = useRef({});

  useEffect(() => {
    if (text) {
      const splitLines = text
        .split(/\s+/)
        .reduce((acc, word, index) => {
          const chunkSize = 5;
          const chunk = Math.floor(index / chunkSize);
          if (!acc[chunk]) acc[chunk] = [];
          acc[chunk].push(word);
          return acc;
        }, [])
        .map((chunk) => chunk.join(' '));

      setLines(splitLines);
      setIsReady(true);
      onReady?.();
    }
  }, [text, onReady]);

  const preloadAudio = async (line, index) => {
    let trimmed = line?.trim();
    // Remove all dots from the text before sending to TTS
    trimmed = trimmed?.replace(/\./g, ' ').replace(/\s+/g, ' ').trim();
    
    if (!trimmed) return;

    const API_URL = '/api/tts';

    try {
      if (index === 0) setIsAudioLoading(true);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) throw new Error('TTS request failed');
      const blob = await response.blob();
      audioCacheRef.current[index] = blob;
    } catch (error) {
      console.error(`Failed to preload audio for line ${index}:`, error);
    } finally {
      if (index === 0) setIsAudioLoading(false);
    }
  };

  const handleSpeakLineByLine = async () => {
    if (!text.trim()) return;
    
    handleStop();
    const splitLines = text
      .split(/[.?!]\s+/)
      .map((line) => line.trim())
      .filter((line) => line);

    setLines(splitLines);
    setCurrentIndex(0);
    setIsLoading(true);
    setShouldPlayNext(true);
    setIsPaused(false);

    await preloadAudio(splitLines[0], 0);
  };

  const playCurrentLine = async (line, index) => {
    let trimmed = line.trim();
    // Remove all dots from the text before sending to TTS
    trimmed = trimmed.replace(/\./g, ' ').replace(/\s+/g, ' ').trim();

    if (!trimmed) {
      setCurrentIndex((prev) => prev + 1);
      setShouldPlayNext(true);
      return;
    }

    let blob = audioCacheRef.current[index];

    if (!blob) {
      const API_URL = '/api/tts';
      setIsAudioLoading(true);

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) throw new Error('TTS request failed');
      blob = await response.blob();

      setIsAudioLoading(false);
    }

    const audio = new Audio(URL.createObjectURL(blob));
    audioRef.current = audio;
    
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setCurrentIndex((prev) => prev + 1);
      setShouldPlayNext(true);
    });

    audio.play();

    if (lines[index + 1]) {
      preloadAudio(lines[index + 1], index + 1);
    }
  };

  useEffect(() => {
    if (
      lines.length === 0 ||
      isPaused ||
      !shouldPlayNext ||
      currentIndex >= lines.length
    ) {
      if (currentIndex >= lines.length) {
        setIsLoading(false);
        setIsPlaying(false);
      }
      return;
    }

    const currentLine = lines[currentIndex];
    setShouldPlayNext(false);
    playCurrentLine(currentLine, currentIndex);
  }, [currentIndex, lines, isPaused, shouldPlayNext]);

  const handlePause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  };

  const handleResume = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setLines([]);
    setCurrentIndex(0);
    setIsPaused(false);
    setShouldPlayNext(false);
    setIsLoading(false);
    setIsPlaying(false);
    audioCacheRef.current = {};
  };

  if (error)
    return (
      <div className="flex items-center absolute w-full justify-center h-screen bg-red-50">
        <div className="flex items-center gap-4 bg-white border-2 border-red-300 rounded-xl shadow-lg p-8">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M5.07 18.93A10 10 0 1 1 18.93 5.07 10 10 0 0 1 5.07 18.93z"
            />
          </svg>
          <h1 className="text-2xl font-semibold text-red-700">Invalid PDF URL</h1>
        </div>
      </div>
    );

  if (!isReady) return null;

  return (
    <>
      <div className="p-6 bg-[#004AAD] text-white w-full text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-snug">
            Washington State
            <br />
            Department of Social and Health Services
          </h1>
          <h5 className="font-semibold text-white text-lg sm:text-xl md:text-2xl mt-2">
            Wellness Education Accessible Newsletter
          </h5>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <button
              onClick={handleSpeakLineByLine}
              disabled={isLoading}
              className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base"
            >
              Listen
            </button>
            <button
              onClick={handlePause}
              disabled={!isPlaying}
              className="px-5 py-2 bg-yellow-400 text-black rounded disabled:opacity-50 text-sm sm:text-base"
            >
              Pause
            </button>
            <button
              onClick={handleResume}
              disabled={!audioRef.current || !isPaused}
              className="px-5 py-2 bg-lime-500 text-black rounded disabled:opacity-50 text-sm sm:text-base"
            >
              Resume
            </button>
            <button
              onClick={handleStop}
              disabled={!isPlaying && !isLoading}
              className="px-5 py-2 bg-red-500 text-white rounded disabled:opacity-50 text-sm sm:text-base"
            >
              Stop
            </button>
          </div>

          {isAudioLoading && (
            <div className="flex items-center justify-center gap-2 text-white mt-4">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Preparing audio...</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
