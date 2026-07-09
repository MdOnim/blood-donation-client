import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatStatus, getStatusClass } from '../utils/constants';
import {
  FaCheck,
  FaEdit,
  FaEllipsisV,
  FaEye,
  FaPlay,
  FaTimes,
  FaTrash,
} from 'react-icons/fa';

const MENU_WIDTH = 220;
const MENU_ESTIMATED_HEIGHT = 220;
const VIEWPORT_PADDING = 12;

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
  const [openMenu, setOpenMenu] = useState(null);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  const updateMenuPosition = (requestId) => {
    const button = buttonRefs.current[requestId];
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight || MENU_ESTIMATED_HEIGHT;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward =
      spaceBelow < menuHeight + VIEWPORT_PADDING && spaceAbove > spaceBelow;

    let left = rect.right - MENU_WIDTH;
    left = Math.max(
      VIEWPORT_PADDING,
      Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_PADDING)
    );

    const top = openUpward
      ? Math.max(VIEWPORT_PADDING, rect.top - menuHeight - 8)
      : Math.min(rect.bottom + 8, window.innerHeight - menuHeight - VIEWPORT_PADDING);

    setMenuStyle({ top, left });
  };

  useLayoutEffect(() => {
    if (!openMenu) return;
    updateMenuPosition(openMenu);
    const raf = requestAnimationFrame(() => updateMenuPosition(openMenu));

    const handleReposition = () => updateMenuPosition(openMenu);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [openMenu, requests]);

  useEffect(() => {
    if (!openMenu) return;

    const handleClickOutside = (event) => {
      const button = buttonRefs.current[openMenu];
      const clickedButton = button?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);
      if (!clickedButton && !clickedMenu) setOpenMenu(null);
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpenMenu(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenu]);

  if (!requests?.length) {
    return (
      <div className="text-center py-12 text-muted">
        <p>No donation requests found.</p>
      </div>
    );
  }

  const openRequest = requests.find((req) => req._id === openMenu);
  const isLocked =
    openRequest?.donationStatus === 'done' ||
    openRequest?.donationStatus === 'canceled';
  const menuItemClass =
    'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left';

  return (
    <>
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
              <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr
                key={req._id}
                className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
              >
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
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    ref={(el) => {
                      buttonRefs.current[req._id] = el;
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu((prev) => (prev === req._id ? null : req._id));
                    }}
                    className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                    aria-label="Request actions"
                  >
                    <FaEllipsisV size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {openRequest && (
        <div
          ref={menuRef}
          style={{ top: menuStyle.top, left: menuStyle.left, width: MENU_WIDTH }}
          className="fixed z-[100] rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
        >
          <Link
            to={`/donation-request/${openRequest._id}`}
            onClick={() => setOpenMenu(null)}
            className={`${menuItemClass} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20`}
          >
            <FaEye className="shrink-0" />
            View
          </Link>

          {canEdit && !isLocked && (
            <Link
              to={`${editPathPrefix}/${openRequest._id}`}
              onClick={() => setOpenMenu(null)}
              className={`${menuItemClass} text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20`}
            >
              <FaEdit className="shrink-0" />
              Edit
            </Link>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                onDelete?.(openRequest);
              }}
              className={`${menuItemClass} text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
            >
              <FaTrash className="shrink-0" />
              Delete
            </button>
          )}

          {canChangeStatus && !isLocked && (
            <>
              {openRequest.donationStatus === 'pending' && (
                <button
                  type="button"
                  onClick={() => {
                    setOpenMenu(null);
                    onStatusChange?.(openRequest._id, 'inprogress');
                  }}
                  className={`${menuItemClass} text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20`}
                >
                  <FaPlay className="shrink-0" />
                  Set In Progress
                </button>
              )}

              {(openRequest.donationStatus === 'pending' ||
                openRequest.donationStatus === 'inprogress') && (
                <>
                  {openRequest.donationStatus === 'inprogress' && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenMenu(null);
                        onStatusChange?.(openRequest._id, 'done');
                      }}
                      className={`${menuItemClass} text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20`}
                    >
                      <FaCheck className="shrink-0" />
                      Mark Done
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setOpenMenu(null);
                      onStatusChange?.(openRequest._id, 'canceled');
                    }}
                    className={`${menuItemClass} text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
                  >
                    <FaTimes className="shrink-0" />
                    Cancel Request
                  </button>
                </>
              )}
            </>
          )}

          {isLocked && (
            <p className="px-4 py-2.5 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-700">
              Done / Canceled requests are locked
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default DonationTable;
