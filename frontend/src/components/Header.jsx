import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Renklerle İnsanları Tanıma</Link>
        
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/" className="hover:text-gray-300">Ana Sayfa</Link>
            </li>
            <li>
              <Link to="/quiz" className="hover:text-gray-300">Testi Başlat</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/admin" className="hover:text-gray-300">Admin</Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="hover:text-gray-300"
                  >
                    Çıkış Yap
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login" className="hover:text-gray-300">Giriş Yap</Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
