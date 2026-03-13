import { createId, readStore, writeStore } from "@/lib/localStore";

const MOCKUPS_KEY = "oclok_cyber_mockups";
const TRAINING_KEY = "oclok_cyber_training";
const USAGE_KEY = "oclok_cyber_usage";

const readArray = (key) => {
  const value = readStore(key, []);
  return Array.isArray(value) ? value : [];
};

const writeArray = (key, value) => {
  writeStore(key, value);
};

const ensureUsage = () => {
  const fallback = { totalPrompts: 0, topBrands: {}, recent: [] };
  const value = readStore(USAGE_KEY, fallback);
  if (!value || typeof value !== "object") return fallback;
  return {
    ...fallback,
    ...value,
    topBrands: value.topBrands || {},
    recent: Array.isArray(value.recent) ? value.recent : [],
  };
};

const recordBrandUsage = (brandName) => {
  if (!brandName) return;
  const usage = ensureUsage();
  usage.totalPrompts += 1;
  usage.topBrands[brandName] = (usage.topBrands[brandName] || 0) + 1;
  usage.recent = [
    { id: createId("usage"), brandName, createdAt: new Date().toISOString() },
    ...usage.recent,
  ].slice(0, 12);
  writeStore(USAGE_KEY, usage);
};

export const generateBrandPrompt = async (payload = {}) => {
  const brand = payload.brandName || "Your Brand";
  const goal = payload.campaignGoal || "grow awareness";
  const tone = payload.tone || "confident and modern";
  const audience = payload.audience || "local customers";
  const platform = payload.platform || "multi-channel";
  const keywords = Array.isArray(payload.keywords) ? payload.keywords : [];
  const keywordLine = keywords.length ? `Keywords: ${keywords.join(", ")}.` : "";

  const prompt = [
    `You are a creative strategist for ${brand}.`,
    `Goal: ${goal}.`,
    `Audience: ${audience}.`,
    `Tone: ${tone}.`,
    `Platform: ${platform}.`,
    keywordLine,
    "Deliver a clear headline, short body copy, and a CTA.",
  ]
    .filter(Boolean)
    .join(" ");

  const variations = [
    `${brand}: ${goal} with a bold, punchy CTA.`,
    `${brand} campaign: speak to ${audience} in a ${tone} voice.`,
    `${brand} on ${platform}: focus on one benefit and one proof point.`,
  ];

  const suggestedAssets = [
    "Hero product shot",
    "Behind-the-scenes photo",
    "Brand color palette swatches",
    "Product detail close-up",
  ];

  recordBrandUsage(brand);
  return { prompt, variations, suggestedAssets };
};

export const savePromptTraining = async (payload = {}) => {
  const training = readArray(TRAINING_KEY);
  const preferredOutput =
    payload.preferredOutput || payload.preferred_output || "";

  const created = {
    id: createId("training"),
    userId: payload.userId || null,
    input_prompt: payload.inputPrompt || payload.input_prompt || "",
    preferred_output: preferredOutput,
    preferredOutput,
    tags: Array.isArray(payload.tags) ? payload.tags : [],
    notes: payload.notes || "",
    rating: payload.rating || 0,
    created_at: new Date().toISOString(),
  };

  training.unshift(created);
  writeArray(TRAINING_KEY, training);
  return created;
};

export const listPromptTraining = async () => readArray(TRAINING_KEY);

export const getPromptUsageSummary = async () => ensureUsage();

export const listCyberMockups = async ({ userId, status } = {}) => {
  const mockups = readArray(MOCKUPS_KEY);
  return mockups.filter((item) => {
    const matchesUser = !userId || item.userId === userId;
    const matchesStatus = !status || item.status === status;
    return matchesUser && matchesStatus;
  });
};

export const createCyberMockup = async (payload = {}) => {
  const mockups = readArray(MOCKUPS_KEY);
  const tags = Array.isArray(payload.tags)
    ? payload.tags
    : String(payload.tags || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const created = {
    id: createId("mockup"),
    userId: payload.userId || payload.user_id || "guest",
    name: payload.name || "Untitled mockup",
    url: payload.url || "",
    category: payload.category || "",
    tags,
    prompt_used: payload.promptUsed || payload.prompt_used || "",
    status: payload.status || "draft",
    created_at: new Date().toISOString(),
  };

  mockups.unshift(created);
  writeArray(MOCKUPS_KEY, mockups);
  return created;
};

export const updateCyberMockupStatus = async (id, status) => {
  const mockups = readArray(MOCKUPS_KEY);
  const index = mockups.findIndex((item) => item.id === id);
  if (index === -1) return { id, status };

  const updated = { ...mockups[index], status };
  mockups[index] = updated;
  writeArray(MOCKUPS_KEY, mockups);
  return updated;
};
