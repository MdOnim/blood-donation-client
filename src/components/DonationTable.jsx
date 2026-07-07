import { Link } from 'react-router-dom';
import { formatStatus, getStatusClass } from '../utils/constants';
import { FaEye, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

const DonationTable = ({
  requests,
  showDonorInfo = true,
  canEdit = true,
  canDelete = true,
  canChangeStatus = true,
  onStatusChange,
  onDelete,
  editPathPrefix = '/dashboard/edit-donation-request',
}) => {
  if (!requests?.length) {
    return (
      <div className="text-center py-12 text-muted">
        <p>No donation requests found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Recipient</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Location</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Date</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Time</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Blood Group</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
            {showDonorInfo && (
              <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Donor Info</th>
            )}
            <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
              <td className="py-3 px-4 font-medium dark:text-gray-100">{req.recipientName}</td>
              <td className="py-3 px-4 text-muted">
                {req.recipientDistrict}, {req.recipientUpazila}
              </td>
              <td className="py-3 px-4">{req.donationDate}</td>
              <td className="py-3 px-4">{req.donationTime}</td>
              <td className="py-3 px-4">
                <span className="font-semibold text-primary">{req.bloodGroup}</span>
              </td>
              <td className="py-3 px-4">
                <span className={getStatusClass(req.donationStatus)}>
                  {formatStatus(req.donationStatus)}
                </span>
              </td>
              {showDonorInfo && (
                <td className="py-3 px-4 text-muted text-xs">
                  {req.donationStatus === 'inprogress' && req.donorName ? (
                    <div>
                      <p>{req.donorName}</p>
                      <p>{req.donorEmail}</p>
                    </div>
                  ) : (
                    '—'
                  )}
                </td>
              )}
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Link
                    to={`/donation-request/${req._id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View"
                  >
                    <FaEye size={14} />
                  </Link>
                  {canEdit && (
                    <Link
                      to={`${editPathPrefix}/${req._id}`}
                      className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <FaEdit size={14} />
                    </Link>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => onDelete?.(req)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <FaTrash size={14} />
                    </button>
                  )}
                  {canChangeStatus && req.donationStatus === 'inprogress' && (
                    <>
                      <button
                        onClick={() => onStatusChange?.(req._id, 'done')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Mark Done"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button
                        onClick={() => onStatusChange?.(req._id, 'canceled')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel"
                      >
                        <FaTimes size={14} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DonationTable;
