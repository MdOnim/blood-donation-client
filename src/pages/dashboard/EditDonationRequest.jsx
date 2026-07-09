import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import useLocations from '../../hooks/useLocations';
import { BLOOD_GROUPS } from '../../utils/constants';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const EditDonationRequest = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { divisions, districts, upazilas, fetchDistrictsByDivision, fetchUpazilas, setUpazilas } =
    useLocations();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  useEffect(() => {
    const loadRequest = async () => {
      try {
        const [requestRes, districtsRes] = await Promise.all([
          api.get(`/donations/${id}`),
          api.get('/locations/districts'),
        ]);
        const r = requestRes.data;

        if (['done', 'canceled'].includes(r.donationStatus)) {
          toast.error('Done or canceled requests cannot be edited');
          navigate('/dashboard/my-donation-requests');
          return;
        }

        const district = districtsRes.data.find((d) => d.name === r.recipientDistrict);
        const divisionId = district?.division_id || '';

        if (divisionId) {
          await fetchDistrictsByDivision(divisionId);
        }
        await fetchUpazilas(r.recipientDistrict);

        setForm({
          recipientName: r.recipientName,
          recipientDivision: divisionId,
          recipientDistrict: r.recipientDistrict,
          recipientUpazila: r.recipientUpazila,
          hospitalName: r.hospitalName,
          fullAddress: r.fullAddress,
          bloodGroup: r.bloodGroup,
          donationDate: r.donationDate,
          donationTime: r.donationTime,
          requestMessage: r.requestMessage,
        });
      } finally {
        setLoading(false);
      }
    };

    loadRequest();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'recipientDivision') {
      fetchDistrictsByDivision(value);
      setUpazilas([]);
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
    setSaving(true);
    try {
      const { recipientDivision, ...payload } = form;
      await api.put(`/donations/${id}`, payload);
      toast.success('Request updated successfully');
      navigate('/dashboard/my-donation-requests');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        Edit Donation Request
      </h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
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
          <input name="hospitalName" value={form.hospitalName} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Address</label>
          <input name="fullAddress" value={form.fullAddress} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Blood Group</label>
          <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange} className="input-field" required>
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
          <textarea name="requestMessage" value={form.requestMessage} onChange={handleChange} rows={4} className="input-field resize-none" required />
        </div>
        <button type="submit" disabled={saving} className="btn-primary w-full">
          {saving ? 'Updating...' : 'Update Donation Request'}
        </button>
      </form>
    </div>
  );
};

export default EditDonationRequest;
