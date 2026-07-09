import { useState, useEffect } from 'react';
import api from '../api/axios';

const useLocations = () => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(false);

  useEffect(() => {
    api.get('/locations/divisions').then((res) => setDivisions(res.data));
  }, []);

  const fetchDistrictsByDivision = async (divisionId) => {
    if (!divisionId) {
      setDistricts([]);
      return;
    }

    setLoadingDistricts(true);
    try {
      const res = await api.get(`/locations/districts?division=${divisionId}`);
      setDistricts(res.data);
    } catch {
      setDistricts([]);
    } finally {
      setLoadingDistricts(false);
    }
  };

  const fetchUpazilas = async (district) => {
    if (!district) {
      setUpazilas([]);
      return;
    }

    try {
      const res = await api.get(`/locations/upazilas/${encodeURIComponent(district)}`);
      setUpazilas(res.data);
    } catch {
      setUpazilas([]);
    }
  };

  return {
    divisions,
    districts,
    upazilas,
    loadingDistricts,
    fetchDistrictsByDivision,
    fetchUpazilas,
    setUpazilas,
    setDistricts,
  };
};

export default useLocations;
