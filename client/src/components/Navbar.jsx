import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  UserCircle, 
  LogOut, 
  LayoutDashboard,
  Home,
  BarChart3
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const setLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex justify-between items-center h-14 md:h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#4361ee] flex items-center justify-center">
              <BarChart3 className="text-white" size={14} />
            </div>
            <span className="text-gray-900 text-lg md:text-xl font-bold tracking-tight">
              Survey<span className="text-[#4361ee]">App</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
            {user ? (
              <>
                
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-[#4361ee] transition-colors duration-200 flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-blue-50"
                >
                  <LayoutDashboard size={16} />
                  <span className="text-sm lg:text-base">Dashboard</span>
                </Link>
                
                <div className="flex items-center space-x-3 lg:space-x-4 ml-2 lg:ml-4 pl-2 lg:pl-4 border-l border-gray-300">
                  <div className="flex items-center space-x-2">
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <UserCircle className="text-[#4361ee]" size={16} />
                    </div>
                    <span className="text-gray-900 font-medium text-sm lg:text-base truncate max-w-[120px]">
                      {user.fullName || user.username}
                    </span>
                  </div>
                  
                  <button
                    onClick={setLogout}
                    className="flex items-center space-x-1 lg:space-x-2 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-200 text-sm"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2 lg:space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-[#4361ee] transition-colors duration-200 px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg hover:bg-blue-50 text-sm lg:text-base"
                >
                  Sign In
                </Link>
                
                <Link 
                  to="/register" 
                  className="bg-[#4361ee] text-white px-4 lg:px-6 py-1.5 lg:py-2 rounded-lg hover:bg-[#3a56d4] transition-all duration-200 shadow-md hover:shadow-lg text-sm lg:text-base"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-1.5 rounded-lg hover:bg-blue-50 transition-colors duration-200 text-gray-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X size={20} />
            ) : (
              <Menu size={20} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 mt-1 pb-3">
            {user ? (
              <div className="space-y-3 pt-3">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center border-2 border-[#4361ee]">
                    <UserCircle className="text-[#4361ee]" size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-900 font-semibold text-sm truncate">{user.fullName || user.username}</p>
                    <p className="text-gray-600 text-xs">Welcome back!</p>
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Link
                    to="/dashboard"
                    onClick={handleLinkClick}
                    className="flex items-center space-x-3 p-3 text-gray-900 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm"
                  >
                    <LayoutDashboard size={18} />
                    <span>Dashboard</span>
                  </Link>
                </div>
                
                <button
                  onClick={setLogout}
                  className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 mt-2 text-sm"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2 pt-3">
                <Link
                  to="/login"
                  onClick={handleLinkClick}
                  className="block p-3 text-center text-gray-900 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm"
                >
                  Sign In
                </Link>
                
                <Link
                  to="/register"
                  onClick={handleLinkClick}
                  className="block p-3 text-center bg-[#4361ee] text-white rounded-lg hover:bg-[#3a56d4] transition-colors duration-200 shadow-md text-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;