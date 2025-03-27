"use client"
import { Button } from "@/components/ui/button"
import type { Question } from "@/types/quiz"
import { ChevronRightIcon } from "lucide-react"

interface QuestionPageProps {
  question: Question
  currentQuestionIndex: number
  totalQuestions: number
  selectedAnswer: string | null
  onAnswerSelect: (answer: string) => void
  onNext: () => void
  timeRemaining: number
}

export default function QuestionPage({
  question,
  currentQuestionIndex,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  timeRemaining,
}: QuestionPageProps) {
  const progressPercentage = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Format time remaining
  const formatTime = (seconds: number) => {
    return `${seconds}s`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Gradient header with progress */}
      <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 relative">
        <div
          className="h-full bg-gradient-to-r from-blue-600 to-purple-700 absolute top-0 left-0 transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      <div className="p-6">
        {/* Question header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium text-gray-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
          <div
            className={`text-sm font-medium px-3 py-1 rounded-full ${
              timeRemaining > 10 ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
            }`}
          >
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Question text */}
        <h2 className="text-xl font-semibold mb-6">{question.question}</h2>

        {/* Answer options */}
        <div className="space-y-3 mb-6">
          {question.options.map((option, index) => (
            <div
              key={index}
              onClick={() => onAnswerSelect(option)}
              className={`flex items-center rounded-lg border p-4 cursor-pointer transition-colors duration-300 ${
                selectedAnswer === option ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                  selectedAnswer === option ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {String.fromCharCode(65 + index)}
              </div>
              <span className="text-lg">{option}</span>
            </div>
          ))}
        </div>

        {/* Next button */}
        <Button
          onClick={onNext}
          disabled={selectedAnswer === null}
          className={`w-full py-5 text-lg rounded-lg flex items-center justify-center gap-2 transition-all duration-300 ${
            selectedAnswer === null
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600 text-white"
          }`}
        >
          Next Question
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

