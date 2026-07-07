import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { getStatusClass } from '../utils/constants';
import { motion } from 'framer-motion';

const DonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/donations/pending')
      .then((res) => setRequests(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Blood Donation Requests
        </h1>
        <p className="text-muted">Pending requests that need your help</p>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-muted py-12">No pending donation requests at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((req, i) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-heading font-bold text-lg text-gray-800">{req.recipientName}</h3>
                  <p className="text-muted text-sm">{req.recipientDistrict}, {req.recipientUpazila}</p>
                </div>
                <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                  {req.bloodGroup}
                </span>
              </div>
              <div className="space-y-2 text-sm text-muted mb-6 flex-1">
                <p><span className="font-medium text-gray-700">Date:</span> {req.donationDate}</p>
                <p><span className="font-medium text-gray-700">Time:</span> {req.donationTime}</p>
              </div>
              <Link to={`/donation-request/${req._id}`} className="btn-primary text-center text-sm py-2">
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DonationRequests;
