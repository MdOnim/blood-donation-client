import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaHome, FaUser, FaTint, FaPlus, FaUsers, FaHandHoldingHeart,
  FaBars, FaTimes, FaSignOutAlt, FaList,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const donorLinks = [
    { to: '/dashboard', icon: FaHome, label: 'Home', end: true },
    { to: '/dashboard/my-donation-requests', icon: FaList, label: 'My Requests' },
    { to: '/dashboard/create-donation-request', icon: FaPlus, label: 'Create Request' },
    { to: '/dashboard/profile', icon: FaUser, label: 'Profile' },
  ];

  const adminLinks = [
    { to: '/dashboard', icon: FaHome, label: 'Home', end: true },
    { to: '/dashboard/all-users', icon: FaUsers, label: 'All Users' },
    { to: '/dashboard/all-blood-donation-request', icon: FaTint, label: 'All Requests' },
    { to: '/dashboard/profile', icon: FaUser, label: 'Profile' },
  ];

  const volunteerLinks = [
    { to: '/dashboard', icon: FaHome, label: 'Home', end: true },
    { to: '/dashboard/all-blood-donation-request', icon: FaTint, label: 'All Requests' },
    { to: '/dashboard/profile', icon: FaUser, label: 'Profile' },
  ];

  const links =
    user?.role === 'admin'
      ? adminLinks
      : user?.role === 'volunteer'
        ? volunteerLinks
        : donorLinks;

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
          />
          <div>
            <p className="font-semibold text-white text-sm">{user?.name}</p>
            <p className="text-white/60 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/15 text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <link.icon size={18} />
            {link.label}
          </NavLink>
        ))}
        <NavLink
          to="/funding"
          onClick={() => setSidebarOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-white/15 text-white'
                : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`
          }
        >
          <FaHandHoldingHeart size={18} />
          Funding
        </NavLink>
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-red-500/20 hover:text-red-300 transition-all w-full"
        >
          <FaSignOutAlt size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream dark:bg-[#0f1419] flex transition-colors duration-300">
      <aside className="hidden lg:flex lg:flex-col w-64 bg-secondary fixed inset-y-0 left-0 z-30">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm">♥</span>
            </div>
            <span className="font-heading text-lg font-bold text-white">LifeLink</span>
          </div>
        </div>
        <SidebarContent />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed inset-y-0 left-0 w-64 bg-secondary z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between p-4">
                <span className="font-heading text-lg font-bold text-white">LifeLink</span>
                <button onClick={() => setSidebarOpen(false)} className="text-white">
                  <FaTimes size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between lg:hidden sticky top-0 z-20 transition-colors">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-200">
              <FaBars size={22} />
            </button>
            <span className="font-heading font-bold text-primary">LifeLink Dashboard</span>
          </div>
          <ThemeToggle />
        </header>

        <div className="hidden lg:flex justify-end p-4 pb-0">
          <ThemeToggle />
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
