const memoryStore = new Map();

const readMemory = (key, fallback) =>
  memoryStore.has(key) ? memoryStore.get(key) : fallback;

export const readStore = (key, fallback = null) => {
  if (typeof window === "undefined") {
    return readMemory(key, fallback);
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
};

export const writeStore = (key, value) => {
  if (typeof window === "undefined") {
    memoryStore.set(key, value);
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
};

export const createId = (prefix = "id") =>
  `${prefix}_${Date.now().toString(36)}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;

export const getLocalUserId = (storageKey = "oclok_guest_user_id") => {
  if (typeof window === "undefined") {
    return createId("guest");
  }

  const existing = window.localStorage.getItem(storageKey);
  if (existing) return existing;

  const created = createId("guest");
  window.localStorage.setItem(storageKey, created);
  return created;
};
