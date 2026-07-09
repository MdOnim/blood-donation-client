import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import {
  getAuthToken,
  getAuthUser,
  setAuthSession,
  setAuthUser,
  clearAuthSession,
  clearLegacyAuthStorage,
} from '../utils/authStorage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    clearLegacyAuthStorage();

    const token = getAuthToken();
    const savedUser = getAuthUser();

    if (token && savedUser) {
      setUser(savedUser);
      api
        .get('/users/profile')
        .then((res) => {
          if (res.data.status === 'blocked') {
            clearAuthSession();
            setUser(null);
            return;
          }
          setUser(res.data);
          setAuthUser(res.data);
        })
        .catch(() => {
          clearAuthSession();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    setAuthSession(res.data.token, res.data.user);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    clearAuthSession();
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    setAuthUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
