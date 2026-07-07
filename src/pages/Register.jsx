import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useLocations from '../hooks/useLocations';
import { BLOOD_GROUPS, uploadImageToImgBB } from '../utils/constants';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { districts, upazilas, fetchUpazilas, setUpazilas } = useLocations();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    avatar: '',
    bloodGroup: '',
    district: '',
    upazila: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'district') {
      fetchUpazilas(value);
      setForm((prev) => ({ ...prev, district: value, upazila: '' }));
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setAvatarPreview(URL.createObjectURL(file));
      const url = await uploadImageToImgBB(file);
      setForm((prev) => ({ ...prev, avatar: url }));
      toast.success('Avatar uploaded');
    } catch {
      toast.error('Failed to upload avatar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (!form.avatar) {
      toast.error('Please upload an avatar');
      return;
    }
    setLoading(true);
    try {
      await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
        avatar: form.avatar,
        bloodGroup: form.bloodGroup,
        district: form.district,
        upazila: form.upazila,
      });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full max-w-2xl"
      >
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-100 dark:text-gray-100">Join LifeLink</h1>
          <p className="text-muted mt-2">Register as a blood donor and save lives</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex flex-col items-center mb-2">
            <label className="cursor-pointer group">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-sm text-center px-2">Upload Avatar</span>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
            <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field" required>
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
            <select name="district" value={form.district} onChange={handleChange} className="input-field" required>
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upazila</label>
            <select name="upazila" value={form.upazila} onChange={handleChange} className="input-field" required disabled={!form.district}>
              <option value="">Select Upazila</option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange} className="input-field" required />
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
