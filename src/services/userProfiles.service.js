import { readStore, writeStore } from '../lib/localStore';

const PROFILE_OVERRIDES_KEY = 'oclok_profile_overrides';

export const readProfileOverrides = () => readStore(PROFILE_OVERRIDES_KEY, {});

export const saveProfileOverride = (id, profile) => {
  const overrides = readProfileOverrides();
  overrides[id] = { ...(overrides[id] || {}), ...profile };
  writeStore(PROFILE_OVERRIDES_KEY, overrides);
  return overrides[id];
};

export const applyProfileOverride = (profile) => {
  if (!profile?.id) return profile;
  const override = readProfileOverrides()[profile.id];
  return override ? { ...profile, ...override } : profile;
};