import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaTint, FaPlus, FaUsers, FaHandHoldingHeart,
  FaBars, FaTimes, FaSignOutAlt, FaList, FaThLarge, FaUser,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/profile': 'My Profile',
  '/dashboard/my-donation-requests': 'My Requests',
  '/dashboard/create-donation-request': 'Create Request',
  '/dashboard/all-users': 'All Users',
  '/dashboard/all-blood-donation-request': 'Public Requests',
  '/donation-requests': 'Public Requests',
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const donorSections = [
    {
      title: 'Main Menu',
      links: [
        { to: '/dashboard', icon: FaThLarge, label: 'Dashboard', end: true },
        { to: '/dashboard/profile', icon: FaUser, label: 'My Profile' },
      ],
    },
    {
      title: 'Donations',
      links: [
        { to: '/dashboard/my-donation-requests', icon: FaList, label: 'My Requests' },
        { to: '/dashboard/create-donation-request', icon: FaPlus, label: 'Create Request' },
        { to: '/funding', icon: FaHandHoldingHeart, label: 'Funding' },
      ],
    },
  ];

  const adminSections = [
    {
      title: 'Main Menu',
      links: [
        { to: '/dashboard', icon: FaThLarge, label: 'Dashboard', end: true },
        { to: '/dashboard/profile', icon: FaUser, label: 'My Profile' },
      ],
    },
    {
      title: 'Donations',
      links: [
        { to: '/dashboard/my-donation-requests', icon: FaList, label: 'My Requests' },
        { to: '/dashboard/create-donation-request', icon: FaPlus, label: 'Create Request' },
        { to: '/funding', icon: FaHandHoldingHeart, label: 'Funding' },
      ],
    },
    {
      title: 'Management',
      links: [
        { to: '/dashboard/all-users', icon: FaUsers, label: 'All Users' },
        { to: '/dashboard/all-blood-donation-request', icon: FaTint, label: 'Public Requests' },
      ],
    },
  ];

  const volunteerSections = [
    {
      title: 'Main Menu',
      links: [
        { to: '/dashboard', icon: FaThLarge, label: 'Dashboard', end: true },
        { to: '/dashboard/profile', icon: FaUser, label: 'My Profile' },
      ],
    },
    {
      title: 'Donations',
      links: [
        { to: '/dashboard/my-donation-requests', icon: FaList, label: 'My Requests' },
        { to: '/dashboard/create-donation-request', icon: FaPlus, label: 'Create Request' },
        { to: '/funding', icon: FaHandHoldingHeart, label: 'Funding' },
      ],
    },
    {
      title: 'Management',
      links: [
        { to: '/dashboard/all-blood-donation-request', icon: FaTint, label: 'Public Requests' },
      ],
    },
  ];

  const sections =
    user?.role === 'admin'
      ? adminSections
      : user?.role === 'volunteer'
        ? volunteerSections
        : donorSections;

  const pageTitle =
    pageTitles[location.pathname] ||
    (location.pathname.includes('edit-donation-request') ? 'Edit Request' : 'Dashboard');

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? 'bg-primary text-white shadow-sm'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
    }`;

  const Logo = ({ onClick }) => (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-2 hover:opacity-90 transition-opacity"
    >
      <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
        <FaTint className="text-white text-sm" />
      </div>
      <span className="font-heading text-xl font-bold text-gray-900 dark:text-white">LifeLink</span>
    </Link>
  );

  const SidebarContent = () => (
    <>
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {sections.map((section) => (
          <div key={section.title} className="mb-8">
            <p className="px-4 mb-3 text-[11px] font-semibold tracking-[0.15em] text-gray-400 uppercase">
              {section.title}
            </p>
            <nav className="space-y-1">
              {section.links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  onClick={() => setSidebarOpen(false)}
                  className={navLinkClass}
                >
                  <link.icon size={16} />
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all w-full"
        >
          <FaSignOutAlt size={16} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-[#0f1419] flex transition-colors duration-300">
      <aside className="hidden lg:flex lg:flex-col w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 fixed inset-y-0 left-0 z-30">
        <div className="px-6 py-6 border-b border-gray-100 dark:border-gray-800">
          <Logo />
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
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-50 flex flex-col lg:hidden"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
                <Logo onClick={() => setSidebarOpen(false)} />
                <button onClick={() => setSidebarOpen(false)} className="text-gray-600 dark:text-gray-300">
                  <FaTimes size={20} />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-72 min-w-0">
        <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 sm:px-8 py-5 sticky top-0 z-20">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-700 dark:text-gray-200 shrink-0"
              >
                <FaBars size={22} />
              </button>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 truncate">
                  {pageTitle}
                </h1>
                <p className="text-xs sm:text-sm font-semibold tracking-[0.12em] text-gray-400 uppercase mt-1">
                  Welcome back, {user?.role}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <ThemeToggle />
              <span className="hidden sm:inline-flex px-4 py-2 rounded-full bg-rose-50 dark:bg-rose-900/20 text-primary text-xs font-bold tracking-wider uppercase">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
