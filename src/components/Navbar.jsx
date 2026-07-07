import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const navLinks = (
    <>
      <NavLink
        to="/donation-requests"
        className={({ isActive }) =>
          `font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`
        }
        onClick={() => setMobileOpen(false)}
      >
        Donation Requests
      </NavLink>
      {user && (
        <NavLink
          to="/funding"
          className={({ isActive }) =>
            `font-medium transition-colors ${isActive ? 'text-primary' : 'text-gray-700 dark:text-gray-300 hover:text-primary'}`
          }
          onClick={() => setMobileOpen(false)}
        >
          Funding
        </NavLink>
      )}
    </>
  );

  return (
    <nav className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md sticky top-0 z-40 border-b border-gray-100 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-lg">♥</span>
            </div>
            <span className="font-heading text-xl font-bold text-primary">LifeLink</span>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {navLinks}
            {!user ? (
              <Link to="/login" className="btn-primary text-sm py-2 px-5">
                Login
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover border-2 border-primary/20"
                  />
                  <FaChevronDown className={`text-xs text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2"
                    >
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                        onClick={() => setDropdownOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
            className="text-gray-700 dark:text-gray-200"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              {navLinks}
              {!user ? (
                <Link to="/login" className="btn-primary text-center text-sm" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="text-gray-700 dark:text-gray-200 font-medium" onClick={() => setMobileOpen(false)}>
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-red-600 font-medium text-left">
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
