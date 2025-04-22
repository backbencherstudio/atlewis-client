'use client'

import { useState } from "react"
import { speakText } from "../lib/api"

export default function Speak() {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSpeak = async () => {
    if (!text.trim()) return
    setIsLoading(true)
    try {
      const audioBlob = await speakText(text)
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    } catch (err) {
      console.error("Error speaking:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-4">
      <h1 className="text-3xl font-bold">FastAPI + Next.js TTS</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full max-w-md h-32 p-2 border border-gray-400 rounded"
        placeholder="Enter text to speak..."
      />
      <button
        onClick={handleSpeak}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {isLoading ? "Speaking..." : "Speak"}
      </button>
    </main>
  )
}
