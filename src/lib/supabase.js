import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const configError = new Error(
  "Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
);

const createNoopQuery = () => {
  const query = {
    select: () => query,
    insert: () => query,
    update: () => query,
    delete: () => query,
    upsert: () => query,
    eq: () => query,
    neq: () => query,
    in: () => query,
    order: () => query,
    limit: () => query,
    single: () => query,
    maybeSingle: () => query,
    then: (resolve, reject) =>
      Promise.resolve({ data: null, error: configError }).then(resolve, reject),
  };

  return query;
};

const fallbackSupabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
  },
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: configError }),
      getPublicUrl: () => ({ data: { publicUrl: null } }),
      remove: async () => ({ data: null, error: configError }),
    }),
  },
  from: () => createNoopQuery(),
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : fallbackSupabase;
