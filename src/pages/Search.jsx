import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import useLocations from '../hooks/useLocations';
import { BLOOD_GROUPS, getStatusClass } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Search = () => {
  const {
    divisions,
    districts,
    upazilas,
    loadingDistricts,
    fetchDistrictsByDivision,
    fetchUpazilas,
    setUpazilas,
    setDistricts,
  } = useLocations();

  const [form, setForm] = useState({
    bloodGroup: '',
    division: '',
    district: '',
    upazila: '',
  });
  const [requests, setRequests] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpazilas, setLoadingUpazilas] = useState(false);

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
      setUpazilas([]);
      setLoadingUpazilas(true);
      fetchUpazilas(value).finally(() => setLoadingUpazilas(false));
      setForm((prev) => ({ ...prev, district: value, upazila: '' }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (!form.bloodGroup && !form.division && !form.district && !form.upazila) {
      toast.error('Select at least one search filter');
      return;
    }

    setLoading(true);
    try {
      const res = await api.get('/search/donors', {
        params: {
          bloodGroup: form.bloodGroup || undefined,
          division: form.division || undefined,
          district: form.district || undefined,
          upazila: form.upazila || undefined,
        },
      });
      setRequests(res.data);
      setSearched(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Search failed. Please try again.');
      setRequests([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setDistricts([]);
    setUpazilas([]);
    setForm({ bloodGroup: '', division: '', district: '', upazila: '' });
    setRequests([]);
    setSearched(false);
  };

  const activeFilters = [
    form.bloodGroup && `Blood Group: ${form.bloodGroup}`,
    form.division && `Division: ${divisions.find((d) => d.id === form.division)?.name || form.division}`,
    form.district && `District: ${form.district}`,
    form.upazila && `Upazila: ${form.upazila}`,
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Search Donors
        </h1>
        <p className="text-muted dark:text-gray-400">
          Find blood donation requests by blood group, division, district and upazila
        </p>
      </div>

      <form onSubmit={handleSearch} className="card max-w-4xl mx-auto mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Blood Group
            </label>
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Blood Group</option>
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Division
            </label>
            <select
              name="division"
              value={form.division}
              onChange={handleChange}
              className="input-field"
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
              disabled={!form.division || loadingDistricts}
            >
              <option value="">
                {loadingDistricts ? 'Loading districts...' : 'Select District'}
              </option>
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
              Upazila <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <select
              name="upazila"
              value={form.upazila}
              onChange={handleChange}
              className={`input-field transition-all duration-300 ${
                !form.district ? 'input-field-cascade-locked' : ''
              }`}
              disabled={!form.district || loadingUpazilas}
            >
              <option value="">
                {loadingUpazilas ? 'Loading upazilas...' : 'All upazilas'}
              </option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            type="button"
            onClick={clearFilters}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 dark:text-gray-200"
          >
            Clear
          </button>
          <button type="submit" className="flex-1 btn-primary py-2.5" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {loading && <LoadingSpinner />}

      {searched && !loading && (
        <div>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted mb-3">No donation requests found matching your criteria.</p>
              {activeFilters.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Searched for: {activeFilters.join(' · ')}
                </p>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted mb-4 text-center">
                Found {requests.length} donation request{requests.length !== 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {requests.map((req, i) => (
                  <motion.div
                    key={req._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="card hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-gray-100">
                          {req.recipientName}
                        </h3>
                        <p className="text-muted text-sm">
                          {req.recipientDistrict}, {req.recipientUpazila}
                        </p>
                      </div>
                      <span className="bg-primary/10 text-primary font-bold px-3 py-1 rounded-full text-sm">
                        {req.bloodGroup}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-muted mb-4 flex-1">
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Hospital:</span>{' '}
                        {req.hospitalName}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Date:</span>{' '}
                        {req.donationDate}
                      </p>
                      <p>
                        <span className="font-medium text-gray-700 dark:text-gray-300">Time:</span>{' '}
                        {req.donationTime}
                      </p>
                      <p>
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusClass(req.donationStatus)}`}>
                          {req.donationStatus}
                        </span>
                      </p>
                    </div>

                    <Link
                      to={`/donation-request/${req._id}`}
                      className="btn-primary text-center text-sm py-2"
                    >
                      View Details
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
