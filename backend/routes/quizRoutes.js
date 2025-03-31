import express from 'express';
import {
  initializeQuestions,
  getQuestions,
  getQuestion,
  submitQuiz,
  getQuizResult,
  getQuizResults
} from '../controllers/quizController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.post('/init', protect, admin, initializeQuestions);
router.get('/questions', getQuestions);
router.get('/questions/:id', getQuestion);
router.post('/submit', submitQuiz);
router.get('/result/:id', getQuizResult);
router.get('/results', protect, admin, getQuizResults);

export default router;
