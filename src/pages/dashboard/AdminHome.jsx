import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import DonationTable from '../../components/DonationTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaUsers, FaTint, FaHandHoldingHeart, FaUserShield } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const AdminHome = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const requests = [
      api.get('/stats/dashboard'),
      isAdmin
        ? api.get('/donations/all?page=1&limit=5&status=pending')
        : Promise.resolve({ data: { requests: [] } }),
    ];

    Promise.all(requests)
      .then(([statsRes, donationsRes]) => {
        setStats(statsRes.data);
        setRecentRequests(donationsRes.data.requests || []);
      })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { icon: FaUsers, title: 'Total Donors', count: stats?.totalDonors || 0, color: 'bg-blue-500' },
    {
      icon: FaHandHoldingHeart,
      title: 'Total Funding',
      count: `$${stats?.totalFunding || 0}`,
      color: 'bg-green-500',
    },
    {
      icon: FaTint,
      title: 'Total Blood Requests',
      count: stats?.totalRequests || 0,
      color: 'bg-primary',
    },
  ];

  const chartData = [
    { name: 'Donors', value: stats?.totalDonors || 0 },
    { name: 'Requests', value: stats?.totalRequests || 0 },
    { name: 'Funding ($)', value: stats?.totalFunding || 0 },
  ];

  const quickLinks = isAdmin
    ? [
        { to: '/dashboard/all-users', icon: FaUsers, label: 'Manage Users', desc: 'Block, unblock, assign roles' },
        {
          to: '/dashboard/all-blood-donation-request',
          icon: FaTint,
          label: 'All Requests',
          desc: 'View and manage donation requests',
        },
      ]
    : [
        {
          to: '/dashboard/all-blood-donation-request',
          icon: FaTint,
          label: 'All Requests',
          desc: 'View and update donation requests',
        },
      ];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Hello, <span className="text-primary">{user?.name?.split(' ')[0] || 'Admin'}!</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {isAdmin
            ? 'Monitor platform activity and manage users and requests.'
            : 'Help manage blood donation requests across the platform.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex items-center gap-4"
          >
            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center`}>
              <card.icon className="text-white text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{card.count}</p>
              <p className="text-muted text-sm">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 hover:border-primary/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <link.icon className="text-primary text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100">{link.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{link.desc}</p>
              </div>
            </div>
          </Link>
        ))}

        {isAdmin && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center">
              <FaUserShield className="text-primary text-lg" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Admin Access</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                You have full control over users, roles, and donation requests.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <h2 className="font-heading text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Platform Overview
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#9B1B30" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isAdmin && (
        <section className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Recent Pending Requests
            </h3>
            <Link
              to="/dashboard/all-blood-donation-request"
              className="text-primary font-semibold text-sm hover:underline"
            >
              View all requests
            </Link>
          </div>

          {recentRequests.length > 0 ? (
            <DonationTable
              requests={recentRequests}
              canEdit
              canDelete
              canChangeStatus={false}
              editPathPrefix="/dashboard/edit-donation-request"
            />
          ) : (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No pending requests right now.
            </p>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminHome;
