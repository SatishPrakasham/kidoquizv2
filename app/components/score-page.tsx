"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import type { Question } from "../types/quiz"
import { CheckCircle, XCircle, RefreshCw, Eye, EyeOff } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface ScorePageProps {
  score: number
  totalQuestions: number
  totalTime: number
  selectedAnswers: (string | null)[]
  questions: Question[]

}

export default function ScorePage({
  score,
  totalQuestions,
  totalTime,
  selectedAnswers,
  questions,

}: ScorePageProps) {
  const [showReview, setShowReview] = useState(false)
  const [showCategoryChart, setShowCategoryChart] = useState(true)

  // Format total time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  // Calculate percentage score
  const percentage = Math.round((score / totalQuestions) * 100)
  
  // Calculate scores by category
  const categoryScores = questions.reduce((acc, question, index) => {
    const category = question.category;
    
    if (!acc[category]) {
      acc[category] = {
        category,
        correct: 0,
        total: 0,
        percentage: 0
      };
    }
    
    acc[category].total += 1;
    
    if (selectedAnswers[index] === question.correctAnswer) {
      acc[category].correct += 1;
    }
    
    return acc;
  }, {} as Record<string, { category: string; correct: number; total: number; percentage: number }>);
  
  // Convert to array and calculate percentages
  const categoryData = Object.values(categoryScores).map(item => {
    return {
      ...item,
      percentage: Math.round((item.correct / item.total) * 100)
    };
  });

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
        
        {/* Category Scores Chart */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-medium text-gray-700">Category Scores</div>
            <Button
              onClick={() => setShowCategoryChart(!showCategoryChart)}
              variant="outline"
              className="text-xs px-2 py-1 h-auto border-gray-300 text-gray-700"
            >
              {showCategoryChart ? "Hide Chart" : "Show Chart"}
            </Button>
          </div>
          
          {showCategoryChart && (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 10, left: 10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis label={{ value: 'Score (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value: number) => [`${value}%`, 'Score']} />
                  <Legend />
                  <Bar 
                    dataKey="percentage" 
                    name="Score" 
                    fill="#8884d8" 
                    radius={[4, 4, 0, 0]}
                    label={{ position: 'top', formatter: (value: number) => `${value}%` }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-3 gap-2">
            {categoryData.map((item) => (
              <div key={item.category} className="text-center p-3 border rounded-md bg-white shadow-sm">
                <div className="font-medium text-blue-600 mb-1 text-sm truncate">{item.category}</div>
                <div className="text-lg font-bold">{item.correct}/{item.total}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.percentage}% correct
                </div>
              </div>
            ))}
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


      </div>
    </div>
  )
}
