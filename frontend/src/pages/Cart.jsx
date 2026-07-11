import { Link } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import Button from "../components/Button";
import { useCart } from "../context/CartContext";

// Cart page lets customers review quantities before checkout.
const Cart = () => {
  const { items, updateQty, removeFromCart, totals } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-3 py-6 sm:px-6 sm:py-12 lg:px-8">
      <h1 className="text-2xl font-extrabold sm:text-4xl">Shopping cart</h1>
      <div className="mt-5 grid gap-5 sm:mt-8 sm:gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-2 sm:space-y-4">
          {items.length === 0 && <p className="rounded-lg bg-white p-6 text-ink/60 shadow-soft">Your cart is empty.</p>}
          {items.map((item) => (
            <div key={item._id} className="relative grid grid-cols-[88px_1fr] gap-3 rounded-md bg-white p-3 shadow-sm ring-1 ring-black/5 sm:grid-cols-[96px_1fr_auto] sm:items-center sm:gap-4 sm:rounded-lg sm:p-4 sm:shadow-soft">
              <div className="flex h-24 w-[88px] items-center justify-center rounded-md bg-[#f5f5f5] sm:w-24"><img className="h-full w-full object-contain p-1" src={item.images?.[0]?.url} alt={item.name} /></div>
              <div className="min-w-0 pr-7 sm:pr-0">
                <p className="line-clamp-2 text-sm font-bold sm:text-base">{item.name}</p>
                <p className="text-sm text-ink/60">${item.price}</p>
                <div className="mt-2 inline-flex items-center rounded-md bg-pearl sm:mt-3 sm:rounded-full">
                  <button className="p-2" onClick={() => updateQty(item._id, item.qty - 1)} aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <span className="px-3 text-sm font-bold">{item.qty}</span>
                  <button className="p-2" onClick={() => updateQty(item._id, item.qty + 1)} aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="absolute right-2 top-2 rounded-full p-1.5 text-ink/50 hover:bg-linen hover:text-ink sm:static sm:p-2" aria-label="Remove item">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
        <aside className="h-fit rounded-lg bg-white p-4 shadow-soft ring-1 ring-black/5 sm:p-6">
          <p className="text-lg font-extrabold sm:text-xl">Order summary</p>
          <div className="mt-4 space-y-3 text-sm sm:mt-5">
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
