import type { Question } from "../types/quiz"
import { generateQuizQuestions } from "../utils/generate-quiz"

// Default questions as fallback in case AI generation fails
const defaultQuestions: Question[] = [
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
    options: ["22 units", "24 units", "26 units", "28 units"],
    correctAnswer: "26 units",
  },
  {
    question: "If 3y = 15, what is the value of y?",
    options: ["3", "4", "5", "6"],
    correctAnswer: "5",
  },
  {
    question: "What is the measure of each interior angle in a regular pentagon?",
    options: ["72°", "108°", "120°", "135°"],
    correctAnswer: "108°",
  },
  {
    question: "Solve: -2x = 14",
    options: ["x = -7", "x = 7", "x = -8", "x = 8"],
    correctAnswer: "x = -7",
  },
  {
    question: "What is the sum of angles in a triangle?",
    options: ["90°", "180°", "270°", "360°"],
    correctAnswer: "180°",
  },
  {
    question: "Find the value of y: y/4 = 6",
    options: ["12", "18", "24", "30"],
    correctAnswer: "24",
  },
  {
    question: "What is the area of a triangle with base 8 units and height 6 units?",
    options: ["21 sq units", "24 sq units", "27 sq units", "30 sq units"],
    correctAnswer: "24 sq units",
  },
];

// This will be populated with AI-generated questions at build time
export let quizQuestions: Question[] = defaultQuestions;

// Function to initialize questions
export async function initializeQuestions() {
  try {
    const generatedQuestions = await generateQuizQuestions();
    if (generatedQuestions && generatedQuestions.length === 10) {
      quizQuestions = generatedQuestions;
      console.log("Successfully generated AI quiz questions");
    } else {
      console.log("Using default questions due to incomplete AI generation");
    }
  } catch (error) {
    console.error("Failed to generate AI questions, using default questions:", error);
  }
}
