import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import QuestionCard from '../components/QuestionCard';

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await api.get('/quiz/questions');
        console.log('Questions response:', response.data);
        
        if (response.data.success) {
          setQuestions(response.data.data);
          
          // Initialize answers array with empty selections
          const initialAnswers = response.data.data.map(question => ({
            questionNumber: question.questionNumber,
            selectedOptions: [],
          }));
          
          setAnswers(initialAnswers);
        } else {
          setError('Sorular yüklenirken bir hata oluştu');
        }
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Sorular yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuestions();
  }, []);
  
  const handleOptionSelect = (selectedOptions) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex].selectedOptions = selectedOptions;
    setAnswers(updatedAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmitQuiz = async () => {
    try {
      console.log('Submitting answers:', answers);
      setLoading(true);
      
      const response = await api.post('/quiz/submit', { answers });
      
      if (response.data.success) {
        navigate(`/result/${response.data.data.resultId}`);
      } else {
        setError('Test sonuçları gönderilirken bir hata oluştu');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError(err.message || 'Test sonuçları gönderilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl text-white">Sorular yükleniyor...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <div className="text-xl text-red-600 bg-white p-4 rounded-lg shadow-md">
          <p className="font-bold mb-2">Hata:</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Tekrar Dene
        </button>
      </div>
    );
  }
  
  if (questions.length === 0) {
    return (
      <div className="text-center py-10">
        <div className="text-xl text-white bg-gray-800 p-4 rounded-lg shadow-md">
          Sorular bulunamadı. Lütfen daha sonra tekrar deneyiniz.
        </div>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold text-white">Kişilik Testi</h1>
          <div className="text-lg text-white">
            Soru {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <QuestionCard
        question={currentQuestion}
        selectedOptions={currentAnswer?.selectedOptions || []}
        onOptionSelect={handleOptionSelect}
        onNextQuestion={handleNextQuestion}
        onPrevQuestion={handlePrevQuestion}
        showPrev={currentQuestionIndex > 0}
        showNext={currentQuestionIndex < questions.length - 1}
        showFinish={currentQuestionIndex === questions.length - 1}
      />
    </div>
  );
};

export default QuizPage;
