import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaUsers, FaTint, FaHandHoldingHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

const AdminHome = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/stats/dashboard')
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { icon: FaUsers, title: 'Total Donors', count: stats?.totalDonors || 0, color: 'bg-blue-500' },
    { icon: FaHandHoldingHeart, title: 'Total Funding', count: `$${stats?.totalFunding || 0}`, color: 'bg-green-500' },
    { icon: FaTint, title: 'Total Blood Requests', count: stats?.totalRequests || 0, color: 'bg-primary' },
  ];

  const chartData = [
    { name: 'Donors', value: stats?.totalDonors || 0 },
    { name: 'Requests', value: stats?.totalRequests || 0 },
    { name: 'Funding ($)', value: stats?.totalFunding || 0 },
  ];

  return (
    <div>
      <div className="card mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-800">
          Welcome, <span className="text-primary">{user?.name}</span>!
        </h1>
        <p className="text-muted mt-2">Here&apos;s an overview of the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card flex items-center gap-4"
          >
            <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center`}>
              <card.icon className="text-white text-xl" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{card.count}</p>
              <p className="text-muted text-sm">{card.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-heading text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">Platform Overview</h2>
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
    </div>
  );
};

export default AdminHome;
