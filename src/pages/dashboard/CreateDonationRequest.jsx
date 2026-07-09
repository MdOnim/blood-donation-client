import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import useLocations from '../../hooks/useLocations';
import { BLOOD_GROUPS } from '../../utils/constants';
import toast from 'react-hot-toast';

const CreateDonationRequest = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { divisions, districts, upazilas, fetchDistrictsByDivision, fetchUpazilas, setUpazilas, setDistricts } =
    useLocations();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    recipientName: '',
    recipientDivision: '',
    recipientDistrict: '',
    recipientUpazila: '',
    hospitalName: '',
    fullAddress: '',
    bloodGroup: '',
    donationDate: '',
    donationTime: '',
    requestMessage: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'recipientDivision') {
      setDistricts([]);
      setUpazilas([]);
      fetchDistrictsByDivision(value);
      setForm((prev) => ({
        ...prev,
        recipientDivision: value,
        recipientDistrict: '',
        recipientUpazila: '',
      }));
      return;
    }

    if (name === 'recipientDistrict') {
      fetchUpazilas(value);
      setForm((prev) => ({ ...prev, recipientDistrict: value, recipientUpazila: '' }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { recipientDivision, ...payload } = form;
      await api.post('/donations', payload);
      toast.success('Donation request created!');
      navigate('/dashboard/my-donation-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Create Donation Request
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requester Name</label>
          <input value={user?.name || ''} readOnly className="input-readonly" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Requester Email</label>
          <input value={user?.email || ''} readOnly className="input-readonly" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recipient Name</label>
          <input name="recipientName" value={form.recipientName} onChange={handleChange} className="input-field" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Recipient Division
            </label>
            <select
              name="recipientDivision"
              value={form.recipientDivision}
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
          <div>
            <label
              className={`block text-sm font-medium mb-1 transition-colors duration-300 ${
                form.recipientDivision ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              Recipient District
            </label>
            <select
              name="recipientDistrict"
              value={form.recipientDistrict}
              onChange={handleChange}
              className={`input-field transition-all duration-300 ${
                !form.recipientDivision ? 'input-field-cascade-locked' : ''
              }`}
              required
              disabled={!form.recipientDivision}
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
                form.recipientDistrict ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              Recipient Upazila
            </label>
            <select
              name="recipientUpazila"
              value={form.recipientUpazila}
              onChange={handleChange}
              className={`input-field transition-all duration-300 ${
                !form.recipientDistrict ? 'input-field-cascade-locked' : ''
              }`}
              required
              disabled={!form.recipientDistrict}
            >
              <option value="">Select Upazila</option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hospital Name</label>
          <input name="hospitalName" value={form.hospitalName} onChange={handleChange} className="input-field" placeholder="e.g. Dhaka Medical College Hospital" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
          <input name="fullAddress" value={form.fullAddress} onChange={handleChange} className="input-field" placeholder="e.g. Zahir Raihan Rd, Dhaka" required />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donation Date</label>
            <input name="donationDate" type="date" value={form.donationDate} onChange={handleChange} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Donation Time</label>
            <input name="donationTime" type="time" value={form.donationTime} onChange={handleChange} className="input-field" required />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Request Message</label>
          <textarea name="requestMessage" value={form.requestMessage} onChange={handleChange} rows={4} className="input-field resize-none" placeholder="Why do you need blood?" required />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Creating...' : 'Request'}
        </button>
      </form>
    </div>
  );
};

export default CreateDonationRequest;
