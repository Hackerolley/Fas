import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Checkout page collects shipping details and posts an order to the API.
const Checkout = () => {
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [shipping, setShipping] = useState(user?.shippingAddress || { fullName: "", address: "", city: "", postalCode: "", country: "", phone: "" });

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!items.length) { setMessage("Your cart is empty."); return; }
    const orderItems = items.map((item) => ({ product: item._id, name: item.name, qty: item.qty, image: item.images?.[0]?.url, price: item.price }));

    try {
      await api.post("/orders", {
        orderItems,
        shippingAddress: shipping,
        paymentMethod: "Card",
      });
      clearCart();
      setMessage("Order placed successfully. You can track it from your account.");
    } catch (error) {
      setMessage(error.response?.data?.message || "We could not place your order. Please try again.");
    }
  };

  return (
    <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Checkout</h1>
      {!user && <p className="mt-3 rounded-xl bg-linen p-3 text-sm">Please <Link className="font-medium underline" to="/login">sign in</Link> before placing your order.</p>}
      <form onSubmit={submitOrder} className="mt-8 grid gap-4 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        {Object.keys(shipping).map((field) => (
          <label key={field} className="text-sm font-semibold capitalize text-ink/70">
            {field.replace(/([A-Z])/g, " $1")}
            <input
              required
              value={shipping[field]}
              onChange={(event) => setShipping({ ...shipping, [field]: event.target.value })}
              className="mt-2 min-h-11 w-full rounded-lg border border-linen px-3 outline-none focus:border-clay"
            />
          </label>
        ))}
        <Button type="submit" className="mt-2">Place order</Button>
        {message && <p className="rounded-lg bg-pearl p-3 text-sm font-semibold text-moss">{message}</p>}
      </form>
    </section>
  );
};

export default Checkout;
