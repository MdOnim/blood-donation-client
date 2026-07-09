import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import DonationTable from '../../components/DonationTable';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { FaSyringe } from 'react-icons/fa';
import toast from 'react-hot-toast';

const DonorHome = () => {
  const { user } = useAuth();
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRecent = () => {
    api
      .get('/donations/recent')
      .then((res) => setRecentRequests(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecent();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/donations/${id}/status`, { donationStatus: status });
      toast.success(`Status updated to ${status}`);
      fetchRecent();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/donations/${deleteTarget._id}`);
      toast.success('Request deleted');
      setDeleteTarget(null);
      fetchRecent();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
          Hello, <span className="text-primary">{user?.name?.split(' ')[0] || 'Donor'}!</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage your activities and help save lives today.
        </p>
      </div>

      {recentRequests.length > 0 ? (
        <section className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Recent Requests
            </h3>
            <Link
              to="/dashboard/create-donation-request"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
            >
              Create Request
            </Link>
          </div>

          <DonationTable
            requests={recentRequests}
            showDonorInfo={false}
            ownerStatusActions
            onStatusChange={handleStatusChange}
            onDelete={setDeleteTarget}
          />

          <div className="mt-8 flex justify-center">
            <Link
              to="/dashboard/my-donation-requests"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white font-bold tracking-wider uppercase px-8 py-3.5 rounded-2xl shadow-lg transition-all"
            >
              View My All Requests
            </Link>
          </div>
        </section>
      ) : (
        <section>
          <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-12 sm:p-16 text-center">
            <FaSyringe className="mx-auto text-5xl text-gray-300 dark:text-gray-600 mb-6" />
            <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">No requests yet</h3>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link
              to="/dashboard/create-donation-request"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white font-bold tracking-wider uppercase px-8 py-3.5 rounded-2xl shadow-lg transition-all"
            >
              Create Request
            </Link>
            <Link
              to="/dashboard/my-donation-requests"
              className="inline-flex items-center justify-center bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white font-bold tracking-wider uppercase px-8 py-3.5 rounded-2xl shadow-lg transition-all"
            >
              View Requests
            </Link>
          </div>
        </section>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Request"
        message="Are you sure you want to delete this donation request? This action cannot be undone."
      />
    </div>
  );
};

export default DonorHome;
