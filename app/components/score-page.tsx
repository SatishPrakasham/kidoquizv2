"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import type { Question } from "../types/quiz"
import { CheckCircle, XCircle, RefreshCw, Eye, EyeOff } from "lucide-react"

interface ScorePageProps {
  score: number
  totalQuestions: number
  totalTime: number
  selectedAnswers: (string | null)[]
  questions: Question[]
  onRetry: () => void
}

export default function ScorePage({
  score,
  totalQuestions,
  totalTime,
  selectedAnswers,
  questions,
  onRetry,
}: ScorePageProps) {
  const [showReview, setShowReview] = useState(false)

  // Format total time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Calculate percentage score
  const percentage = Math.round((score / totalQuestions) * 100)

  // Get message based on score
  const getMessage = () => {
    if (percentage >= 80) return "Excellent job!"
    if (percentage >= 60) return "Good work!"
    if (percentage >= 40) return "Nice try!"
    return "Keep practicing!"
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Gradient header */}
      <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      <div className="p-6">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-2">
          Quiz Complete!
        </h1>

        <p className="text-center text-gray-600 mb-6">{getMessage()}</p>

        {/* Score display */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium text-gray-700">Your Score</div>
            <div className="text-2xl font-bold text-blue-600">
              {score}/{totalQuestions}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-sm text-gray-600">
            <div>Percentage: {percentage}%</div>
            <div>Time: {formatTime(totalTime)}</div>
          </div>
        </div>

        {/* Review toggle button */}
        <Button
          onClick={() => setShowReview(!showReview)}
          variant="outline"
          className="w-full mb-4 py-3 border-gray-300 text-gray-700 flex items-center justify-center gap-2"
        >
          {showReview ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Review
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Review Answers
            </>
          )}
        </Button>

        {/* Review answers */}
        {showReview && (
          <div className="space-y-6 mb-6">
            {questions.map((question, qIndex) => (
              <div key={qIndex} className="border rounded-lg p-4">
                <div className="flex items-start gap-2 mb-3">
                  <div className="mt-0.5">
                    {selectedAnswers[qIndex] === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <h3 className="text-lg font-medium">{question.question}</h3>
                </div>

                <div className="pl-7 space-y-2">
                  <div className="text-sm">
                    <span className="font-medium">Your answer: </span>
                    <span
                      className={selectedAnswers[qIndex] === question.correctAnswer ? "text-green-600" : "text-red-600"}
                    >
                      {selectedAnswers[qIndex] || "No answer"}
                    </span>
                  </div>

                  {selectedAnswers[qIndex] !== question.correctAnswer && (
                    <div className="text-sm">
                      <span className="font-medium">Correct answer: </span>
                      <span className="text-green-600">{question.correctAnswer}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Retry button */}
        <Button
          onClick={onRetry}
          className="w-full py-5 text-lg bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
        >
          <RefreshCw className="w-5 h-5" />
          Retry Quiz
        </Button>
      </div>
    </div>
  )
}
