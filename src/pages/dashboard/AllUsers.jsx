import { useEffect, useState } from 'react';
import api from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FaEllipsisV } from 'react-icons/fa';
import toast from 'react-hot-toast';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState(null);

  const fetchUsers = () => {
    setLoading(true);
    const params = statusFilter ? `?status=${statusFilter}` : '';
    api
      .get(`/users/all${params}`)
      .then((res) => setUsers(res.data.users))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

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
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-100">All Users</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input-field w-auto"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
      </div>

      <div className="card">
        {loading ? (
          <LoadingSpinner />
        ) : (
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
                {users.map((u) => (
                  <tr key={u._id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4">
                      <img src={u.avatar} alt={u.name} className="w-10 h-10 rounded-full object-cover" />
                    </td>
                    <td className="py-3 px-4 dark:text-gray-200">{u.email}</td>
                    <td className="py-3 px-4 font-medium dark:text-gray-100">{u.name}</td>
                    <td className="py-3 px-4 capitalize dark:text-gray-200">{u.role}</td>
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
                          {u.status === 'active' ? (
                            <button
                              onClick={() => handleAction('block', u._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Block User
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction('unblock', u._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                              Unblock User
                            </button>
                          )}
                          {u.role === 'donor' && (
                            <button
                              onClick={() => handleAction('make-volunteer', u._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Make Volunteer
                            </button>
                          )}
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleAction('make-admin', u._id)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Make Admin
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;
