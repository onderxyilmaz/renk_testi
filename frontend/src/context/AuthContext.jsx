import { createContext, useState, useEffect } from 'react';
import api from '../utils/api';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          console.log('User data loaded successfully');
          setUser(res.data.data);
        } catch (err) {
          console.error('Error loading user:', err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
          setError('Authentication failed. Please login again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [token]);
  
  const login = async (email, password) => {
    try {
      setLoading(true);
      // Using direct axios call with full URL for login to avoid any proxy issues
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setError(null);
        
        // If login is with default admin credentials, redirect to register page
        if (email === 'admin@admin.com' && password === 'admin') {
          setLoading(false);
          window.location.href = '/register';
          return true;
        }
        
        setLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
      return false;
    }
  };
  
  const register = async (email, password) => {
    try {
      setLoading(true);
      // Using direct axios call with full URL for register to avoid any proxy issues
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        setToken(res.data.token);
        setError(null);
        setLoading(false);
        return true;
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed');
      setLoading(false);
      return false;
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    window.location.href = '/login';
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        logout,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
