import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";

const PaymentVerify = () => {
  const [params] = useSearchParams();
  const { clearCart } = useCart();
  const [state, setState] = useState({ loading: true, message: "Confirming your payment with Paystack…" });

  useEffect(() => {
    let active = true;
    const reference = params.get("reference");
    if (!reference) {
      setState({ loading: false, message: "No payment reference was provided." });
      return () => { active = false; };
    }
    api.get("/orders/paystack/verify", { params: { reference } })
      .then(() => {
        if (!active) return;
        clearCart();
        setState({ loading: false, paid: true, message: "Payment confirmed. Your order is now being processed." });
      })
      .catch((error) => {
        if (!active) return;
        setState({ loading: false, message: error.response?.data?.message || "We could not confirm this payment. Check your account before trying again." });
      });
    return () => { active = false; };
  }, [params, clearCart]);

  return <section className="mx-auto max-w-xl px-4 py-20 text-center sm:px-6">
    <h1 className="text-3xl font-extrabold">{state.paid ? "Thank you for your order" : "Payment status"}</h1>
    <p role="status" className="mt-4 rounded-xl bg-white p-5 text-sm text-ink/70 shadow-soft">{state.loading ? "Checking with Paystack…" : state.message}</p>
    {!state.loading && <Link to={state.paid ? "/account" : "/account"} className="mt-6 inline-block"><Button>{state.paid ? "View your orders" : "Go to your account"}</Button></Link>}
  </section>;
};

export default PaymentVerify;
