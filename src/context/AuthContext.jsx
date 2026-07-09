import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('lifelink-token');
    const savedUser = localStorage.getItem('lifelink-user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      api
        .get('/users/profile')
        .then((res) => {
          if (res.data.status === 'blocked') {
            localStorage.removeItem('lifelink-token');
            localStorage.removeItem('lifelink-user');
            setUser(null);
            return;
          }
          setUser(res.data);
          localStorage.setItem('lifelink-user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('lifelink-token');
          localStorage.removeItem('lifelink-user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('lifelink-token', res.data.token);
    localStorage.setItem('lifelink-user', JSON.stringify(res.data.user));
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('lifelink-token');
    localStorage.removeItem('lifelink-user');
    setUser(null);
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('lifelink-user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
