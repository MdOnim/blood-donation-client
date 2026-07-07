import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import DonationTable from '../../components/DonationTable';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
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
    <div>
      <div className="card mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/10">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-gray-800">
          Welcome, <span className="text-primary">{user?.name}</span>!
        </h1>
        <p className="text-muted mt-2">Manage your donation requests and help save lives.</p>
      </div>

      {recentRequests.length > 0 && (
        <div className="card">
          <h2 className="font-heading text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Recent Donation Requests
          </h2>
          <DonationTable
            requests={recentRequests}
            onStatusChange={handleStatusChange}
            onDelete={setDeleteTarget}
          />
          <div className="mt-6 text-center">
            <Link to="/dashboard/my-donation-requests" className="btn-outline text-sm">
              View My All Requests
            </Link>
          </div>
        </div>
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
