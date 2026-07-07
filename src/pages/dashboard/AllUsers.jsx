import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/LoadingSpinner';
import Pagination from '../../components/Pagination';
import { FaEllipsisV } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { getRoleClass } from '../../utils/constants';

const AllUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

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

  const handleAction = async (action, userId) => {
    try {
      await api.patch(`/users/${action}/${userId}`);
      toast.success('User updated successfully');
      setOpenMenu(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    }
  };

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
          Block users, assign volunteers, or remove volunteer role.
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
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const isSelf = u._id === currentUser?._id;

                    return (
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
                      <td className="py-3 px-4 relative">
                        <button
                          onClick={() => setOpenMenu(openMenu === u._id ? null : u._id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg dark:text-gray-200"
                        >
                          <FaEllipsisV size={14} />
                        </button>
                        {openMenu === u._id && (
                          <div className="absolute right-4 mt-1 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-2 z-10">
                            {!isSelf && (
                              u.status === 'active' ? (
                                <button
                                  onClick={() => handleAction('block', u._id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  Block User
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction('unblock', u._id)}
                                  className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                                >
                                  Unblock User
                                </button>
                              )
                            )}
                            {u.role === 'donor' && (
                              <button
                                onClick={() => handleAction('make-volunteer', u._id)}
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                Make Volunteer
                              </button>
                            )}
                            {u.role === 'volunteer' && !isSelf && (
                              <button
                                onClick={() => handleAction('remove-volunteer', u._id)}
                                className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                              >
                                Remove Volunteer
                              </button>
                            )}
                            {isSelf && u.role === 'admin' && (
                              <p className="px-4 py-2 text-xs text-gray-400">No actions for your account</p>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
