export const CART_STORAGE_KEY = "cart";

const toArray = (value) => (Array.isArray(value) ? value : []);

const normalizeCartItem = (product, quantity = 1) => {
  const normalizedQuantity = Number(quantity) || 1;
  return {
    id: product?.id,
    name: product?.name || product?.title || "Item",
    title: product?.title || product?.name || "Item",
    price: Number(product?.price) || 0,
    image: product?.image || product?.thumbnail || "",
    thumbnail: product?.thumbnail || product?.image || "",
    quantity: normalizedQuantity,
    file: Boolean(product?.file),
    isMockup: Boolean(product?.isMockup),
  };
};

export const readCart = () => {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(CART_STORAGE_KEY);
    return toArray(stored ? JSON.parse(stored) : []);
  } catch (_error) {
    return [];
  }
};

export const writeCart = (cart) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(toArray(cart)));
};

export const notifyCartUpdate = (message) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("cart:updated"));
  if (message) {
    window.dispatchEvent(new CustomEvent("cart:notify", { detail: { message } }));
  }
};

export const persistCart = (cart, message) => {
  writeCart(cart);
  notifyCartUpdate(message);
  return toArray(cart);
};

export const createCartItem = (product, quantity = 1) => normalizeCartItem(product, quantity);

export const addProductToCart = (cart, product, quantity = 1) => {
  const nextCart = toArray(cart);
  const existingIndex = nextCart.findIndex((item) => String(item.id) === String(product?.id));

  if (existingIndex >= 0) {
    const existingItem = nextCart[existingIndex];
    nextCart[existingIndex] = {
      ...existingItem,
      quantity: (Number(existingItem.quantity) || 0) + Number(quantity || 1),
    };
    return nextCart;
  }

  return [...nextCart, normalizeCartItem(product, quantity)];
};

export const increaseCartItemQuantity = (cart, id) => {
  const nextCart = toArray(cart);
  const item = nextCart.find((entry) => String(entry.id) === String(id));
  if (!item) return nextCart;

  return nextCart.map((entry) =>
    String(entry.id) === String(id)
      ? { ...entry, quantity: (Number(entry.quantity) || 0) + 1 }
      : entry
  );
};

export const decreaseCartItemQuantity = (cart, id) => {
  const nextCart = toArray(cart);
  const item = nextCart.find((entry) => String(entry.id) === String(id));
  if (!item) return nextCart;

  const updatedCart = nextCart
    .map((entry) => {
      if (String(entry.id) !== String(id)) return entry;
      const nextQuantity = (Number(entry.quantity) || 0) - 1;
      return nextQuantity > 0 ? { ...entry, quantity: nextQuantity } : null;
    })
    .filter(Boolean);

  return updatedCart;
};

export const removeCartItem = (cart, id) =>
  toArray(cart).filter((entry) => String(entry.id) !== String(id));

export default {
  CART_STORAGE_KEY,
  readCart,
  writeCart,
  notifyCartUpdate,
  persistCart,
  createCartItem,
  addProductToCart,
  increaseCartItemQuantity,
  decreaseCartItemQuantity,
  removeCartItem,
};
