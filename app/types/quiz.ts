export interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
  category: "Technology" | "AI" | "Business";
  difficulty?: "Easy" | "Medium" | "Hard";
}
