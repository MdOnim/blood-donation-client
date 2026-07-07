import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import RequestDetailCard from '../components/RequestDetailCard';
import RequestDetailsHeading from '../components/RequestDetailsHeading';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DonationRequestDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [donating, setDonating] = useState(false);

  useEffect(() => {
    api
      .get(`/donations/${id}`)
      .then((res) => setRequest(res.data))
      .catch(() => toast.error('Failed to load request'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDonate = async () => {
    setDonating(true);
    try {
      const res = await api.patch(`/donations/${id}/donate`);
      setRequest(res.data);
      toast.success('Thank you! Donation status updated to In Progress.');
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to confirm donation');
    } finally {
      setDonating(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!request) return <p className="text-center py-20 text-muted">Request not found.</p>;

  const isOwnRequest =
    request.requesterId?.toString() === user?._id?.toString() ||
    request.requesterEmail === user?.email;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <RequestDetailsHeading />

      <RequestDetailCard
        request={request}
        showDonate
        donateDisabled={isOwnRequest}
        onDonate={() => !isOwnRequest && setModalOpen(true)}
      />

      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full shadow-xl border border-transparent dark:border-gray-700">
                <h3 className="font-heading text-xl font-bold mb-4 dark:text-gray-100">Confirm Donation</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donor Name</label>
                    <input value={user?.name || ''} readOnly className="input-readonly" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donor Email</label>
                    <input value={user?.email || ''} readOnly className="input-readonly" />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setModalOpen(false)} className="flex-1 py-2 rounded-xl border border-gray-200 dark:border-gray-600 dark:text-gray-200">
                    Cancel
                  </button>
                  <button onClick={handleDonate} disabled={donating} className="flex-1 btn-primary py-2">
                    {donating ? 'Confirming...' : 'Confirm'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DonationRequestDetails;
