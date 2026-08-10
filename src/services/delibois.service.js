import { createId, readStore, writeStore } from "@/lib/localStore";
import { supabase, isSupabaseConfigured } from "./supabaseClient";

const ORDERS_KEY = "oclok_delibois_orders";
const MEMBERSHIPS_KEY = "oclok_delibois_memberships";

const readArray = (key) => {
  const value = readStore(key, []);
  return Array.isArray(value) ? value : [];
};

const writeArray = (key, value) => {
  writeStore(key, value);
};

export const createDeliboisMembership = async (payload = {}) => {
  const createdAt = new Date().toISOString();
  const record = {
    id: createId("membership"),
    created_at: createdAt,
    ...payload,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("delibois_memberships").insert([record]).select().single();
      if (!error && data) {
        return data;
      }
    } catch (_error) {
      // fall back to local storage below
    }
  }

  const memberships = readArray(MEMBERSHIPS_KEY);
  memberships.unshift(record);
  writeArray(MEMBERSHIPS_KEY, memberships);
  return record;
};

export const createDeliboisOrder = async (payload = {}) => {
  const createdAt = new Date().toISOString();
  const record = {
    id: createId("order"),
    created_at: createdAt,
    order_type: payload.orderType || payload.order_type || "",
    orderType: payload.orderType || payload.order_type || "",
    ...payload,
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from("delibois_orders").insert([record]).select().single();
      if (!error && data) {
        return { data, success: true };
      }
    } catch (_error) {
      // fall back to local storage below
    }
  }

  const orders = readArray(ORDERS_KEY);
  orders.unshift(record);
  writeArray(ORDERS_KEY, orders);
  return { data: record, success: true };
};
