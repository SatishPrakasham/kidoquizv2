import type { Question } from "../types/quiz";

export const quizQuestions: Question[] = [
  {
    question: "Solve for x: 2x + 5 = 13",
    options: ["x = 3", "x = 4", "x = 5", "x = 6"],
    correctAnswer: "x = 4",
  },
  {
    question: "What is the area of a square with side length 6 units?",
    options: ["24 sq units", "30 sq units", "36 sq units", "42 sq units"],
    correctAnswer: "36 sq units",
  },
  {
    question: "Simplify: 3(x + 2) - 2(x - 1)",
    options: ["x + 8", "x + 4", "5x + 1", "x + 5"],
    correctAnswer: "x + 8",
  },
  {
    question: "What is the perimeter of a rectangle with length 8 units and width 5 units?",
    options: ["20 units", "26 units", "28 units", "30 units"],
    correctAnswer: "26 units",
  },
  {
    question: "If y = 2x + 3, what is y when x = 4?",
    options: ["8", "9", "10", "11"],
    correctAnswer: "11",
  }
];
