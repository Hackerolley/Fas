import { createContext, useCallback, useContext, useMemo, useState } from "react";

// Cart context keeps cart state reusable across product cards, cart, and checkout.
const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem("Froyal AmityCart") || "[]"); } catch { return []; }
  });

  // Persist the cart any time an update function changes it.
  const saveItems = useCallback((nextItems) => {
    setItems((previousItems) => {
      const resolvedItems = typeof nextItems === "function" ? nextItems(previousItems) : nextItems;
      localStorage.setItem("Froyal AmityCart", JSON.stringify(resolvedItems));
      return resolvedItems;
    });
  }, []);

  // Adds a product or increases its quantity.
  const addToCart = useCallback((product, qty = 1) => {
    setItems((previousItems) => {
      const existing = previousItems.find((item) => item._id === product._id);
      const available = Math.max(0, Number(product.countInStock) || 0);
      if (!available) return previousItems;

      const nextItems = existing
        ? previousItems.map((item) => (item._id === product._id ? { ...item, qty: Math.min(item.qty + qty, available) } : item))
        : [...previousItems, { ...product, qty }];

      localStorage.setItem("Froyal AmityCart", JSON.stringify(nextItems));
      return nextItems;
    });
  }, []);

  // Changes quantity without allowing zero or negative values.
  const updateQty = useCallback((productId, qty) => {
    setItems((previousItems) => {
      const nextItems = previousItems.map((item) => {
        if (item._id !== productId) return item;
        const maxQty = Math.max(1, Number(item.countInStock) || 1);
        return { ...item, qty: Math.min(Math.max(1, qty), maxQty) };
      });

      localStorage.setItem("Froyal AmityCart", JSON.stringify(nextItems));
      return nextItems;
    });
  }, []);

  // Removes one product from the cart.
  const removeFromCart = useCallback((productId) => {
    setItems((previousItems) => {
      const nextItems = previousItems.filter((item) => item._id !== productId);
      localStorage.setItem("Froyal AmityCart", JSON.stringify(nextItems));
      return nextItems;
    });
  }, []);

  // Clears cart after successful checkout.
  const clearCart = useCallback(() => {
    setItems([]);
    localStorage.setItem("Froyal AmityCart", JSON.stringify([]));
  }, []);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal > 15000 || subtotal === 0 ? 0 : 1200;
    const tax = subtotal * 0.08;
    return { subtotal, shipping, tax, total: subtotal + shipping + tax, count: items.reduce((sum, item) => sum + item.qty, 0) };
  }, [items]);

  const value = useMemo(() => ({ items, addToCart, updateQty, removeFromCart, clearCart, totals }), [items, addToCart, updateQty, removeFromCart, clearCart, totals]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
