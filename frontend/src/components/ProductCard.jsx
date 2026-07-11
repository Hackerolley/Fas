import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ShoppingBag, Star } from "lucide-react";
import Button from "./Button";
import { useCart } from "../context/CartContext";

// Product card is reused on home and catalog pages.
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const image = product.images?.[0]?.url;
  const [wasAdded, setWasAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setWasAdded(true);
    window.setTimeout(() => setWasAdded(false), 1600);
  };

  return (
    <article className="group overflow-hidden rounded-md bg-white shadow-sm ring-1 ring-black/5 sm:rounded-lg sm:shadow-soft">
      <Link to={`/products/${product.slug || product._id}`} className="block aspect-square overflow-hidden bg-[#f5f5f5] sm:aspect-[4/5]">
        <img className="h-full w-full object-contain p-1 transition duration-300 group-hover:scale-105 sm:p-2" src={image} alt={product.name} />
      </Link>
      <div className="space-y-2 p-2 sm:space-y-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="hidden text-xs font-semibold uppercase tracking-wide text-clay sm:block">{product.category}</p>
            <Link to={`/products/${product.slug || product._id}`} className="block line-clamp-2 text-sm font-bold leading-5 text-ink sm:mt-1 sm:text-lg">
              {product.name}
            </Link>
          </div>
          <div className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-moss sm:flex">
            <Star size={16} fill="currentColor" />
            {product.rating}
          </div>
        </div>
        <p className="hidden line-clamp-2 text-sm text-ink/65 sm:block">{product.description}</p>
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-extrabold sm:text-lg">${product.price}</span>
            {product.compareAtPrice > 0 && <span className="ml-1 text-xs text-ink/40 line-through sm:ml-2 sm:text-sm">${product.compareAtPrice}</span>}
          </div>
          <Button disabled={product.countInStock === 0} className="h-8 w-8 rounded-full px-0 sm:h-10 sm:w-auto sm:gap-2 sm:px-4" aria-label={`Add ${product.name} to cart`} onClick={handleAddToCart}>
            {wasAdded ? <><Check size={16} /><span className="hidden sm:inline">Added</span></> : <><ShoppingBag size={16} /><span className="hidden sm:inline">Add</span></>}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
