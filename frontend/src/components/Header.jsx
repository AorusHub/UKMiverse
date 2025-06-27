import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Login from './Login';
import Register from './Register';
import RoleBasedComponent from './RoleBasedComponent';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  const switchToRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const switchToLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  return (
    <header className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo Section */}
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <img src="/logo-unhas.svg" alt="Logo Unhas" className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">UKMiverse</h1>
              <p className="text-purple-100 text-xs md:text-sm font-medium">Universitas Hasanuddin</p>
            </div>
          </div>
          
          {/* Hamburger Menu Button */}
          <button 
            className="md:hidden flex flex-col gap-1 p-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300"
            onClick={toggleMenu}
          >
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-transform duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
            }`}></span>
          </button>
          
          {/* Navigation Menu */}
          <nav className={`absolute md:relative top-full md:top-auto left-0 md:left-auto w-full md:w-auto bg-purple-500 md:bg-transparent shadow-xl md:shadow-none transform md:transform-none transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 md:opacity-100 md:translate-y-0'
          } ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-2 p-4 md:p-0">
              <Link 
                to="/" 
                className="group relative text-white hover:text-purple-100 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-purple-600 md:hover:bg-purple-400"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                <span>Home</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/daftar-ukm" 
                className="group relative text-white hover:text-purple-100 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-purple-600 md:hover:bg-purple-400"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                <span>Daftar UKM</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/about" 
                className="group relative text-white hover:text-purple-100 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-purple-600 md:hover:bg-purple-400"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="flex items-center gap-2">
                <span>About</span>
                </span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
              </Link>

              {/* Admin Panel Link - Only for admins */}
              <RoleBasedComponent allowedRoles={[1, 'admin']}>
                <Link 
                  to="/admin" 
                  className="group relative text-white hover:text-purple-100 py-3 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-purple-600 md:hover:bg-purple-400"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="flex items-center gap-2">
                    ⚙️ <span>Admin</span>
                  </span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></div>
                </Link>
              </RoleBasedComponent>

              {/* Auth Section */}
              <div className="flex flex-col md:flex-row gap-2 md:gap-2 md:ml-4 border-t md:border-t-0 md:border-l border-purple-400 pt-4 md:pt-0 md:pl-4">
                {isAuthenticated ? (
                  <>
                    {/* User Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 text-white hover:text-purple-100 py-2 px-3 rounded-lg font-medium transition-all duration-300 hover:bg-purple-600 md:hover:bg-purple-400"
                      >
                        {/* Profile Picture */}
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-purple-100 flex items-center justify-center">
                          {user?.avatar_url ? (
                            <img
                              key={user.avatar_url} // Force re-render when avatar URL changes
                              src={user.avatar_url}
                              alt="Profile"
                              className="w-8 h-8 object-cover"
                              onError={(e) => {
                                console.error('Header avatar failed to load:', user.avatar_url);
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <User className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                        <span className="hidden md:inline">{user?.full_name || user?.username}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      
                      {showUserMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                          <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              setShowUserMenu(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            <User className="w-4 h-4" />
                            Profil
                          </Link>
                          <RoleBasedComponent allowedRoles={[1, 'admin']}>
                            <Link
                              to="/admin"
                              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100"
                              onClick={() => {
                                setShowUserMenu(false);
                                setIsMenuOpen(false);
                              }}
                            >
                              <Settings className="w-4 h-4" />
                              Panel Admin
                            </Link>
                          </RoleBasedComponent>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                          >
                            <LogOut className="w-4 h-4" />
                            Keluar
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowLogin(true)}
                      className="text-white hover:text-purple-100 py-2 px-4 rounded-lg font-medium transition-all duration-300 hover:bg-purple-600 md:hover:bg-purple-400 border border-purple-300"
                    >
                      Masuk
                    </button>
                    <button
                      onClick={() => setShowRegister(true)}
                      className="bg-white text-purple-600 hover:bg-purple-50 py-2 px-4 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Daftar
                    </button>
                  </>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <Login 
          onClose={() => setShowLogin(false)} 
          switchToRegister={switchToRegister}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)} 
          switchToLogin={switchToLogin}
        />
      )}
    </header>
  );
};

export default Header;
