import { createContext, useContext, useMemo, useState } from "react";

// Cart context keeps cart state reusable across product cards, cart, and checkout.
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("Froyal AmityCart") || "[]"); } catch { return []; }
  });

  // Persist the cart any time an update function changes it.
  const saveItems = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem("Froyal AmityCart", JSON.stringify(nextItems));
  };

  // Adds a product or increases its quantity.
  const addToCart = (product, qty = 1) => {
    const existing = items.find((item) => item._id === product._id);
    const available = Math.max(0, Number(product.countInStock) || 0);
    if (!available) return;
    const nextItems = existing
      ? items.map((item) => (item._id === product._id ? { ...item, qty: Math.min(item.qty + qty, available) } : item))
      : [...items, { ...product, qty }];

    saveItems(nextItems);
  };

  // Changes quantity without allowing zero or negative values.
  const updateQty = (productId, qty) => {
    saveItems(items.map((item) => (item._id === productId ? { ...item, qty: Math.min(Math.max(1, qty), Math.max(1, Number(item.countInStock) || 1)) } : item)));
  };

  // Removes one product from the cart.
  const removeFromCart = (productId) => {
    saveItems(items.filter((item) => item._id !== productId));
  };

  // Clears cart after successful checkout.
  const clearCart = () => saveItems([]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal > 15000 || subtotal === 0 ? 0 : 1200;
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
