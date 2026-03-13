// API Base URLs - change these when you deploy to production
export const API = {
  USER:    "http://localhost:3001",
  PRODUCT: "http://localhost:3002",
  CART:    "http://localhost:3003",
  ORDER:   "http://localhost:3004",
};

// Save token to localStorage after login
export const saveToken = (token: string) => {
  localStorage.setItem("ares_token", token);
};

// Get token from localStorage
export const getToken = (): string | null => {
  return localStorage.getItem("ares_token");
};

// Remove token on logout
export const removeToken = () => {
  localStorage.removeItem("ares_token");
  localStorage.removeItem("ares_user");
};

// Save user info
export const saveUser = (user: object) => {
  localStorage.setItem("ares_user", JSON.stringify(user));
};

// Get user info
export const getUser = () => {
  const u = localStorage.getItem("ares_user");
  return u ? JSON.parse(u) : null;
};

// Auth headers for protected routes
export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});
