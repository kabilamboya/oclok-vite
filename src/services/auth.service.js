import { supabase, isSupabaseConfigured } from "./supabaseClient";

const AUTH_STORAGE_KEY = "oclok_registered_user";
const USERS_STORAGE_KEY = "oclok_registered_users";
const ACCOUNT_TYPES = ["novice customer", "technician", "deliboi", "admin"];
const ADMIN_CREDENTIALS = { email: "admin", password: "admin" };

const canUseStorage = () => typeof window !== "undefined" && window.localStorage;

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const sanitizeAccountType = (value) => {
  const normalized = String(value || "").trim().toLowerCase();

  if (normalized === "deliboi") return "deliboi";
  if (normalized === "novice") return "novice customer";
  if (normalized === "customer") return "novice customer";
  if (normalized === "admin") return "admin";

  return ACCOUNT_TYPES.includes(normalized) ? normalized : "novice customer";
};

export const getUserDashboardRoute = (accountType) => {
  const normalizedType = sanitizeAccountType(accountType);

  if (normalizedType === "admin") return "/admin";
  if (normalizedType === "technician") return "/account";
  if (normalizedType === "deliboi") return "/discover";
  return "/account";
};

const readRegisteredUsers = () => {
  if (!canUseStorage()) return [];

  try {
    const storedUsers = JSON.parse(window.localStorage.getItem(USERS_STORAGE_KEY) || "null");
    if (Array.isArray(storedUsers) && storedUsers.length) return storedUsers;

    const legacyUser = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    if (legacyUser?.email) return [legacyUser];

    return [];
  } catch (_error) {
    return [];
  }
};

const writeRegisteredUsers = (users) => {
  if (!canUseStorage()) return;
  const sanitizedUsers = Array.isArray(users) ? users : [];
  window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(sanitizedUsers));
};

export const registerUser = async ({ name, email, password, accountType }) => {
  const user = {
    name: String(name || "").trim(),
    email: normalizeEmail(email),
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
          const allUsers = readRegisteredUsers().filter((item) => item.email !== storedUser.email);
          allUsers.push(storedUser);
          writeRegisteredUsers(allUsers);
          window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(storedUser));
        }
        return storedUser;
      }
    } catch (_error) {
      // fall back to local storage if Supabase is unavailable
    }
  }

  if (canUseStorage()) {
    const allUsers = readRegisteredUsers().filter((item) => item.email !== user.email);
    allUsers.push(user);
    writeRegisteredUsers(allUsers);
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }
  return user;
};

export const getRegisteredUser = () => {
  if (!canUseStorage()) return null;

  try {
    const activeUser = JSON.parse(window.localStorage.getItem(AUTH_STORAGE_KEY) || "null");
    if (activeUser?.name && activeUser?.email) return activeUser;

    const users = readRegisteredUsers();
    return users.length ? users[users.length - 1] : null;
  } catch (_error) {
    return null;
  }
};

export const isAdminCredentials = ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || "");

  return normalizedEmail === ADMIN_CREDENTIALS.email && normalizedPassword === ADMIN_CREDENTIALS.password;
};

export const signInUser = ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);
  const normalizedPassword = String(password || "");

  if (!normalizedEmail || !normalizedPassword) return null;

  if (isAdminCredentials({ email: normalizedEmail, password: normalizedPassword })) {
    const adminUser = {
      name: "admin",
      email: "admin",
      password: "admin",
      account_type: "admin",
      registeredAt: new Date().toISOString(),
    };

    if (canUseStorage()) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminUser));
    }

    return adminUser;
  }

  const registeredUsers = readRegisteredUsers();
  const matchedUser = registeredUsers.find((user) => {
    const storedEmail = normalizeEmail(user?.email);
    return storedEmail === normalizedEmail && String(user?.password || "") === normalizedPassword;
  });

  if (!matchedUser) return null;

  if (canUseStorage()) {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(matchedUser));
  }

  return matchedUser;
};

export const isRegisteredUser = () => Boolean(getRegisteredUser());

export const clearRegisteredUser = () => {
  if (canUseStorage()) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    window.localStorage.removeItem(USERS_STORAGE_KEY);
  }
};
