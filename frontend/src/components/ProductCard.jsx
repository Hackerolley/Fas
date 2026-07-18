import { useState } from "react";
import { Check, Heart, ShoppingBag, Star } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "./Button";
import { useCart } from "../context/CartContext";

// A commerce-first card with a full-bleed image, quick action, and clear pricing.
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [wasAdded, setWasAdded] = useState(false);
  const [saved, setSaved] = useState(false);
  const image = product.images?.[0]?.url;
  const add = () => { addToCart(product); setWasAdded(true); window.setTimeout(() => setWasAdded(false), 1600); };
  const discount = product.compareAtPrice > product.price ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  return <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
    <div className="relative aspect-square overflow-hidden bg-[#f4f4f4]">
      <Link to={`/products/${product.slug || product._id}`} className="block h-full w-full"><img src={image} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></Link>
      {discount > 0 && <span className="absolute left-2 top-2 rounded bg-[#ff6a00] px-2 py-1 text-[10px] font-extrabold text-white">-{discount}%</span>}
      <button type="button" onClick={() => setSaved((current) => !current)} aria-pressed={saved} aria-label={`${saved ? "Remove" : "Save"} ${product.name}`} className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full shadow-sm ${saved ? "bg-ink text-white" : "bg-white/95 text-ink hover:bg-ink hover:text-white"}`}><Heart size={16} fill={saved ? "currentColor" : "none"} /></button>
      <Button disabled={product.countInStock === 0} onClick={add} aria-label={`Add ${product.name} to cart`} className="absolute bottom-2 right-2 !h-10 !min-h-0 !w-10 !rounded-full !bg-white !p-0 !text-ink shadow-md hover:!bg-ink hover:!text-white">{wasAdded ? <Check size={17} /> : <ShoppingBag size={17} />}</Button>
    </div>
    <div className="flex flex-1 flex-col p-3 sm:p-4">
      <p className="text-[10px] font-bold uppercase tracking-wide text-ink/45">{product.brand}</p>
      <Link to={`/products/${product.slug || product._id}`} className="mt-1 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-ink hover:text-clay">{product.name}</Link>
      <div className="mt-2 flex items-center gap-1 text-xs text-ink/55"><Star size={13} fill="currentColor" className="text-[#eab308]" /><span>{Number(product.rating || 0).toFixed(1)}</span><span>({product.numReviews || 0})</span></div>
      <div className="mt-3 flex items-baseline gap-2"><span className="text-base font-extrabold text-[#b77900]">₦{Number(product.price || 0).toLocaleString()}</span>{product.compareAtPrice > product.price && <span className="text-xs text-ink/40 line-through">₦{Number(product.compareAtPrice).toLocaleString()}</span>}</div>
      {product.countInStock > 0 ? <p className="mt-2 text-[11px] font-semibold text-moss">In stock · Free delivery</p> : <p className="mt-2 text-[11px] font-semibold text-red-600">Out of stock</p>}
    </div>
  </article>;
};

export default ProductCard;
