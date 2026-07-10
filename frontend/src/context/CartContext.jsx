import { createContext, useContext, useMemo, useState } from "react";

// Cart context keeps cart state reusable across product cards, cart, and checkout.
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("luxeCart") || "[]"));

  // Persist the cart any time an update function changes it.
  const saveItems = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem("luxeCart", JSON.stringify(nextItems));
  };

  // Adds a product or increases its quantity.
  const addToCart = (product, qty = 1) => {
    const existing = items.find((item) => item._id === product._id);
    const nextItems = existing
      ? items.map((item) => (item._id === product._id ? { ...item, qty: item.qty + qty } : item))
      : [...items, { ...product, qty }];

    saveItems(nextItems);
  };

  // Changes quantity without allowing zero or negative values.
  const updateQty = (productId, qty) => {
    saveItems(items.map((item) => (item._id === productId ? { ...item, qty: Math.max(1, qty) } : item)));
  };

  // Removes one product from the cart.
  const removeFromCart = (productId) => {
    saveItems(items.filter((item) => item._id !== productId));
  };

  // Clears cart after successful checkout.
  const clearCart = () => saveItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal > 150 || subtotal === 0 ? 0 : 12;
    const tax = subtotal * 0.08;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax, count: items.reduce((sum, item) => sum + item.qty, 0) };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addToCart, updateQty, removeFromCart, clearCart, totals }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
