import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Checkout page collects shipping details and posts an order to the API.
const Checkout = () => {
  const { items } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [pendingOrderId, setPendingOrderId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [shipping, setShipping] = useState(user?.shippingAddress || { fullName: "", address: "", city: "", postalCode: "", country: "", phone: "" });

  const submitOrder = async (event) => {
    event.preventDefault();
    if (!user) { navigate("/login"); return; }
    if (!pendingOrderId && !items.length) { setMessage("Your cart is empty."); return; }
    const orderItems = items.map((item) => ({ product: item._id, name: item.name, qty: item.qty, image: item.images?.[0]?.url, price: item.price }));

    setSubmitting(true);
    setMessage("");
    try {
      let orderId = pendingOrderId;
      if (!orderId) {
        const { data: order } = await api.post("/orders", {
          orderItems,
          shippingAddress: shipping,
          paymentMethod: "Paystack",
        });
        orderId = order._id;
        setPendingOrderId(orderId);
      }
      const { data: payment } = await api.post(`/orders/${orderId}/paystack/initialize`);
      window.location.assign(payment.authorizationUrl);
    } catch (error) {
      setMessage(error.response?.data?.message || "We could not place your order. Please try again.");
    } finally {
      setSubmitting(false);
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
        <p className="rounded-lg bg-pearl p-3 text-sm text-ink/70">You’ll complete your card payment securely on Paystack. Your order total is confirmed by the store server.</p>
        <Button type="submit" disabled={submitting} className="mt-2">{submitting ? "Preparing secure payment…" : pendingOrderId ? "Retry Paystack checkout" : "Continue to Paystack"}</Button>
        {message && <p className="rounded-lg bg-pearl p-3 text-sm font-semibold text-moss">{message}</p>}
      </form>
    </section>
  );
};

export default Checkout;
