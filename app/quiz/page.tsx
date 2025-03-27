"use client"

import { useState, useEffect } from "react"
import StartPage from "@/app/components/start-page"
import QuestionPage from "@/app/components/question-page"
import ScorePage from "@/app/components/score-page"
import { quizQuestions } from "@/app/data/quiz-questions"

export default function QuizApp() {
  const [quizState, setQuizState] = useState<"start" | "quiz" | "score">("start")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>(Array(quizQuestions.length).fill(null))
  const [score, setScore] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(30)
  const [totalTime, setTotalTime] = useState(0)
  const [timerActive, setTimerActive] = useState(false)

  // Reset timer when moving to a new question
  useEffect(() => {
    if (quizState === "quiz") {
      setTimeRemaining(30)
      setTimerActive(true)
    } else {
      setTimerActive(false)
    }
  }, [currentQuestion, quizState])

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => prev - 1)
        setTotalTime((prev) => prev + 1)
      }, 1000)
    } else if (timeRemaining === 0 && quizState === "quiz") {
      handleNextQuestion()
    }

    return () => clearInterval(interval)
  }, [timerActive, timeRemaining])

  const startQuiz = () => {
    setQuizState("quiz")
    setCurrentQuestion(0)
    setSelectedAnswers(Array(quizQuestions.length).fill(null))
    setScore(0)
    setTotalTime(0)
    setTimeRemaining(30)
  }

  const handleAnswerSelect = (answer: string) => {
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = answer
    setSelectedAnswers(newSelectedAnswers)

    // Check if answer is correct
    if (answer === quizQuestions[currentQuestion].correctAnswer) {
      setScore((prev) => prev + 1)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setQuizState("score")
      setTimerActive(false)
    }
  }

  const retryQuiz = () => {
    startQuiz()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {quizState === "start" && <StartPage onStart={startQuiz} />}

        {quizState === "quiz" && (
          <QuestionPage
            question={quizQuestions[currentQuestion]}
            currentQuestionIndex={currentQuestion}
            totalQuestions={quizQuestions.length}
            selectedAnswer={selectedAnswers[currentQuestion]}
            onAnswerSelect={handleAnswerSelect}
            onNext={handleNextQuestion}
            timeRemaining={timeRemaining}
          />
        )}

        {quizState === "score" && (
          <ScorePage
            score={score}
            totalQuestions={quizQuestions.length}
            totalTime={totalTime}
            selectedAnswers={selectedAnswers}
            questions={quizQuestions}
            onRetry={retryQuiz}
          />
        )}
      </div>
    </main>
  )
}

