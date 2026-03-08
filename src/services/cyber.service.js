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

export const generateBrandPrompt = (payload) =>
  request('/api/cyber/prompts/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const savePromptTraining = (payload) =>
  request('/api/cyber/prompts/training', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const listPromptTraining = () => request('/api/cyber/prompts/training');

export const getPromptUsageSummary = () => request('/api/cyber/usage/summary');

export const listCyberMockups = ({ userId, status } = {}) => {
  const query = new URLSearchParams();
  if (userId) query.set('user_id', userId);
  if (status) query.set('status', status);
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return request(`/api/cyber/mockups${suffix}`);
};

export const createCyberMockup = (payload) =>
  request('/api/cyber/mockups', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateCyberMockupStatus = (id, status) =>
  request(`/api/cyber/mockups/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
