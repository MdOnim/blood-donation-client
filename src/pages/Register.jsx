import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useLocations from '../hooks/useLocations';
import { BLOOD_GROUPS, uploadImageToImgBB } from '../utils/constants';
import PasswordInput from '../components/PasswordInput';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Register = () => {
  const navigate = useNavigate();
  const { divisions, districts, upazilas, fetchDistrictsByDivision, fetchUpazilas, setUpazilas, setDistricts } =
    useLocations();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    avatar: '',
    bloodGroup: '',
    division: '',
    district: '',
    upazila: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'division') {
      setDistricts([]);
      setUpazilas([]);
      fetchDistrictsByDivision(value);
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
    setAvatarPreview('');
    setForm((prev) => ({ ...prev, avatar: '' }));

    try {
      const url = await uploadImageToImgBB(file);
      setAvatarPreview(url);
      setForm((prev) => ({ ...prev, avatar: url }));
      toast.success('Image uploaded');
    } catch (err) {
      setAvatarPreview('');
      setForm((prev) => ({ ...prev, avatar: '' }));
      toast.error(err.message || 'Failed to upload image');
    } finally {
      setImageUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error('Passwords do not match');
      return;
    }
    if (!form.avatar) {
      toast.error(
        imageUploading
          ? 'Please wait until the image finishes uploading'
          : 'Please upload an image'
      );
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
      if (err.response?.status === 413) {
        toast.error('Image is too large. Please choose a smaller image.');
      } else if (err.response?.status === 400) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } else if (!err.response) {
        toast.error('Cannot reach server. Make sure the backend is running.');
      } else {
        toast.error(err.response?.data?.message || 'Registration failed');
      }
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
          <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-100">
            Join LifeLink
          </h1>
          <p className="text-muted mt-2">Register as a blood donor and save lives</p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2 flex flex-col items-center mb-2">
            <label className="cursor-pointer group">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center overflow-hidden group-hover:border-primary transition-colors">
                {imageUploading ? (
                  <span className="text-primary text-xs text-center px-2">Uploading...</span>
                ) : avatarPreview ? (
                  <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-primary text-sm text-center px-2">Upload Image</span>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Division</label>
            <select name="division" value={form.division} onChange={handleChange} className="input-field" required>
              <option value="">Select Division</option>
              {divisions.map((div) => (
                <option key={div.id} value={div.id}>{div.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                form.division ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              District
            </label>
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
          </div>
          <div>
            <label
              className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                form.district ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              Upazila
            </label>
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
            <PasswordInput
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <PasswordInput
              name="confirm_password"
              value={form.confirm_password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="md:col-span-2">
            <button type="submit" disabled={loading || imageUploading} className="btn-primary w-full">
              {loading ? 'Registering...' : imageUploading ? 'Uploading image...' : 'Register'}
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
