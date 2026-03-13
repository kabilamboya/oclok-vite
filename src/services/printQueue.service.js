import { createId, readStore, writeStore } from "@/lib/localStore";

const QUEUE_KEY = "oclok_print_queue";
const DOCUMENTS_KEY = "oclok_documents";

const readArray = (key) => {
  const value = readStore(key, []);
  return Array.isArray(value) ? value : [];
};

const writeArray = (key, value) => {
  writeStore(key, value);
};

export const addToPrintQueue = async (payload = {}) => {
  const queue = readArray(QUEUE_KEY);
  const created = {
    id: createId("print"),
    document_id: payload.document_id,
    user_id: payload.user_id || payload.userId || "guest",
    status: payload.status || "queued",
    created_at: new Date().toISOString(),
  };

  queue.unshift(created);
  writeArray(QUEUE_KEY, queue);
  return { data: created };
};

export const getPrintQueue = async (userId) => {
  const queue = readArray(QUEUE_KEY);
  const documents = readArray(DOCUMENTS_KEY);
  const filtered = userId
    ? queue.filter((item) => item.user_id === userId || item.userId === userId)
    : queue;

  const hydrated = filtered.map((item) => {
    const doc = documents.find((entry) => entry.id === item.document_id);
    return {
      ...item,
      documents: { title: doc?.title || "Untitled document" },
    };
  });

  return { data: hydrated };
};
