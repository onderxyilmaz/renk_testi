import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from './models/User.js';
import Question from './models/Question.js';

// Load env vars
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    initializeDb();
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Initialize database with default data
const initializeDb = async () => {
  try {
    // Check if default admin exists
    const adminCount = await User.countDocuments({ email: 'admin@admin.com' });
    
    if (adminCount === 0) {
      console.log('Creating default admin user...');
      await User.create({
        email: 'admin@admin.com',
        password: 'admin',
      });
      console.log('Default admin user created');
    } else {
      console.log('Default admin user already exists');
    }
    
    // Check if questions exist
    const questionCount = await Question.countDocuments();
    
    if (questionCount === 0) {
      console.log('Importing questions from file...');
      
      // Read the questions file
      const questionsFilePath = path.join(__dirname, 'questions-formatted.txt');
      const fileContent = fs.readFileSync(questionsFilePath, 'utf8');
      
      // Parse the questions
      const questions = parseQuestionsFile(fileContent);
      
      if (questions.length > 0) {
        await Question.insertMany(questions);
        console.log(`${questions.length} questions imported successfully`);
      } else {
        console.log('No questions found in the file');
      }
    } else {
      console.log('Questions already exist in the database');
    }
    
    console.log('Database initialization completed');
    process.exit(0);
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exit(1);
  }
};

// Function to parse questions from the file
const parseQuestionsFile = (fileContent) => {
  const questions = [];
  const lines = fileContent.split('\n');
  
  let currentQuestion = null;
  
  for (let line of lines) {
    line = line.trim();
    
    // Skip empty lines
    if (!line) continue;
    
    // New question (starts with a number followed by a closing parenthesis)
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
    // Option (starts with a letter followed by a period or closing parenthesis)
    else if (line.match(/^[a-d]\.\s/) || line.match(/^[a-d]\)\s/)) {
      const key = line.charAt(0);
      let text = '';
      
      if (line.includes('.')) {
        text = line.substring(line.indexOf('.') + 1).trim();
      } else if (line.includes(')')) {
        text = line.substring(line.indexOf(')') + 1).trim();
      }
      
      if (currentQuestion && text) {
        currentQuestion.options.push({ key, text });
      }
    }
  }
  
  // Add the last question
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  return questions;
};
