import { Link } from 'react-router-dom';
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaHeart,
  FaCommentDots,
  FaEdit,
  FaTrash,
} from 'react-icons/fa';
import { formatStatus } from '../utils/constants';

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  inprogress: 'bg-blue-50 text-blue-700 border-blue-200',
  done: 'bg-green-50 text-green-700 border-green-200',
  canceled: 'bg-red-50 text-red-700 border-red-200',
};

const RequestDetailCard = ({
  request,
  showDonate = false,
  onDonate,
  actionLabel = 'View Details',
  actionTo,
  onAction,
  showOwnerActions = false,
  editTo,
  onDelete,
}) => {
  if (!request) return null;

  const statusKey = request.donationStatus || 'pending';
  const statusBadgeClass = statusStyles[statusKey] || statusStyles.pending;

  return (
    <div className="relative">
      <div className="flex justify-end mb-4">
        <span
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide border ${statusBadgeClass}`}
        >
          <FaClock className="text-sm" />
          {formatStatus(request.donationStatus).toUpperCase()}
        </span>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="p-6 sm:p-8 lg:p-10 border-b border-gray-100 dark:border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 flex items-center justify-center shrink-0">
                <FaUser className="text-primary text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {request.recipientName}
                </h3>
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase mt-1">
                  Recipient • Patient
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/30 px-5 py-4">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0 shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-lg">{request.bloodGroup}</span>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.12em] text-gray-500 uppercase">
                  Required
                </p>
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Blood Group
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-5">
              Location Details
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                  <FaBuilding className="text-emerald-600 text-lg" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {request.hospitalName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {request.recipientUpazila}, {request.recipientDistrict}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-rose-50 dark:bg-rose-900/20 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt className="text-primary text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.12em] text-gray-400 uppercase mb-1">
                    Full Address
                  </p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {request.fullAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.15em] text-gray-400 uppercase mb-5">
              Timing &amp; Urgency
            </p>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center shrink-0">
                  <FaCalendarAlt className="text-pink-500 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.12em] text-gray-400 uppercase mb-1">
                    Required Date
                  </p>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {request.donationDate}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <FaClock className="text-slate-500 text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.12em] text-gray-400 uppercase mb-1">
                    Time
                  </p>
                  <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                    {request.donationTime}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/30 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <FaCommentDots className="text-amber-600" />
                  <p className="text-xs font-bold tracking-[0.12em] text-amber-700 dark:text-amber-300 uppercase">
                    Request Message
                  </p>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">
                  &ldquo;{request.requestMessage}&rdquo;
                </p>
              </div>
            </div>
          </div>
        </div>

        {(showDonate && request.donationStatus === 'pending') ||
        showOwnerActions ||
        actionTo ||
        onAction ? (
          <div className="px-6 sm:px-8 lg:px-10 pb-6 sm:pb-8 lg:pb-10 flex flex-wrap justify-end gap-3">
            {showOwnerActions && (
              <>
                <Link
                  to={editTo}
                  className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-6 py-3 rounded-2xl transition-all"
                >
                  <FaEdit />
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={onDelete}
                  className="inline-flex items-center gap-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-semibold px-6 py-3 rounded-2xl transition-all"
                >
                  <FaTrash />
                  Delete
                </button>
              </>
            )}

            {showDonate && request.donationStatus === 'pending' ? (
              <button
                type="button"
                onClick={onDonate}
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <FaHeart />
                Donate Now
              </button>
            ) : null}

            {actionTo && !showOwnerActions ? (
              <Link
                to={actionTo}
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <FaHeart />
                {actionLabel}
              </Link>
            ) : null}

            {onAction && !showOwnerActions ? (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center gap-3 bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40"
              >
                <FaHeart />
                {actionLabel}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default RequestDetailCard;
