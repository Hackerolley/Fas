import { Link } from "react-router-dom";
import { ShoppingBag, Star } from "lucide-react";
import Button from "./Button";
import { useCart } from "../context/CartContext";

// Product card is reused on home and catalog pages.
const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const image = product.images?.[0]?.url;

  return (
    <article className="group overflow-hidden rounded-lg bg-white shadow-soft ring-1 ring-black/5">
      <Link to={`/products/${product.slug || product._id}`} className="block aspect-[4/5] overflow-hidden bg-linen">
        <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={image} alt={product.name} />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-clay">{product.category}</p>
            <Link to={`/products/${product.slug || product._id}`} className="mt-1 block text-lg font-bold text-ink">
              {product.name}
            </Link>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-sm font-semibold text-moss">
            <Star size={16} fill="currentColor" />
            {product.rating}
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-ink/65">{product.description}</p>
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="text-lg font-extrabold">${product.price}</span>
            {product.compareAtPrice > 0 && <span className="ml-2 text-sm text-ink/40 line-through">${product.compareAtPrice}</span>}
          </div>
          <Button className="h-10 w-10 rounded-full px-0" aria-label={`Add ${product.name} to cart`} onClick={() => addToCart(product)}>
            <ShoppingBag size={18} />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
