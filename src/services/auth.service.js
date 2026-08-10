import { supabase, isSupabaseConfigured } from "./supabaseClient";

const AUTH_STORAGE_KEY = "oclok_registered_user";
const ACCOUNT_TYPES = ["novice customer", "technician", "deliboi"];

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

const sanitizeAccountType = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return ACCOUNT_TYPES.includes(normalized) ? normalized : "novice customer";
};

export const registerUser = async ({ name, email, password, accountType }) => {
  const user = {
    name: String(name || "").trim(),
    email: String(email || "").trim().toLowerCase(),
    password: String(password || ""),
    account_type: sanitizeAccountType(accountType),
    registeredAt: new Date().toISOString(),
  };

  if (!user.name || !user.email || !user.password) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("users").insert([{
        name: user.name,
        email: user.email,
        password: user.password,
        account_type: user.account_type,
        created_at: user.registeredAt,
      }]).select().single();

      if (!error && data) {
        const storedUser = {
          ...user,
          id: data.id,
          createdAt: data.created_at || user.registeredAt,
        };
        if (canUseStorage()) {
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedUser));
        }
        return storedUser;
      }
    } catch (_error) {
      // fall back to local storage if Supabase is unavailable
    }
  }

  if (canUseStorage()) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
  return user;
};

export const getRegisteredUser = () => {
  if (!canUseStorage()) return null;

  try {
    const stored = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    return stored?.name && stored?.email ? stored : null;
  } catch (_error) {
    return null;
  }
};

export const isRegisteredUser = () => Boolean(getRegisteredUser());

export const clearRegisteredUser = () => {
  if (canUseStorage()) window.localStorage.removeItem(AUTH_STORAGE_KEY);
};
