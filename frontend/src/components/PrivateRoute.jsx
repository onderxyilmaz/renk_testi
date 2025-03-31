import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading, token } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  // Check if token exists but user is not loaded
  if (token && !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-xl">Oturum bilgileri yükleniyor...</div>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    console.log('No token or user, redirecting to login');
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
