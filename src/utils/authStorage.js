const TOKEN_KEY = 'lifelink-token';
const USER_KEY = 'lifelink-user';

export const getAuthToken = () => sessionStorage.getItem(TOKEN_KEY);

export const getAuthUser = () => {
  const savedUser = sessionStorage.getItem(USER_KEY);
  return savedUser ? JSON.parse(savedUser) : null;
};

export const setAuthSession = (token, user) => {
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const setAuthUser = (user) => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const clearLegacyAuthStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};
