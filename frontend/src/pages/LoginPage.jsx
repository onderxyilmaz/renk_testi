import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import { FormInput, FormButton } from '../components/form';

// API URL'yi çevre değişkeninden al veya varsayılan olarak localhost kullan
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDefaultAdminExists, setIsDefaultAdminExists] = useState(false);
  const [otherAdminExists, setOtherAdminExists] = useState(false);
  const { login, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear previous errors
    setError(null);
    setLocalError(null);
    
    // If user is already logged in, redirect to admin page
    if (user) {
      console.log('User already logged in, redirecting to admin page');
      navigate('/admin');
    }
    
    // Check if default admin exists
    const checkDefaultAdmin = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/check-default-admin`).catch(() => {
          // If the endpoint doesn't exist, we'll assume default admin exists for now
          // In a real app, you'd want to create this endpoint
          setIsDefaultAdminExists(true);
        });
        
        if (response && response.data) {
          setIsDefaultAdminExists(response.data.exists);
          setOtherAdminExists(response.data.otherAdminExists);
        }
      } catch (error) {
        // If there's an error, we'll assume default admin exists
        console.error('Error checking default admin:', error);
        setIsDefaultAdminExists(true);
      }
    };
    
    checkDefaultAdmin();
  }, [user, navigate, setError]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!email || !password) {
      setLocalError('Lütfen e-posta ve şifre giriniz');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Attempting login...');
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      
      if (response.data.success && response.data.token) {
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // If login is with default admin credentials, redirect to register page
        if (response.data.isDefaultAdmin) {
          window.location.href = '/register';
        } else {
          // Otherwise, redirect to admin page
          window.location.href = '/admin';
        }
      }
    } catch (err) {
      console.error('Login error:', err);
      setLocalError(err.response?.data?.error || 'Login failed. Server error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Girişi</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        {(error || localError) && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error || localError}
          </div>
        )}
        
        <form onSubmit={handleLogin}>
          <FormInput
            id="email"
            type="email"
            label="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta adresiniz"
            disabled={loading}
            autoFocus
            required
          />
          
          <FormInput
            id="password"
            type="password"
            label="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifreniz"
            disabled={loading}
            required
            className="mb-6"
          />
          
          <FormButton
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </FormButton>
        </form>
        
        {isDefaultAdminExists && !otherAdminExists && (
          <div className="mt-4 text-center text-gray-600">
            <p>İlk girişiniz mi? Default kullanıcı adı: admin@admin.com ve şifre: admin</p>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-center">
        <Link to="/" className="text-blue-300 hover:text-blue-400">
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;