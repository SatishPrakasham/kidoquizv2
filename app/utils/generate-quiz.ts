import type { Question } from "../types/quiz";

const SYSTEM_PROMPT = `You are a math quiz generator. Create a quiz question with:
1. A clear, concise question
2. Four multiple-choice options (A, B, C, D)
3. One correct answer
4. The question should be basic level, suitable for adults
5. Focus on algebra and geometry concepts`;

const EXAMPLE_FORMAT = `{
  "question": "What is the area of a rectangle with length 8 units and width 5 units?",
  "options": ["35 square units", "40 square units", "45 square units", "50 square units"],
  "correctAnswer": "40 square units"
}`;

export async function generateQuizQuestions(): Promise<Question[]> {
  const apiKey = process.env.AI_API_KEY;
  if (!apiKey) {
    throw new Error("AI API key not found in environment variables");
  }

  const questions: Question[] = [];
  const topics = ["algebra", "geometry"];

  for (let i = 0; i < 10; i++) {
    const topic = topics[i % topics.length];
    const prompt = `Generate a basic ${topic} math question for adults. Return ONLY a JSON object in this exact format:\n${EXAMPLE_FORMAT}`;

    try {
      const response = await fetch("https://api.genai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: prompt },
          ],
          temperature: 0.7,
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const questionData = JSON.parse(data.choices[0].message.content);
      questions.push(questionData);
    } catch (error) {
      console.error("Failed to generate question:", error);
      // Fallback question in case of API failure
      questions.push({
        question: `Basic ${topic} question ${i + 1}`,
        options: ["Option A", "Option B", "Option C", "Option D"],
        correctAnswer: "Option A",
      });
    }
  }

  return questions;
}
