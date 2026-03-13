export const API = {
  user: 'https://user-service-ekmh.onrender.com',
  product: 'https://product-service-t6mo.onrender.com',
  cart: 'https://cart-service-thp5.onrender.com',
  order: 'https://order-service-s3gt.onrender.com',
};

export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};