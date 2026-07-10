import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import api from "../api/axios";
import Button from "../components/Button";
import { demoProducts } from "../data/demoProducts";
import { useCart } from "../context/CartContext";

// Product details page shows a large image, product content, and cart action.
const ProductDetails = () => {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(() => demoProducts.find((item) => item.slug === idOrSlug || item._id === idOrSlug) || demoProducts[0]);

  useEffect(() => {
    api.get(`/products/${idOrSlug}`).then(({ data }) => setProduct(data)).catch(() => {});
  }, [idOrSlug]);

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div className="overflow-hidden rounded-lg bg-linen shadow-soft">
        <img className="h-full min-h-[420px] w-full object-cover" src={product.images?.[0]?.url} alt={product.name} />
      </div>
      <div className="flex flex-col justify-center">
        <p className="text-sm font-bold uppercase tracking-wide text-clay">{product.brand}</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-normal sm:text-5xl">{product.name}</h1>
        <div className="mt-4 flex items-center gap-2 text-moss">
          <Star size={18} fill="currentColor" />
          <span className="font-bold">{product.rating}</span>
          <span className="text-ink/50">({product.numReviews} reviews)</span>
        </div>
        <p className="mt-6 text-lg leading-8 text-ink/70">{product.description}</p>
        <div className="mt-8 flex items-end gap-3">
          <span className="text-4xl font-extrabold">${product.price}</span>
          {product.compareAtPrice > 0 && <span className="pb-1 text-lg text-ink/40 line-through">${product.compareAtPrice}</span>}
        </div>
        <p className="mt-3 text-sm font-semibold text-moss">{product.countInStock > 0 ? `${product.countInStock} in stock` : "Out of stock"}</p>
        <Button disabled={product.countInStock === 0} onClick={() => addToCart(product)} className="mt-8 w-full sm:w-auto">
          Add to cart
        </Button>
      </div>
    </section>
  );
};

export default ProductDetails;
