import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminPage = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = 'Admin Panel - Renklerle İnsanları Tanıma';
  }, []);
  
  const handleLogout = () => {
    logout();
  };
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <div className="text-xl">Yükleniyor...</div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="text-center py-10">
        <div className="text-xl">Oturum bilgileriniz bulunamadı. Lütfen tekrar giriş yapın.</div>
        <button
          onClick={() => navigate('/login')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Giriş Yap
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Paneli</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-bold mb-4">Kullanıcı Bilgileri</h2>
        <p><strong>E-posta:</strong> {user.email}</p>
        <p><strong>Hesap Oluşturma Tarihi:</strong> {new Date(user.createdAt).toLocaleString('tr-TR')}</p>
      </div>
      
      <div className="flex justify-end">
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
