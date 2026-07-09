import { useEffect, useState } from 'react';
import api from '../../api/axios';
import DonationTable from '../../components/DonationTable';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DONATION_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const MyDonationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    if (statusFilter) params.append('status', statusFilter);
    api
      .get(`/donations/my?${params}`)
      .then((res) => {
        setRequests(res.data.requests);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRequests();
  }, [page, statusFilter]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/donations/${id}/status`, { donationStatus: status });
      toast.success(`Status updated to ${status}`);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/donations/${deleteTarget._id}`);
      toast.success('Request deleted');
      setDeleteTarget(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-100">My Donation Requests</h1>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="input-field w-auto"
        >
          <option value="">All Statuses</option>
          {DONATION_STATUSES.map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <DonationTable
              requests={requests}
              ownerStatusActions
              onStatusChange={handleStatusChange}
              onDelete={setDeleteTarget}
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Request"
        message="Are you sure you want to delete this donation request?"
      />
    </div>
  );
};

export default MyDonationRequests;
