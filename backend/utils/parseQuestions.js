import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const parseQuestionsFile = () => {
  try {
    // File path to questions-and-answers.txt
    const filePath = path.join(__dirname, '..', '..', 'questions-and-answers.txt');
    
    // Read file
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse content
    const questions = [];
    const lines = fileContent.split('\n');
    
    let currentQuestion = null;
    
    for (let line of lines) {
      line = line.trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // New question
      if (line.match(/^\d+\)/)) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        
        const questionNumber = parseInt(line.match(/^\d+/)[0]);
        const text = line.substring(line.indexOf(')') + 1).trim();
        
        currentQuestion = {
          questionNumber,
          text,
          options: [],
        };
      }
      // Option
      else if (line.match(/^[a-d]\.\s/)) {
        const key = line.charAt(0);
        const text = line.substring(line.indexOf('.') + 1).trim();
        
        if (currentQuestion) {
          currentQuestion.options.push({ key, text });
        }
      }
    }
    
    // Add the last question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    return questions;
  } catch (error) {
    console.error('Error parsing questions file:', error);
    return [];
  }
};
