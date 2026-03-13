import { createId, readStore, writeStore } from "@/lib/localStore";

const DOCUMENTS_KEY = "oclok_documents";

const readArray = () => {
  const value = readStore(DOCUMENTS_KEY, []);
  return Array.isArray(value) ? value : [];
};

const writeArray = (value) => {
  writeStore(DOCUMENTS_KEY, value);
};

export const createDocument = async (payload = {}) => {
  const documents = readArray();
  const created = {
    id: createId("doc"),
    title: payload.title || "Untitled",
    content: payload.content || "",
    user_id: payload.user_id || payload.userId || "guest",
    created_at: new Date().toISOString(),
  };

  documents.unshift(created);
  writeArray(documents);
  return { data: created };
};

export const getDocuments = async (userId) => {
  const documents = readArray();
  const filtered = userId
    ? documents.filter(
        (doc) => doc.user_id === userId || doc.userId === userId,
      )
    : documents;
  return { data: filtered };
};

export const updateDocument = async (id, updates = {}) => {
  const documents = readArray();
  const index = documents.findIndex((doc) => doc.id === id);
  if (index === -1) return { data: null };

  const updated = { ...documents[index], ...updates };
  documents[index] = updated;
  writeArray(documents);
  return { data: updated };
};

export const deleteDocument = async (id) => {
  const documents = readArray();
  const next = documents.filter((doc) => doc.id !== id);
  writeArray(next);
  return { data: null };
};
