const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const isJson = response.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.error || data?.message || `Request failed: ${response.status}`);
  }

  return data;
};

export const createDeliboisMembership = (payload) =>
  request('/api/delibois/memberships', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const createDeliboisOrder = (payload) =>
  request('/api/delibois/orders', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
