import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ShoppingBag, Star } from "lucide-react";
import Button from "./Button";
import { useCart } from "../context/CartContext";
import { Heart } from "lucide-react";

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
  <article className="group flex h-full flex-col overflow-hidden border border-gray-100 bg-white transition duration-300 hover:shadow-xl">

    {/* Image Section */}
    <div className="relative">

      <Link
        to={`/products/${product.slug || product._id}`}
        className="
          flex
          h-64
          w-full
          items-center
          justify-center
          overflow-hidden
          bg-gray-50
        "
      >
        <img
          src={image}
          alt={product.name}
          className="
            h-full
            w-full
            object-contain
            p-4
            transition
            duration-500
            group-hover:scale-105
          "
        />
      </Link>


      {/* Discount Badge */}
      {product.compareAtPrice > product.price && (
        <span
          className="
            absolute
            left-3
            top-3
            rounded-full
            bg-black
            px-2.5
            py-1
            text-[10px]
            font-semibold
            tracking-wide
            text-white
          "
        >
          -
          {Math.round(
            ((product.compareAtPrice - product.price) /
              product.compareAtPrice) *
              100
          )}
          %
        </span>
      )}


      {/* Wishlist */}
      <button
        className="
          absolute
          right-3
          top-3
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-white
          text-gray-700
          shadow-sm
          ring-1
          ring-gray-100
          transition
          hover:bg-black
          hover:text-white
        "
      >
        <Heart size={15} />
      </button>


      {/* Floating Cart Button */}
      <Button
        disabled={product.countInStock === 0}
        onClick={handleAddToCart}
        aria-label="Add to cart"
        className="
          absolute
          bottom-3
          right-3
          !flex
          !h-10
          !w-10
          !min-h-0
          !items-center
          !justify-center
          !rounded-full
          !bg-white
          !p-0
          !text-black
          shadow-lg
          ring-1
          ring-gray-200
          hover:!bg-black
          hover:!text-white
        "
      >
        {wasAdded ? (
          <Check size={16} />
        ) : (
          <ShoppingBag size={16} />
        )}
      </Button>

    </div>



    {/* Product Details */}
    <div className="flex flex-1 flex-col p-4">


      {/* Product Name */}
      <Link
        to={`/products/${product.slug || product._id}`}
        className="
          min-h-[40px]
          line-clamp-2
          text-xs
          font-medium
          leading-5
          text-gray-900
          transition
          hover:text-gray-500
        "
      >
        {product.name}
      </Link>


      {/* Rating */}
      <div
        className="
          mt-2
          flex
          items-center
          gap-1
          text-[11px]
          text-gray-500
        "
      >
        <Star
          size={12}
          fill="currentColor"
          className="text-black"
        />

        <span>
          {product.rating || 0}
        </span>

        <span>
          ({product.numReviews || 0})
        </span>
      </div>



      {/* Price */}
      <div className="mt-3 flex items-center gap-2">

        <span
          className="
            text-base
            font-semibold
            text-black
          "
        >
          ₦{product.price.toLocaleString()}
        </span>


        {product.compareAtPrice > 0 && (
          <span
            className="
              text-xs
              text-gray-400
              line-through
            "
          >
            ₦{product.compareAtPrice.toLocaleString()}
          </span>
        )}

      </div>



      {/* Delivery */}
      <span
        className="
          mt-3
          w-fit
          rounded-full
          bg-gray-100
          px-3
          py-1
          text-[10px]
          font-medium
          text-gray-600
        "
      >
        Free Delivery
      </span>



      {/* Stock */}
      {product.countInStock === 0 && (
        <span
          className="
            mt-2
            text-[10px]
            text-red-500
          "
        >
          Out of stock
        </span>
      )}

    </div>

  </article>
);
};

export default ProductCard;
