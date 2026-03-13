import { createId, readStore, writeStore } from "@/lib/localStore";

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
  const memberships = readArray(MEMBERSHIPS_KEY);
  const createdAt = new Date().toISOString();

  const record = {
    id: createId("membership"),
    created_at: createdAt,
    ...payload,
  };

  memberships.unshift(record);
  writeArray(MEMBERSHIPS_KEY, memberships);
  return record;
};

export const createDeliboisOrder = async (payload = {}) => {
  const orders = readArray(ORDERS_KEY);
  const createdAt = new Date().toISOString();

  const record = {
    id: createId("order"),
    created_at: createdAt,
    order_type: payload.orderType || payload.order_type || "",
    orderType: payload.orderType || payload.order_type || "",
    ...payload,
  };

  orders.unshift(record);
  writeArray(ORDERS_KEY, orders);
  return record;
};
