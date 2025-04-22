// 'use client'
// import { useEffect, useState } from 'react'
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
// import { speakText } from '@/lib/api'

// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs'

// export default function PdfTextExtractor({ pdfUrl = '/book.pdf' }) {
//   const [text, setText] = useState('')
//   const [error, setError] = useState(null)
//   const [isSpeaking, setIsSpeaking] = useState(false)

//   useEffect(() => {
//     const extractText = async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(pdfUrl)
//         const pdf = await loadingTask.promise
//         let extracted = ''

//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i)
//           const content = await page.getTextContent()
//           const pageText = content.items.map((item) => item.str).join(' ')
//           extracted += `\n${pageText}`
//         }

//         setText(extracted)
//       } catch (err) {
//         console.error('PDF extraction failed:', err)
//         setError('Error extracting text from PDF.')
//       }
//     }

//     extractText()
//   }, [pdfUrl])

//   const handleSpeakLineByLine = async () => {
//     if (!text.trim()) return

//     setIsSpeaking(true)
//     const lines = text.split('\n').filter((line) => line.trim().length > 0)

//     for (const line of lines) {
//       try {
//         const audioBlob = await speakText(line)
//         const audioUrl = URL.createObjectURL(audioBlob)
//         const audio = new Audio(audioUrl)
//         await new Promise((resolve) => {
//           audio.onended = resolve
//           audio.onerror = resolve
//           audio.play()
//         })
//       } catch (err) {
//         console.error('Error speaking line:', err)
//       }
//     }

//     setIsSpeaking(false)
//   }

//   if (error) return <p className="text-red-500">{error}</p>

//   return (
//     <div className="p-4">
//       <button
//         disabled={isSpeaking || !text}
//         onClick={handleSpeakLineByLine}
//         className="mb-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
//       >
//         {isSpeaking ? 'Speaking...' : 'Speak Line-by-Line'}
//       </button>

//       <div className="whitespace-pre-wrap text-gray-800 bg-gray-100 border rounded shadow max-h-[80vh] overflow-auto p-4">
//         {text || 'Extracting text from PDF...'}
//       </div>
//     </div>
//   )
// }




// 'use client'
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
// import { useEffect, useRef, useState } from 'react'

// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs'

// export default function PdfTextExtractor({ pdfUrl = '/book.pdf' }) {
//   const [text, setText] = useState('')
//   const [error, setError] = useState(null)
//   const [voices, setVoices] = useState([])
//   const [selectedVoice, setSelectedVoice] = useState(null)
//   const [isSpeaking, setIsSpeaking] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isPaused, setIsPaused] = useState(false)
//   const audioRef = useRef(null)
//   const utteranceRef = useRef(null)

//   const playAudioFromText = async (inputText) => {
//     try {
//       const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`
//       const response = await fetch(API_URL, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: inputText }),
//       })
  
//       if (!response.ok) throw new Error('TTS request failed')
  
//       const blob = await response.blob()
//       // const audioUrl = URL.createObjectURL(blob)
//       // const audio = new Audio(audioUrl)
//       const audio = new Audio()
//       audio.src = URL.createObjectURL(blob)
//       // audio.crossOrigin = 'anonymous'
//       audioRef.current = audio
//       audio.play()

//       setIsPaused(false)
//       setIsPaused(false)
//       return new Promise((resolve) => {
//         audio.onended = () => {
//           audioRef.current = null
//           resolve()
//         }
//         audio.onerror = () => {
//           audioRef.current = null
//           resolve()
//         }
//       })
//     } catch (error) {
//       console.error('Error playing audio:', error)
      
//     }
   
//   }

//   // const handleSpeakAll = async () => {
//   //   if (!text.trim()) return
//   //   setIsLoading(true)
//   //   await playAudioFromText(text)
//   //   setIsLoading(false)
//   // }

//   const handleSpeakLineByLine = async () => {
//     if (!text.trim()) return
//     setIsLoading(true)
//     const lines = text.split('.').filter(Boolean)

//     for (const line of lines) {
//       await playAudioFromText(line)
//     }

//     setIsLoading(false)
//   }

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
//       setIsPaused(false)
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     const extractText = async () => {
//       try {
//         const loadingTask = pdfjsLib.getDocument(pdfUrl)
//         const pdf = await loadingTask.promise
//         let extracted = ''

//         for (let i = 1; i <= pdf.numPages; i++) {
//           const page = await pdf.getPage(i)
//           const content = await page.getTextContent()
//           const pageText = content.items.map((item) => item.str).join(' ')
//           extracted += `${pageText}\n`
//         }

//         setText(extracted)
//       } catch (err) {
//         console.error('PDF extraction failed:', err)
//         setError('Error extracting text from PDF.')
//       }
//     }

//     extractText()
//   }, [pdfUrl])

//   // useEffect(() => {
//   //   const loadVoices = () => {
//   //     const voices = speechSynthesis.getVoices()
//   //     setVoices(voices)
//   //     if (voices.length > 0 && !selectedVoice) {
//   //       setSelectedVoice(voices.find(v => v.default) || voices[0])
//   //     }
//   //   }

//   //   loadVoices()
//   //   window.speechSynthesis.onvoiceschanged = loadVoices
//   // }, [])

//   // const speak = () => {
//   //   if (!text.trim() || isSpeaking) return

//   //   const utterance = new SpeechSynthesisUtterance(text)
//   //   utterance.voice = selectedVoice || null
//   //   utterance.onend = () => setIsSpeaking(false)
//   //   speechSynthesis.speak(utterance)
//   //   utteranceRef.current = utterance
//   //   setIsSpeaking(true)
//   // }

//   // const pause = () => {
//   //   if (speechSynthesis.speaking) speechSynthesis.pause()
//   // }

//   // const resume = () => {
//   //   if (speechSynthesis.paused) speechSynthesis.resume()
//   // }

//   // const stop = () => {
//   //   speechSynthesis.cancel()
//   //   setIsSpeaking(false)
//   // }

//   if (error) return <p className="text-red-500">{error}</p>

//   return (
//     <div className="p-6 bg-[#004AAD] text-white  w-full text-center">
//       <h1 className="font-bold text-white text-[1.75rem]/[1.4]">Washington State Department of Social and Health Services</h1>
//       <h5 className="font-semibold  text-white text-[1.75rem]/[1.4]">Accessible Newsletter Viewer</h5>

//       <div className="flex items-center justify-center gap-2 my-4">
//         <button
//           onClick={handleSpeakLineByLine}
//           disabled={isLoading}
//           className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//         >
//           Listen
//         </button>
//         <button
//           onClick={handlePause}
//           disabled={!audioRef.current || isPaused}
//           className="px-4 py-2 bg-yellow-400 text-black rounded disabled:opacity-50"
//         >
//           Pause
//         </button>
//         <button
//           onClick={handleResume}
//           disabled={!audioRef.current || !isPaused}
//           className="px-4 py-2 bg-lime-500 text-black rounded disabled:opacity-50"
//         >
//           Resume
//         </button>
//         <button
//           onClick={handleStop}
//           disabled={!audioRef.current}
//           className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
//         >
//           Stop
//         </button>
      
//         {/* <button onClick={pause} className="bg-white text-blue-800 px-4 py-1 rounded">Pause</button>
//         <button onClick={resume} className="bg-white text-blue-800 px-4 py-1 rounded">Resume</button>
//         <button onClick={stop} className="bg-white text-blue-800 px-4 py-1 rounded">Stop</button>

//         <label className="ml-4 text-white">Voice:</label>
//         <select
//           value={selectedVoice?.name}
//           onChange={(e) => {
//             const voice = voices.find(v => v.name === e.target.value)
//             if (voice) setSelectedVoice(voice)
//           }}
//           className="text-black px-2 py-1 rounded bg-white border-white outline-none"
//         >
//           {voices.map((voice) => (
//             <option key={voice.name} value={voice.name}>
//               {voice.name} - {voice.lang} {voice.default ? '[Default]' : ''}
//             </option>
//           ))}
//         </select> */}
//       </div>
// {/* 
//       <button
//         onClick={speak}
//         disabled={isSpeaking}
//         className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded mb-4"
//       >
//         {isSpeaking ? 'Speaking...' : 'Speak'}
//       </button> */}

//       {/* <div className="whitespace-pre-wrap text-gray-800 bg-gray-100 border rounded shadow max-h-[60vh] overflow-auto p-4">
//         {text || 'Extracting text from PDF...'}
//       </div> */}
//     </div>
//   )
// }

// 'use client'
// import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
// import { useEffect, useRef, useState } from 'react'

// pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs'

// export default function PdfTextExtractor({ pdfUrl = '/book.pdf' }) {
//   const [text, setText] = useState('')
//   const [error, setError] = useState(null)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isPaused, setIsPaused] = useState(false)
//   const [lines, setLines] = useState([])
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const audioRef = useRef(null)

//   const extractText = async () => {
//     try {
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
//     } catch (err) {
//       console.error('PDF extraction failed:', err)
//       setError('Error extracting text from PDF.')
//     }
//   }

//   useEffect(() => {
//     extractText()
//   }, [pdfUrl])

//   const handleSpeakLineByLine = async () => {
//     if (!text.trim()) return

//     handleStop()
//     const splitLines = text.split('.').filter(Boolean)
//     setLines(splitLines)
//     setCurrentIndex(0)
//     setIsLoading(true)
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
//       }

//     } catch (error) {
//       console.error('TTS error:', error)
//       setIsLoading(false)
//     }
//   }

//   useEffect(() => {
//     if (lines.length === 0 || isPaused || currentIndex >= lines.length) {
//       if (currentIndex >= lines.length) {
//         setIsLoading(false)
//       }
//       return
//     }

//     const currentLine = lines[currentIndex]
//     playCurrentLine(currentLine)
//   }, [currentIndex, lines, isPaused])

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
//     setIsLoading(false)
//   }

//   if (error) return <p className="text-red-500">{error}</p>

//   return (
//     <div className="p-6 bg-[#004AAD] text-white  w-full text-center">
//       <h1 className="font-bold text-white text-[1.75rem]/[1.4]">Washington State Department of Social and Health Services</h1>
//       <h5 className="font-semibold  text-white text-[1.75rem]/[1.4]">Accessible Newsletter Viewer</h5>

//       <div className="flex items-center justify-center gap-2 my-4">
//         <button
//           onClick={handleSpeakLineByLine}
//           disabled={isLoading}
//           className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
//         >
//           Listen
//         </button>
//         <button
//           onClick={handlePause}
//           disabled={!audioRef.current || isPaused}
//           className="px-4 py-2 bg-yellow-400 text-black rounded disabled:opacity-50"
//         >
//           Pause
//         </button>
//         <button
//           onClick={handleResume}
//           disabled={!audioRef.current || !isPaused}
//           className="px-4 py-2 bg-lime-500 text-black rounded disabled:opacity-50"
//         >
//           Resume
//         </button>
//         <button
//           onClick={handleStop}
//           disabled={!audioRef.current && !isLoading}
//           className="px-4 py-2 bg-red-500 text-white rounded disabled:opacity-50"
//         >
//           Stop
//         </button>
//       </div>
//     </div>
//   )
// }


'use client'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs'
import { useEffect, useRef, useState } from 'react'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs'

export default function PdfTextExtractor({ pdfUrl = '/book.pdf' }) {
  const [text, setText] = useState('')
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [lines, setLines] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [shouldPlayNext, setShouldPlayNext] = useState(false)
  const audioRef = useRef(null)

  const extractText = async () => {
    try {
      const loadingTask = pdfjsLib.getDocument(pdfUrl)
      const pdf = await loadingTask.promise
      let extracted = ''

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i)
        const content = await page.getTextContent()
        const pageText = content.items.map((item) => item.str).join(' ')
        extracted += `${pageText}\n`
      }

      setText(extracted)
    } catch (err) {
      console.error('PDF extraction failed:', err)
      setError('Error extracting text from PDF.')
    }
  }

  useEffect(() => {
    extractText()
  }, [pdfUrl])

  const handleSpeakLineByLine = () => {
    if (!text.trim()) return

    handleStop()
    const splitLines = text.split('.').filter(Boolean)
    setLines(splitLines)
    setCurrentIndex(0)
    setIsLoading(true)
    setShouldPlayNext(true)
  }

  const playCurrentLine = async (line) => {
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/tts/speak`

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: line }),
      })

      if (!response.ok) throw new Error('TTS request failed')

      const blob = await response.blob()
      const audio = new Audio(URL.createObjectURL(blob))
      audioRef.current = audio
      audio.play()

      audio.onended = () => {
        setCurrentIndex((prev) => prev + 1)
        setShouldPlayNext(true)
      }

    } catch (error) {
      console.error('TTS error:', error)
      setIsLoading(false)
    }
  }

  // 🧠 Play logic when currentIndex or shouldPlayNext changes
  useEffect(() => {
    if (lines.length === 0 || isPaused || !shouldPlayNext || currentIndex >= lines.length) {
      if (currentIndex >= lines.length) setIsLoading(false)
      return
    }

    const currentLine = lines[currentIndex]
    setShouldPlayNext(false)
    playCurrentLine(currentLine)
  }, [currentIndex, lines, isPaused, shouldPlayNext])

  const handlePause = () => {
    if (audioRef.current && !audioRef.current.paused) {
      audioRef.current.pause()
      setIsPaused(true)
    }
  }

  const handleResume = () => {
    if (audioRef.current && audioRef.current.paused) {
      audioRef.current.play()
      setIsPaused(false)
    }
  }

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setLines([])
    setCurrentIndex(0)
    setIsPaused(false)
    setShouldPlayNext(false)
    setIsLoading(false)
  }

  if (error) return <p className="text-red-500">{error}</p>

  return (
    <div className="p-6 bg-[#004AAD] text-white w-full text-center">
  <div className="max-w-5xl mx-auto">
    <h1 className="font-bold text-white text-2xl sm:text-3xl md:text-4xl leading-snug">
      Washington State Department of Social and Health Services
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

  )
}
