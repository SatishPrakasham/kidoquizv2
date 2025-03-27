"use client"

import { Button } from "@/components/ui/button"
import { PlayIcon } from "lucide-react"

interface StartPageProps {
  onStart: () => void
}

export default function StartPage({ onStart }: StartPageProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Gradient header */}
      <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      <div className="p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
          Welcome to KidoQuiz!
        </h1>

        <div className="text-center mb-8 text-gray-600">
          <p className="mb-4">Test your knowledge with fun and educational questions!</p>
          <p className="mb-2">• Each question has a 30-second time limit</p>
          <p className="mb-2">• Select the answer you think is correct</p>
          <p className="mb-2">• See your final score at the end</p>
        </div>

        <Button
          onClick={onStart}
          className="w-full py-6 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <PlayIcon className="w-5 h-5" />
          Start Quiz
          <span className="ml-2">→</span>
        </Button>
      </div>
    </div>
  )
}

