
// 'use client'
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
// import { useEffect, useRef, useState } from 'react'

// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs'

// export default function PdfTextExtractor({ pdfUrl, onReady }) {
//   const [text, setText] = useState('')
//   const [error, setError] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isPaused, setIsPaused] = useState(false)
//   const [lines, setLines] = useState([])
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const [shouldPlayNext, setShouldPlayNext] = useState(false)
//   const [isReady, setIsReady] = useState(false)

//   const audioRef = useRef(null)


//   const extractText = async () => {
//     try {
//       setIsLoading(true)
//       setIsReady(false)
//       const loadingTask = pdfjsLib.getDocument(pdfUrl)
//       const pdf = await loadingTask.promise
//       let extracted = ''
  
//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i)
//         const content = await page.getTextContent()
//         const pageText = content.items.map((item) => item.str).join(' ')
//         extracted += `${pageText}\n`
//       }
  
//       setText(extracted)
//       setIsReady(true)
//       onReady?.()
//     } catch (err) {
//       console.error('PDF extraction failed:', err)
//       setError('Error extracting text from PDF.')
//       setIsReady(false)
//     } finally {
//       setIsLoading(false)
//     }
//   }
  
//   useEffect(() => {
//     extractText()
//   }, [pdfUrl])

//   const handleSpeakLineByLine = () => {
//     if (!text.trim()) return

//     handleStop()
//     const splitLines = text.split('.').filter(Boolean)
//     setLines(splitLines)
//     setCurrentIndex(0)
//     setIsLoading(true)
//     setShouldPlayNext(true)
//   }

//   const playCurrentLine = async (line) => {
//     const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`

//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: line }),
//       })

//       if (!response.ok) throw new Error('TTS request failed')

//       const blob = await response.blob()
//       const audio = new Audio(URL.createObjectURL(blob))
//       audioRef.current = audio
//       audio.play()

//       audio.onended = () => {
//         setCurrentIndex((prev) => prev + 1)
//         setShouldPlayNext(true)
//       }

//     } catch (error) {
//       console.error('TTS error:', error)
//       setIsLoading(false)
//     }
//   }

//   // 🧠 Play logic when currentIndex or shouldPlayNext changes
//   useEffect(() => {
//     if (lines.length === 0 || isPaused || !shouldPlayNext || currentIndex >= lines.length) {
//       if (currentIndex >= lines.length) setIsLoading(false)
//       return
//     }

//     const currentLine = lines[currentIndex]
//     setShouldPlayNext(false)
//     playCurrentLine(currentLine)
//   }, [currentIndex, lines, isPaused, shouldPlayNext])

//   const handlePause = () => {
//     if (audioRef.current && !audioRef.current.paused) {
//       audioRef.current.pause()
//       setIsPaused(true)
//     }
//   }

//   const handleResume = () => {
//     if (audioRef.current && audioRef.current.paused) {
//       audioRef.current.play()
//       setIsPaused(false)
//     }
//   }

//   const handleStop = () => {
//     if (audioRef.current) {
//       audioRef.current.pause()
//       audioRef.current.currentTime = 0
//       audioRef.current = null
//     }
//     setLines([])
//     setCurrentIndex(0)
//     setIsPaused(false)
//     setShouldPlayNext(false)
//     setIsLoading(false)
//   }

//   if (error)  return <div className="flex items-center absolute w-full justify-center h-screen bg-red-50">
//   <div className="flex items-center gap-4 bg-white border-2 border-red-300 rounded-xl shadow-lg p-8">
//     <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 18.93A10 10 0 1 1 18.93 5.07 10 10 0 0 1 5.07 18.93z" />
//     </svg>
//     <h1 className="text-2xl font-semibold text-red-700">Invalid PDF URL</h1>
//   </div>
// </div>

// if (!isReady) return null


//   return (
//     <div className="p-6 bg-[#004AAD] text-white w-full text-center">
//   <div className="max-w-5xl mx-auto">
//     <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-snug">
//       Washington State<br/>Department of Social and Health Services
//     </h1>
//     <h5 className="font-semibold text-white text-lg sm:text-xl md:text-2xl mt-2">
//       Accessible Newsletter Viewer
//     </h5>

//     <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
//       <button
//         onClick={handleSpeakLineByLine}
//         disabled={isLoading}
//         className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base"
//       >
//         Listen
//       </button>
//       <button
//         onClick={handlePause}
//         disabled={!audioRef.current || isPaused}
//         className="px-5 py-2 bg-yellow-400 text-black rounded disabled:opacity-50 text-sm sm:text-base"
//       >
//         Pause
//       </button>
//       <button
//         onClick={handleResume}
//         disabled={!audioRef.current || !isPaused}
//         className="px-5 py-2 bg-lime-500 text-black rounded disabled:opacity-50 text-sm sm:text-base"
//       >
//         Resume
//       </button>
//       <button
//         onClick={handleStop}
//         disabled={!audioRef.current && !isLoading}
//         className="px-5 py-2 bg-red-500 text-white rounded disabled:opacity-50 text-sm sm:text-base"
//       >
//         Stop
//       </button>

//       <p>{text}</p>
//     </div>
//   </div>
// </div>

//   )
// }


// 'use client';
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
// import { useEffect, useRef, useState } from 'react';

// pdfjsLib.GlobalWorkerOptions.workerSrc =
//   'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';

// export default function PdfTextExtractor({ pdfUrl, onReady }) {
//   const [text, setText] = useState('');
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isPaused, setIsPaused] = useState(false);
//   const [lines, setLines] = useState([]);
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [shouldPlayNext, setShouldPlayNext] = useState(false);
//   const [isReady, setIsReady] = useState(false);

//   const audioRef = useRef(null);
//   const audioCacheRef = useRef({});

//   const extractText = async () => {
//     try {
//       setIsLoading(true);
//       setIsReady(false);
//       const loadingTask = pdfjsLib.getDocument(pdfUrl);
//       const pdf = await loadingTask.promise;
//       let extracted = '';

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         const pageText = content.items.map((item) => item.str).join(' ');
//         extracted += `${pageText}\n`;
//       }

//       setText(extracted);
//       setIsReady(true);
//       onReady?.();
//     } catch (err) {
//       console.error('PDF extraction failed:', err);
//       setError('Error extracting text from PDF.');
//       setIsReady(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };


//   // const extractText = async () => {
//   //   try {
//   //     setIsLoading(true);
//   //     setIsReady(false);
  
//   //     const loadingTask = pdfjsLib.getDocument(pdfUrl);
//   //     const pdf = await loadingTask.promise;
//   //     let fullText = '';
  
//   //     for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//   //       const page = await pdf.getPage(pageNum);
//   //       const content = await page.getTextContent();
  
//   //       let pageLines = [];
//   //       let lastY = null;
//   //       let line = '';
  
//   //       for (const item of content.items) {
//   //         const { str, transform } = item;
//   //         const thisY = transform[5]; // vertical position (Y)
  
//   //         if (lastY !== null && Math.abs(thisY - lastY) > 10) {
//   //           pageLines.push(line.trim());
//   //           line = '';
//   //         }
  
//   //         line += str + ' ';
//   //         lastY = thisY;
//   //       }
  
//   //       if (line.trim()) {
//   //         pageLines.push(line.trim());
//   //       }
  
//   //       fullText += pageLines.join('\n') + '\n\n'; // page spacing
//   //     }
  
//   //     const cleaned = fullText
//   //       .replace(/\n{3,}/g, '\n\n') // limit excessive blank lines
//   //       .replace(/[ \t]+/g, ' ')   // normalize spaces
//   //       .trim();
  
//   //     setText(cleaned);
//   //     setIsReady(true);
//   //     onReady?.();
//   //   } catch (err) {
//   //     console.error('PDF extraction failed:', err);
//   //     setError('Error extracting text from PDF.');
//   //     setIsReady(false);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
  
//   useEffect(() => {
//     extractText();
//   }, [pdfUrl]);

//   const preloadAudio = async (line, index) => {
//     const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`;

//     try {
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: line }),
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
//     const splitLines = text.split('.').filter(Boolean);

//     setLines(splitLines);
//     setCurrentIndex(0);
//     setIsLoading(true);
//     setShouldPlayNext(true);

//     await preloadAudio(splitLines[0], 0);
//   };

//   const playCurrentLine = async (line, index) => {
//     let blob = audioCacheRef.current[index];

//     if (!blob) {
//       // fallback if not cached
//       const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`;
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: line }),
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
//     <div className="p-6 bg-[#004AAD] text-white w-full text-center">
//       <div className="max-w-5xl mx-auto">
//         <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-snug">
//           Washington State<br />
//           Department of Social and Health Services
//         </h1>
//         <h5 className="font-semibold text-white text-lg sm:text-xl md:text-2xl mt-2">
//           Accessible Newsletter Viewer
//         </h5>

//         <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
//           <button
//             onClick={handleSpeakLineByLine}
//             disabled={isLoading}
//             className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-sm sm:text-base"
//           >
//             Listen
//           </button>
//           <button
//             onClick={handlePause}
//             disabled={!audioRef.current || isPaused}
//             className="px-5 py-2 bg-yellow-400 text-black rounded disabled:opacity-50 text-sm sm:text-base"
//           >
//             Pause
//           </button>
//           <button
//             onClick={handleResume}
//             disabled={!audioRef.current || !isPaused}
//             className="px-5 py-2 bg-lime-500 text-black rounded disabled:opacity-50 text-sm sm:text-base"
//           >
//             Resume
//           </button>
//           <button
//             onClick={handleStop}
//             disabled={!audioRef.current && !isLoading}
//             className="px-5 py-2 bg-red-500 text-white rounded disabled:opacity-50 text-sm sm:text-base"
//           >
//             Stop
//           </button>
//         </div>

//         {/* <div className="text-left mt-6 bg-white text-black p-4 rounded shadow-sm text-sm whitespace-pre-wrap">
//           {text}
//         </div> */}
//       </div>
//     </div>
//   );
// }


'use client';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { useEffect, useRef, useState } from 'react';

pdfjsLib.GlobalWorkerOptions.workerSrc =
  'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs';

export default function PdfTextExtractor({ pdfUrl, onReady }) {
  const [text, setText] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [lines, setLines] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldPlayNext, setShouldPlayNext] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const audioRef = useRef(null);
  const audioCacheRef = useRef({});

  const extractText = async () => {
    try {
      setIsLoading(true);
      setIsReady(false);
      const loadingTask = pdfjsLib.getDocument('https://storage.googleapis.com/wadshs/WAM232_1.pdf');
      const pdf = await loadingTask.promise;
      let fullText = '';

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const content = await page.getTextContent();

        let lines = [];
        let lastY = null;
        let line = '';

        for (const item of content.items) {
          const { str, transform } = item;
          const y = transform[5];

          if (lastY !== null && Math.abs(y - lastY) > 10) {
            lines.push(line.trim());
            line = '';
          }

          line += str + ' ';
          lastY = y;
        }

        if (line.trim()) lines.push(line.trim());
        fullText += lines.join('\n') + '\n\n';
      }

      const cleaned = fullText
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]+/g, ' ')
        .trim();

      setText(cleaned);
      setIsReady(true);
      onReady?.();
    } catch (err) {
      console.error('PDF extraction failed:', err);
      setError('Error extracting text from PDF.');
      setIsReady(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    extractText();
  }, [pdfUrl]);

  const preloadAudio = async (line, index) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`;

    try {
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
    }
  };

  const handleSpeakLineByLine = async () => {
    if (!text.trim()) return;

    handleStop();
    const splitLines = text
      .split(/[.?!]\s+/) // break on sentence-ending punctuation
      .map((line) => line.trim())
      .filter((line) => line); // remove empty lines

    setLines(splitLines);
    setCurrentIndex(0);
    setIsLoading(true);
    setShouldPlayNext(true);

    await preloadAudio(splitLines[0], 0);
  };

  const playCurrentLine = async (line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      setCurrentIndex((prev) => prev + 1);
      setShouldPlayNext(true);
      return;
    }

    let blob = audioCacheRef.current[index];

    if (!blob) {
      const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!response.ok) throw new Error('TTS request failed');
      blob = await response.blob();
    }

    const audio = new Audio(URL.createObjectURL(blob));
    audioRef.current = audio;
    audio.play();

    if (lines[index + 1]) {
      preloadAudio(lines[index + 1], index + 1);
    }

    audio.onended = () => {
      setCurrentIndex((prev) => prev + 1);
      setShouldPlayNext(true);
    };
  };

  useEffect(() => {
    if (
      lines.length === 0 ||
      isPaused ||
      !shouldPlayNext ||
      currentIndex >= lines.length
    ) {
      if (currentIndex >= lines.length) setIsLoading(false);
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
    }
  };

  const handleResume = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play();
      setIsPaused(false);
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
          Washington State<br />
          Department of Social and Health Services
        </h1>
        <h5 className="font-semibold text-white text-lg sm:text-xl md:text-2xl mt-2">
          Accessible Newsletter Viewer
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
            disabled={!audioRef.current || isPaused}
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
            disabled={!audioRef.current && !isLoading}
            className="px-5 py-2 bg-red-500 text-white rounded disabled:opacity-50 text-sm sm:text-base"
          >
            Stop
          </button>
        </div>
      </div>
    </div>
    <div dangerouslySetInnerHTML={{
      __html: text
    }} />
    </>
  );
}
