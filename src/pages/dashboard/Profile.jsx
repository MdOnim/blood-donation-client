import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import useLocations from '../../hooks/useLocations';
import { BLOOD_GROUPS, uploadImageToImgBB } from '../../utils/constants';
import toast from 'react-hot-toast';
import { FaEdit, FaSave } from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { districts, upazilas, fetchUpazilas } = useLocations();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bloodGroup: user?.bloodGroup || '',
    district: user?.district || '',
    upazila: user?.upazila || '',
  });

  const startEdit = () => {
    setForm({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bloodGroup: user.bloodGroup,
      district: user.district,
      upazila: user.upazila,
    });
    fetchUpazilas(user.district);
    setEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'district') {
      fetchUpazilas(value);
      setForm((prev) => ({ ...prev, district: value, upazila: '' }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, avatar: url }));
      toast.success('Avatar updated');
    } catch {
      toast.error('Failed to upload avatar');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await api.put('/users/profile', {
        name: form.name,
        avatar: form.avatar,
        bloodGroup: form.bloodGroup,
        district: form.district,
        upazila: form.upazila,
      });
      updateUser(res.data);
      setEditing(false);
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-100">My Profile</h1>
        {!editing ? (
          <button onClick={startEdit} className="flex items-center gap-2 btn-outline text-sm py-2 px-4">
            <FaEdit size={14} /> Edit
          </button>
        ) : (
          <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 btn-primary text-sm py-2 px-4">
            <FaSave size={14} /> {loading ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>

      <div className="card">
        <div className="flex flex-col items-center mb-8">
          <img
            src={editing ? form.avatar : user.avatar}
            alt={user.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-primary/10 mb-3"
          />
          {editing && (
            <label className="text-primary text-sm cursor-pointer hover:underline">
              Change Avatar
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              name="name"
              value={editing ? form.name : user.name}
              onChange={handleChange}
              readOnly={!editing}
              className={`input-field ${!editing ? 'bg-gray-50' : ''}`}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input value={user.email} readOnly className="input-readonly" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
            {editing ? (
              <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field">
                {BLOOD_GROUPS.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            ) : (
              <input value={user.bloodGroup} readOnly className="input-readonly" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
            {editing ? (
              <select name="district" value={form.district} onChange={handleChange} className="input-field">
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            ) : (
              <input value={user.district} readOnly className="input-readonly" />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upazila</label>
            {editing ? (
              <select name="upazila" value={form.upazila} onChange={handleChange} className="input-field">
                {upazilas.map((u) => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            ) : (
              <input value={user.upazila} readOnly className="input-readonly" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
