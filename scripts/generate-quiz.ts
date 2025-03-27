import { initializeQuestions } from "../app/data/quiz-questions";

async function main() {
  console.log("Generating quiz questions...");
  await initializeQuestions();
  console.log("Quiz generation complete");
}

main().catch(console.error);
