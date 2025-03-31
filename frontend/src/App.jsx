import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/result/:id" element={<ResultPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            } />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
