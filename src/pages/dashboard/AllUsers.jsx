import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import {
  FaBan,
  FaCheckCircle,
  FaEllipsisV,
  FaUserCheck,
  FaUserMinus,
  FaUserShield,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getRoleClass } from '../../utils/constants';

const MENU_WIDTH = 208;
const MENU_ESTIMATED_HEIGHT = 120;
const VIEWPORT_PADDING = 12;

const AllUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);
  const [menuStyle, setMenuStyle] = useState({ top: 0, left: 0 });
  const menuRef = useRef(null);
  const buttonRefs = useRef({});

  const fetchUsers = () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: 10 });
    if (statusFilter) params.append('status', statusFilter);
    api
      .get(`/users/all?${params}`)
      .then((res) => {
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, page]);

  const updateMenuPosition = (userId) => {
    const button = buttonRefs.current[userId];
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
    // Recalculate after menu paints so real height is used
    const raf = requestAnimationFrame(() => updateMenuPosition(openMenu));

    const handleReposition = () => updateMenuPosition(openMenu);
    window.addEventListener('resize', handleReposition);
    window.addEventListener('scroll', handleReposition, true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', handleReposition);
      window.removeEventListener('scroll', handleReposition, true);
    };
  }, [openMenu, users]);

  useEffect(() => {
    if (!openMenu) return;

    const handleClickOutside = (event) => {
      const button = buttonRefs.current[openMenu];
      const clickedButton = button?.contains(event.target);
      const clickedMenu = menuRef.current?.contains(event.target);
      if (!clickedButton && !clickedMenu) {
        setOpenMenu(null);
      }
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

  const handleAction = async (action, userId) => {
    try {
      await api.patch(`/users/${action}/${userId}`);
      if (action === 'block') {
        toast.error('User account restricted.');
      } else if (action === 'unblock') {
        toast.success('User account unrestricted. They can login again.');
      } else {
        toast.success('User updated successfully');
      }
      setOpenMenu(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

  const openUser = users.find((u) => u._id === openMenu);
  const isSelfOpen = openUser?._id === currentUser?._id;
  const menuItemClass =
    'w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left';

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          All <span className="text-primary">Users</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Manage donors and volunteer roles.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Donors can be blocked or made volunteer. Volunteers can be made admin or removed.
        </p>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="input-field w-auto"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Avatar</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Role</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-4">
                        <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                      </td>
                      <td className="py-3 px-4 dark:text-gray-200">{u.email}</td>
                      <td className="py-3 px-4 font-medium dark:text-gray-100">{u.name}</td>
                      <td className="py-3 px-4">
                        <span className={getRoleClass(u.role)}>{u.role}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={u.status === 'active' ? 'status-done' : 'status-canceled'}>
                          {u.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          ref={(el) => {
                            buttonRefs.current[u._id] = el;
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenu((prev) => (prev === u._id ? null : u._id));
                          }}
                          className="p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                          aria-label="User actions"
                        >
                          <FaEllipsisV size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {openUser && (
        <div
          ref={menuRef}
          style={{ top: menuStyle.top, left: menuStyle.left, width: MENU_WIDTH }}
          className="fixed z-[100] rounded-2xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xl overflow-hidden"
        >
          {/* Donor: Block / Unblock + Make Volunteer */}
          {openUser.role === 'donor' && (
            <>
              {openUser.status === 'active' ? (
                <button
                  type="button"
                  onClick={() => handleAction('block', openUser._id)}
                  className={`${menuItemClass} text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20`}
                >
                  <FaBan className="shrink-0" />
                  Block User
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleAction('unblock', openUser._id)}
                  className={`${menuItemClass} text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20`}
                >
                  <FaCheckCircle className="shrink-0" />
                  Unblock User
                </button>
              )}
              <button
                type="button"
                onClick={() => handleAction('make-volunteer', openUser._id)}
                className={`${menuItemClass} text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700`}
              >
                <FaUserCheck className="shrink-0 text-blue-500" />
                Make Volunteer
              </button>
            </>
          )}

          {/* Volunteer: Make Admin + Remove Volunteer (no block) */}
          {openUser.role === 'volunteer' && (
            <>
              <button
                type="button"
                onClick={() => handleAction('make-admin', openUser._id)}
                className={`${menuItemClass} text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20`}
              >
                <FaUserShield className="shrink-0" />
                Make Admin
              </button>
              <button
                type="button"
                onClick={() => handleAction('remove-volunteer', openUser._id)}
                className={`${menuItemClass} text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20`}
              >
                <FaUserMinus className="shrink-0" />
                Remove Volunteer
              </button>
            </>
          )}

          {/* Other admin: demote to volunteer (cannot demote yourself) */}
          {openUser.role === 'admin' && !isSelfOpen && (
            <button
              type="button"
              onClick={() => handleAction('remove-admin', openUser._id)}
              className={`${menuItemClass} text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20`}
            >
              <FaUserMinus className="shrink-0" />
              Remove Admin
            </button>
          )}

          {isSelfOpen && openUser.role === 'admin' && (
            <p className="px-4 py-3 text-xs text-gray-400">
              You cannot remove yourself from admin
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AllUsers;
