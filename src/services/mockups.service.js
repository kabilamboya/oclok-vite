import { createId, readStore, writeStore } from '../lib/localStore';

const MOCKUPS_KEY = 'oclok_mockups';

const readMockups = () => {
  const stored = readStore(MOCKUPS_KEY, []);
  return Array.isArray(stored) ? stored : [];
};

const writeMockups = (mockups) => {
  writeStore(MOCKUPS_KEY, mockups);
};

const mockupsService = {
  getAll() {
    return readMockups();
  },

  getApproved() {
    return this.getAll().filter((item) => item.status === 'approved');
  },

  create(payload = {}) {
    const created = {
      id: createId('mockup'),
      name: payload.name || 'Untitled mockup',
      category: payload.category || 'General',
      status: payload.status || 'draft',
      url: payload.url || '',
      createdAt: new Date().toISOString(),
      ...payload,
    };

    const updated = [created, ...readMockups()];
    writeMockups(updated);
    return created;
  },

  updateStatus(id, status) {
    const mockups = readMockups();
    const index = mockups.findIndex((item) => String(item.id) === String(id));
    if (index === -1) return null;

    mockups[index] = { ...mockups[index], status };
    writeMockups(mockups);
    return mockups[index];
  },
};

export default mockupsService;
