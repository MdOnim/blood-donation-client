import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import DonationTable from '../../components/DonationTable';
import Pagination from '../../components/Pagination';
import ConfirmModal from '../../components/ConfirmModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { DONATION_STATUSES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AllBloodDonationRequests = () => {
  const { user } = useAuth();
  const isVolunteer = user?.role === 'volunteer';
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
      .get(`/donations/all?${params}`)
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
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          All <span className="text-primary">Requests</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          {isVolunteer
            ? 'View donor requests and update their status.'
            : 'View, edit, and manage all blood donation requests.'}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-4">
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

      <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <DonationTable
              requests={requests}
              canEdit={!isVolunteer}
              canDelete={!isVolunteer}
              canChangeStatus={true}
              onStatusChange={handleStatusChange}
              onDelete={!isVolunteer ? setDeleteTarget : undefined}
              editPathPrefix="/dashboard/edit-donation-request"
            />
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {!isVolunteer && (
        <ConfirmModal
          isOpen={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Request"
          message="Are you sure you want to delete this donation request?"
        />
      )}
    </div>
  );
};

export default AllBloodDonationRequests;
