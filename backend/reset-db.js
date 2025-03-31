import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected');
    resetDatabase();
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Reset the entire database
const resetDatabase = async () => {
  try {
    // Import models
    const UserSchema = new mongoose.Schema({
      email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
      },
      password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 5,
      },
      isAdmin: {
        type: Boolean,
        default: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    });
    const User = mongoose.model('User', UserSchema);

    const QuestionSchema = new mongoose.Schema({
      questionNumber: {
        type: Number,
        required: true,
        unique: true,
      },
      text: {
        type: String,
        required: true,
      },
      options: [
        {
          key: {
            type: String,
            required: true,
            enum: ['a', 'b', 'c', 'd'],
          },
          text: {
            type: String,
            required: true,
          },
        },
      ],
    });
    const Question = mongoose.model('Question', QuestionSchema);

    // Drop all collections
    console.log('Dropping all collections...');
    
    // 1. Drop 'users' collection
    await User.collection.drop().catch(err => {
      // Ignore "ns not found" error, which means the collection doesn't exist
      if (err.code !== 26) {
        console.error('Error dropping users collection:', err);
      } else {
        console.log('Users collection does not exist, nothing to drop');
      }
    });
    
    // 2. Drop 'questions' collection
    await Question.collection.drop().catch(err => {
      if (err.code !== 26) {
        console.error('Error dropping questions collection:', err);
      } else {
        console.log('Questions collection does not exist, nothing to drop');
      }
    });
    
    // 3. Drop 'quizresults' collection (if exists)
    try {
      await mongoose.connection.db.dropCollection('quizresults');
      console.log('QuizResults collection dropped');
    } catch (err) {
      if (err.code !== 26) {
        console.error('Error dropping quizresults collection:', err);
      } else {
        console.log('QuizResults collection does not exist, nothing to drop');
      }
    }
    
    // Create default admin with pre-hashed password
    console.log('Creating default admin...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);
    
    await User.create({
      email: 'admin@admin.com',
      password: hashedPassword,
    });
    console.log('Default admin created');
    
    // Read and parse questions
    console.log('Importing questions...');
    const questionsFilePath = path.join(__dirname, 'questions-formatted.txt');
    const fileContent = fs.readFileSync(questionsFilePath, 'utf8');
    
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
    
    // Insert questions into the database
    if (questions.length > 0) {
      await Question.insertMany(questions);
      console.log(`${questions.length} questions imported`);
    } else {
      console.log('No questions found in the file');
    }
    
    console.log('Database reset completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('Database reset error:', err);
    process.exit(1);
  }
};
