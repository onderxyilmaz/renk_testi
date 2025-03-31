import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FormInput, FormButton } from '../components/form';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, user, error, setError } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Clear previous errors
    setError(null);
  }, [setError]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!email || !password || !confirmPassword) {
      setError('Lütfen tüm alanları doldurunuz');
      setLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }
    
    const success = await register(email, password);
    
    if (success) {
      navigate('/admin');
    }
    
    setLoading(false);
  };
  
  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Kullanıcısı Oluştur</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4 bg-yellow-100 text-yellow-800 p-3 rounded">
          <p className="font-medium">Önemli Bilgi</p>
          <p>Yeni bir admin kullanıcısı oluşturduğunuzda, varsayılan admin hesabı (admin@admin.com) devre dışı bırakılacaktır. Lütfen yeni bilgilerinizi güvenli bir yerde saklayın.</p>
        </div>
        
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormInput
            id="email"
            type="email"
            label="E-posta"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Yeni admin e-posta adresi"
            autoFocus
            required
            disabled={loading}
          />
          
          <FormInput
            id="password"
            type="password"
            label="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Yeni şifre"
            required
            disabled={loading}
          />
          
          <FormInput
            id="confirmPassword"
            type="password"
            label="Şifre Tekrar"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Şifrenizi tekrar girin"
            required
            disabled={loading}
            className="mb-6"
          />
          
          <FormButton
            type="submit"
            variant="success"
            fullWidth
            disabled={loading}
          >
            {loading ? 'İşleniyor...' : 'Admin Kullanıcısı Oluştur'}
          </FormButton>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
