const CART_STORAGE_KEY = "gardenCareCart";

const parseCart = (rawValue) => {
  if (!rawValue) return [];

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getCartItems = () => parseCart(localStorage.getItem(CART_STORAGE_KEY));

export const setCartItems = (items) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-changed"));
};

export const addServiceToCart = (service) => {
  const currentItems = getCartItems();
  const exists = currentItems.some((item) => Number(item.id) === Number(service.id));

  if (exists) {
    return {
      added: false,
      items: currentItems,
    };
  }

  const nextItems = [
    ...currentItems,
    {
      id: service.id,
      name: service.name,
      price: Number(service.price || 0),
      image: service.image || "",
    },
  ];

  setCartItems(nextItems);

  return {
    added: true,
    items: nextItems,
  };
};

export const removeServiceFromCart = (serviceId) => {
  const nextItems = getCartItems().filter((item) => Number(item.id) !== Number(serviceId));
  setCartItems(nextItems);
  return nextItems;
};

export const clearCart = () => setCartItems([]);

export const getCartCount = () => getCartItems().length;

export const getCartTotal = () =>
  getCartItems().reduce((sum, item) => sum + Number(item.price || 0), 0);
