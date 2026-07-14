const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  let payload = {};

  try {
    payload = await response.json();
  } catch {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed. Please try again.');
  }

  return payload.data;
};

export const loginUser = (credentials) =>
  request('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });

export const registerUser = (userData) =>
  request('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
