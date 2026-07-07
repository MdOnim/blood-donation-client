import { useState } from 'react';
import api from '../api/axios';
import useLocations from '../hooks/useLocations';
import { BLOOD_GROUPS } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';
import { motion } from 'framer-motion';

const Search = () => {
  const { divisions, districts, upazilas, fetchDistrictsByDivision, fetchUpazilas, setUpazilas } =
    useLocations();
  const [form, setForm] = useState({
    bloodGroup: '',
    division: '',
    district: '',
    upazila: '',
  });
  const [donors, setDonors] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'division') {
      fetchDistrictsByDivision(value);
      setForm({ ...form, division: value, district: '', upazila: '' });
      setUpazilas([]);
      return;
    }

    if (name === 'district') {
      fetchUpazilas(value);
      setForm({ ...form, district: value, upazila: '' });
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (form.bloodGroup) params.append('bloodGroup', form.bloodGroup);
      if (form.division) params.append('division', form.division);
      if (form.district) params.append('district', form.district);
      if (form.upazila) params.append('upazila', form.upazila);
      const res = await api.get(`/search/donors?${params}`);
      setDonors(res.data);
      setSearched(true);
    } catch {
      setDonors([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          Search Donors
        </h1>
        <p className="text-muted dark:text-gray-400">
          Find blood donors by blood group, division, district and upazila
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              District
            </label>
            <select
              name="district"
              value={form.district}
              onChange={handleChange}
              className="input-field"
              disabled={!form.division}
            >
              <option value="">Select District</option>
              {districts.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Upazila
            </label>
            <select
              name="upazila"
              value={form.upazila}
              onChange={handleChange}
              className="input-field"
              disabled={!form.district}
            >
              <option value="">Select Upazila</option>
              {upazilas.map((u) => (
                <option key={u.id} value={u.name}>{u.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full mt-6" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {loading && <LoadingSpinner />}

      {searched && !loading && (
        <div>
          {donors.length === 0 ? (
            <p className="text-center text-muted py-12">No donors found matching your criteria.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor, i) => (
                <motion.div
                  key={donor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card text-center hover:shadow-lg transition-shadow"
                >
                  <img
                    src={donor.avatar}
                    alt={donor.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-4 border-primary/10"
                  />
                  <h3 className="font-heading font-bold text-lg text-gray-800 dark:text-gray-100">
                    {donor.name}
                  </h3>
                  <p className="text-muted text-sm mb-2">{donor.email}</p>
                  <span className="inline-block bg-primary/10 text-primary font-bold px-4 py-1 rounded-full text-sm mb-2">
                    {donor.bloodGroup}
                  </span>
                  <p className="text-muted text-sm">{donor.district}, {donor.upazila}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Search;
