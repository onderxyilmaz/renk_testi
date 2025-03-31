import Question from '../models/Question.js';
import QuizResult from '../models/QuizResult.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @desc    Initialize questions from text file (run once)
// @route   POST /api/quiz/init
// @access  Private/Admin
export const initializeQuestions = async (req, res) => {
  try {
    // Check if questions already exist
    const count = await Question.countDocuments();
    
    if (count > 0) {
      return res.status(400).json({
        success: false,
        error: 'Questions already initialized',
      });
    }

    // Read the questions file
    const questionsFilePath = path.join(__dirname, '..', 'questions-and-answers.txt');
    console.log('Reading file from:', questionsFilePath);
    
    // Function to parse the question file
    const parseQuestionsFile = (fileContent) => {
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
        else if (line.match(/^[a-d]\.\s/) || line.match(/^[a-d]\)\s/)) {
          const key = line.charAt(0);
          const text = line.substring(line.indexOf('.') + 1 || line.indexOf(')') + 1).trim();
          
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
    };

    try {
      // Read and parse the file
      const fileContent = fs.readFileSync(questionsFilePath, 'utf8');
      console.log('File content first 100 chars:', fileContent.substring(0, 100));
      
      const questions = parseQuestionsFile(fileContent);
      console.log(`Parsed ${questions.length} questions`);
      
      if (questions.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No questions parsed from file',
        });
      }
      
      // Insert questions into the database
      await Question.insertMany(questions);
      
      res.status(201).json({
        success: true,
        count: questions.length,
        data: questions,
      });
    } catch (fileError) {
      console.error('File processing error:', fileError);
      return res.status(500).json({
        success: false,
        error: 'Error processing questions file: ' + fileError.message,
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};

// @desc    Get all questions
// @route   GET /api/quiz/questions
// @access  Public
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().sort('questionNumber');

    res.status(200).json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};

// @desc    Get single question
// @route   GET /api/quiz/questions/:id
// @access  Public
export const getQuestion = async (req, res) => {
  try {
    const question = await Question.findOne({ questionNumber: req.params.id });

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
      });
    }

    res.status(200).json({
      success: true,
      data: question,
    });
  } catch (error) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};

// @desc    Submit quiz answers
// @route   POST /api/quiz/submit
// @access  Public
export const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    console.log('Received answers:', JSON.stringify(answers));

    if (!answers || !Array.isArray(answers) || answers.length !== 15) {
      return res.status(400).json({
        success: false,
        error: 'Please provide answers for all 15 questions',
      });
    }

    // Calculate points for each color
    let redPoints = 0;
    let yellowPoints = 0;
    let greenPoints = 0;
    let bluePoints = 0;

    for (const answer of answers) {
      if (!answer.selectedOptions || !Array.isArray(answer.selectedOptions) || 
          answer.selectedOptions.length < 1 || answer.selectedOptions.length > 2) {
        return res.status(400).json({
          success: false,
          error: 'Each question must have 1 or 2 selected options',
        });
      }

      // Calculate points based on options
      for (const option of answer.selectedOptions) {
        // Assign points to the appropriate color
        switch (option.key) {
          case 'a':
            redPoints += option.points;
            break;
          case 'b':
            yellowPoints += option.points;
            break;
          case 'c':
            greenPoints += option.points;
            break;
          case 'd':
            bluePoints += option.points;
            break;
          default:
            return res.status(400).json({
              success: false,
              error: 'Invalid option key',
            });
        }
      }
    }

    // Create the quiz result
    const quizResult = await QuizResult.create({
      answers,
      redPoints,
      yellowPoints,
      greenPoints,
      bluePoints,
    });

    res.status(201).json({
      success: true,
      data: {
        resultId: quizResult._id,
        redPoints,
        yellowPoints,
        greenPoints,
        bluePoints,
      },
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};

// @desc    Get a quiz result
// @route   GET /api/quiz/result/:id
// @access  Public
export const getQuizResult = async (req, res) => {
  try {
    const quizResult = await QuizResult.findById(req.params.id);

    if (!quizResult) {
      return res.status(404).json({
        success: false,
        error: 'Quiz result not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        resultId: quizResult._id,
        redPoints: quizResult.redPoints,
        yellowPoints: quizResult.yellowPoints,
        greenPoints: quizResult.greenPoints,
        bluePoints: quizResult.bluePoints,
        createdAt: quizResult.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};

// @desc    Get all quiz results
// @route   GET /api/quiz/results
// @access  Private/Admin
export const getQuizResults = async (req, res) => {
  try {
    const quizResults = await QuizResult.find().sort('-createdAt');

    res.status(200).json({
      success: true,
      count: quizResults.length,
      data: quizResults.map(result => ({
        resultId: result._id,
        redPoints: result.redPoints,
        yellowPoints: result.yellowPoints,
        greenPoints: result.greenPoints,
        bluePoints: result.bluePoints,
        createdAt: result.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + error.message,
    });
  }
};
