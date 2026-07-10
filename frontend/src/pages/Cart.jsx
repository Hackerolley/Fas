import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";

// Cart page lets customers review quantities before checkout.
const Cart = () => {
  const { items, updateQty, removeFromCart, totals } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Shopping cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {items.length === 0 && <p className="rounded-lg bg-white p-6 text-ink/60 shadow-soft">Your cart is empty.</p>}
          {items.map((item) => (
            <div key={item._id} className="grid gap-4 rounded-lg bg-white p-4 shadow-soft ring-1 ring-black/5 sm:grid-cols-[96px_1fr_auto] sm:items-center">
              <img className="h-24 w-24 rounded-lg object-cover" src={item.images?.[0]?.url} alt={item.name} />
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-ink/60">${item.price}</p>
                <div className="mt-3 inline-flex items-center rounded-full bg-pearl">
                  <button className="p-2" onClick={() => updateQty(item._id, item.qty - 1)} aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <span className="px-3 text-sm font-bold">{item.qty}</span>
                  <button className="p-2" onClick={() => updateQty(item._id, item.qty + 1)} aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="rounded-full p-2 text-ink/50 hover:bg-linen hover:text-ink" aria-label="Remove item">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
          <p className="text-xl font-extrabold">Order summary</p>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>${totals.shipping.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
            <div className="flex justify-between border-t border-linen pt-3 text-base font-extrabold"><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
          </div>
          <Link to="/checkout">
            <Button disabled={items.length === 0} className="mt-6 w-full">Checkout</Button>
          </Link>
        </aside>
      </div>
    </section>
  );
};

export default Cart;
