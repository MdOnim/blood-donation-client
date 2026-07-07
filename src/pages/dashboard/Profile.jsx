import { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import useLocations from '../../hooks/useLocations';
import { BLOOD_GROUPS, uploadImageToImgBB } from '../../utils/constants';
import toast from 'react-hot-toast';
import {
  FaEdit, FaSave, FaTimes, FaMapMarkerAlt, FaTint,
} from 'react-icons/fa';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const {
    divisions,
    districts,
    upazilas,
    fetchDistrictsByDivision,
    fetchUpazilas,
    setUpazilas,
  } = useLocations();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    avatar: user?.avatar || '',
    bloodGroup: user?.bloodGroup || '',
    division: '',
    district: user?.district || '',
    upazila: user?.upazila || '',
  });

  const startEdit = async () => {
    try {
      const districtsRes = await api.get('/locations/districts');
      const district = districtsRes.data.find((d) => d.name === user.district);
      const divisionId = district?.division_id || '';

      if (divisionId) {
        await fetchDistrictsByDivision(divisionId);
      }
      await fetchUpazilas(user.district);

      setForm({
        name: user.name,
        avatar: user.avatar,
        bloodGroup: user.bloodGroup,
        division: divisionId,
        district: user.district,
        upazila: user.upazila,
      });
      setEditing(true);
    } catch {
      toast.error('Failed to load location data');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setUpazilas([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'division') {
      fetchDistrictsByDivision(value);
      setUpazilas([]);
      setForm((prev) => ({ ...prev, division: value, district: '', upazila: '' }));
      return;
    }

    if (name === 'district') {
      fetchUpazilas(value);
      setForm((prev) => ({ ...prev, district: value, upazila: '' }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    try {
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, avatar: url }));
      toast.success('Image updated');
    } catch (err) {
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
      e.target.value = '';
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

  const display = editing ? form : user;
  const isActive = user?.status === 'active';

  const fieldClass = (editable = true) =>
    editing && editable
      ? 'input-field'
      : 'input-readonly';

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Profile <span className="text-primary">Settings</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Manage your personal information and donor credentials.
          </p>
        </div>

        {!editing ? (
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-2 border-2 border-primary text-primary hover:bg-primary hover:text-white font-semibold px-5 py-2.5 rounded-xl transition-all shrink-0"
          >
            <FaEdit size={14} />
            Edit Profile
          </button>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={cancelEdit}
              className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
            >
              <FaTimes size={14} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading || imageUploading}
              className="inline-flex items-center gap-2 btn-primary px-5 py-2.5"
            >
              <FaSave size={14} />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="bg-primary px-6 sm:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-5">
              <label className={`relative shrink-0 ${editing ? 'cursor-pointer group' : ''}`}>
                <img
                  src={display.avatar}
                  alt={display.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white/30"
                />
                {editing && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {imageUploading ? 'Uploading...' : 'Change'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                      disabled={imageUploading}
                    />
                  </>
                )}
              </label>
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">{display.name}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-300/30'
                        : 'bg-red-500/20 text-red-100 border border-red-300/30'
                    }`}
                  >
                    {isActive ? 'ACTIVE DONOR' : 'BLOCKED'}
                  </span>
                </div>
                <p className="flex items-center gap-2 text-white/80 text-sm">
                  <FaMapMarkerAlt />
                  {display.upazila}, {display.district}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl bg-white/10 border border-white/20 px-5 py-4 self-start">
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary font-bold text-xl">{display.bloodGroup}</span>
              </div>
              <div>
                <p className="text-[11px] font-bold tracking-[0.12em] text-white/70 uppercase">
                  Blood Group
                </p>
                <p className="text-sm font-semibold text-white">Required Type</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                Personal Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    value={display.name}
                    onChange={handleChange}
                    readOnly={!editing}
                    className={fieldClass()}
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-2">
                    Email
                  </label>
                  <input
                    value={user.email}
                    readOnly
                    className="input-readonly input-email-readonly"
                  />
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                Address Details
              </h3>
              <div className="space-y-4">
                {editing && (
                  <div>
                    <label className="block text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-2">
                      Division
                    </label>
                    <select
                      name="division"
                      value={form.division}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select Division</option>
                      {divisions.map((div) => (
                        <option key={div.id} value={div.id}>{div.name}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-2">
                    District
                  </label>
                  {editing ? (
                    <select
                      name="district"
                      value={form.district}
                      onChange={handleChange}
                      className={`input-field transition-all duration-300 ${
                        !form.division ? 'input-field-cascade-locked' : ''
                      }`}
                      required
                      disabled={!form.division}
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input value={user.district} readOnly className="input-readonly" />
                  )}
                </div>
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-2">
                    Upazila
                  </label>
                  {editing ? (
                    <select
                      name="upazila"
                      value={form.upazila}
                      onChange={handleChange}
                      className={`input-field transition-all duration-300 ${
                        !form.district ? 'input-field-cascade-locked' : ''
                      }`}
                      required
                      disabled={!form.district}
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((u) => (
                        <option key={u.id} value={u.name}>{u.name}</option>
                      ))}
                    </select>
                  ) : (
                    <input value={user.upazila} readOnly className="input-readonly" />
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="space-y-8">
            <section>
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-4">
                Medical Profile
              </h3>
              <div>
                <label className="block text-[11px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-2">
                  Blood Group
                </label>
                {editing ? (
                  <select
                    name="bloodGroup"
                    value={form.bloodGroup}
                    onChange={handleChange}
                    className="input-field"
                    required
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                ) : (
                  <div className="relative">
                    <input value={user.bloodGroup} readOnly className="input-readonly pr-12" />
                    <FaTint className="absolute right-4 top-1/2 -translate-y-1/2 text-primary" />
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                {isActive ? 'Eligible to Donate' : 'Not Eligible'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {isActive
                  ? 'Your account is in good standing. You are ready to save lives.'
                  : 'Your account has been blocked. Please contact support for assistance.'}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
