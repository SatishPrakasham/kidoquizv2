import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateQuizQuestions() {
  console.log("Generating quiz questions...");
  
  const pythonScript = path.join(__dirname, '../../scripts/generate_questions.py');
  const python = spawn('python', [pythonScript]);

  python.stdout.on('data', (data: Buffer) => {
    console.log(data.toString());
  });

  python.stderr.on('data', (data: Buffer) => {
    console.error(data.toString());
  });

  python.on('close', (code: number) => {
    if (code !== 0) {
      console.error(`Python script exited with code ${code}`);
      process.exit(code);
    }
    console.log("Quiz generation complete");
  });
}

generateQuizQuestions().catch(console.error);

export { generateQuizQuestions };
