import { useState, useEffect } from 'react';
import api from '../api/axios';

const useLocations = () => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [upazilas, setUpazilas] = useState([]);
  const [loadingDistricts, setLoadingDistricts] = useState(true);

  useEffect(() => {
    api.get('/locations/divisions').then((res) => setDivisions(res.data));
    api
      .get('/locations/districts')
      .then((res) => setDistricts(res.data))
      .finally(() => setLoadingDistricts(false));
  }, []);

  const fetchDistrictsByDivision = async (divisionId) => {
    if (!divisionId) {
      const res = await api.get('/locations/districts');
      setDistricts(res.data);
      return;
    }
    const res = await api.get(`/locations/districts?division=${divisionId}`);
    setDistricts(res.data);
  };

  const fetchUpazilas = async (district) => {
    if (!district) {
      setUpazilas([]);
      return;
    }
    const res = await api.get(`/locations/upazilas/${encodeURIComponent(district)}`);
    setUpazilas(res.data);
  };

  return {
    divisions,
    districts,
    upazilas,
    loadingDistricts,
    fetchDistrictsByDivision,
    fetchUpazilas,
    setUpazilas,
  };
};

export default useLocations;
