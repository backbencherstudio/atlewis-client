
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
import { useEffect, useState, useRef } from 'react';
import NotFound from './NotFound';

export default function PDFViewer({ fileName }) {
  const [pdfDoc, setPdfDoc] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pdfBlobUrl, setPdfBlobUrl] = useState('');
  const viewerRef = useRef(null);
  const pdfScriptRef = useRef(null);

  // Load PDF.js library
  useEffect(() => {
    if (window.pdfjsLib) {
      initializePDFViewer();
      return;
    }

    pdfScriptRef.current = document.createElement('script');
    pdfScriptRef.current.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.min.js';
    pdfScriptRef.current.onload = initializePDFViewer;
    document.body.appendChild(pdfScriptRef.current);

    return () => {
      if (pdfScriptRef.current && document.body.contains(pdfScriptRef.current)) {
        document.body.removeChild(pdfScriptRef.current);
      }
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, []);

  // Fetch PDF blob
  useEffect(() => {
    const fetchPdfBlob = async () => {
      try {
        setIsLoading(true);
        setError('');
        const response = await fetch(`/api/stream-pdf?fileName=${fileName}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch PDF');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfBlobUrl(url);
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err.message);
      }
    };

    if (fileName) {
      fetchPdfBlob();
    }
  }, [fileName]);

  const initializePDFViewer = () => {
    window.pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.1.81/pdf.worker.min.js';
  };

  // Load PDF document
  useEffect(() => {
    if (!pdfBlobUrl || !window.pdfjsLib) return;

    const loadDocument = async () => {
      try {
        const loadingTask = window.pdfjsLib.getDocument({
          url: pdfBlobUrl,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.1.81/cmaps/',
          cMapPacked: true,
        });
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setNumPages(pdf.numPages);
        setCurrentPage(1);
        await renderPage(pdf, 1);
      } catch (err) {
        console.error('PDF loading error:', err);
        setError('Failed to load PDF document');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [pdfBlobUrl]);

  const renderPage = async (pdf, pageNum) => {
    if (!viewerRef.current) return;
    
    const viewer = viewerRef.current;
    while (viewer.firstChild) {
      viewer.removeChild(viewer.firstChild);
    }

    try {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 });
      
      const maxWidth = 900;
      const baseScale = maxWidth / viewport.width;
      const adjustedScale = baseScale * scale;
      const adjustedViewport = page.getViewport({ scale: adjustedScale });

      const canvas = document.createElement('canvas');
      canvas.className = 'mx-auto shadow-lg rounded-xl border-2 border-white/20 bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-300/30';
      canvas.width = adjustedViewport.width;
      canvas.height = adjustedViewport.height;

      const context = canvas.getContext('2d', { 
        willReadFrequently: true,
        alpha: false
      });
      
      await page.render({
        canvasContext: context,
        viewport: adjustedViewport,
        intent: 'display',
        enableWebGL: true,
      }).promise;

      viewer.appendChild(canvas);
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.25, 3.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setScale(1.0);
  const handleCustomZoom = (zoomLevel) => setScale(zoomLevel);

  const handlePreviousPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const handleNextPage = () => currentPage < numPages && setCurrentPage(currentPage + 1);
  const handlePageInput = (e) => {
    const pageNum = parseInt(e.target.value);
    if (!isNaN(pageNum)) {
      const newPage = Math.max(1, Math.min(pageNum, numPages));
      setCurrentPage(newPage);
    }
  };

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(pdfDoc, currentPage);
    }
  }, [currentPage, scale, pdfDoc]);

  if (error) return <NotFound />;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="text-blue-800 font-medium">Loading your document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">DSHS Document Viewer</h1>
          <p className="mt-2 opacity-90">Washington State Department of Social and Health Services</p>
        </div>
      </header>

      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg shadow-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage <= 1}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 shadow-sm">
                <input
                  type="number"
                  value={currentPage}
                  onChange={handlePageInput}
                  min="1"
                  max={numPages}
                  className="w-16 text-center focus:outline-none"
                />
                <span className="text-gray-500 mx-2">of</span>
                <span>{numPages}</span>
              </div>

              <button
                onClick={handleNextPage}
                disabled={currentPage >= numPages}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Next
                <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                title="Zoom Out"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </button>

              <div className="flex items-center space-x-1">
                {[0.5, 0.75, 1, 1.5, 2].map((zoomLevel) => (
                  <button
                    key={zoomLevel}
                    onClick={() => handleCustomZoom(zoomLevel)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      Math.abs(scale - zoomLevel) < 0.1
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {zoomLevel * 100}%
                  </button>
                ))}
              </div>

              <button
                onClick={handleZoomIn}
                disabled={scale >= 3.0}
                className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors shadow-sm"
                title="Zoom In"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6">
        <div 
          ref={viewerRef}
          className="bg-gray-100 rounded-xl p-4 shadow-inner min-h-[600px] flex items-center justify-center"
        />
      </main>

      <footer className="bg-gray-900 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Washington State Department of Social and Health Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}