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
  <article className="group flex h-full flex-col overflow-hidden border border-gray-100 bg-white transition hover:shadow-md">

    {/* Product Image */}
    <Link
      to={`/products/${product.slug || product._id}`}
      className="flex h-60 items-center justify-center overflow-hidden bg-white"
    >
      <img
        className="
          max-h-full
          max-w-full
          object-contain
          p-3
          transition
          duration-300
          group-hover:scale-105
        "
        src={image}
        alt={product.name}
      />
    </Link>


    {/* Product Details */}
    <div className="flex flex-1 flex-col p-3">

      {/* Product Name */}
      <Link
        to={`/products/${product.slug || product._id}`}
        className="
          min-h-[40px]
          line-clamp-2
          text-sm
          font-medium
          leading-5
          text-gray-900
          hover:text-black
        "
      >
        {product.name}
      </Link>


      {/* Rating */}
      <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
        <Star
          size={14}
          fill="currentColor"
          className="text-gray-700"
        />
        <span>{product.rating || 0}</span>
        <span>
          ({product.numReviews || 0})
        </span>
      </div>


      {/* Price */}
      <div className="mt-2">
        <span className="text-lg font-bold text-gray-900">
          ₦{product.price.toLocaleString()}
        </span>

        {product.compareAtPrice > 0 && (
          <span className="ml-2 text-sm text-gray-400 line-through">
            ₦{product.compareAtPrice.toLocaleString()}
          </span>
        )}
      </div>


      {/* Stock Status */}
      {product.countInStock === 0 && (
        <p className="mt-1 text-xs text-red-500">
          Out of stock
        </p>
      )}


      {/* Add Button */}
      <Button
        disabled={product.countInStock === 0}
        onClick={handleAddToCart}
        className="
          mt-auto
          w-full
          rounded-md
          px-4
          py-2
          text-sm
        "
      >
        {wasAdded ? (
          <>
            <Check size={16} className="mr-2" />
            Added
          </>
        ) : (
          <>
            <ShoppingBag size={16} className="mr-2" />
            Add to Cart
          </>
        )}
      </Button>

    </div>

  </article>
);
};

export default ProductCard;
