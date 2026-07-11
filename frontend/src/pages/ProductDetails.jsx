import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import api from "../api/axios";
import Button from "../components/Button";
import CircleLoader from "../components/CircleLoader";
import { useCart } from "../context/CartContext";

// Product details page shows a large image, product content, and cart action.
const ProductDetails = () => {
  const { idOrSlug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setSelectedImage(0);
    setIsLoading(true);
    setError("");
    setProduct(null);
    api.get(`/products/${idOrSlug}`)
      .then(({ data }) => setProduct(data))
      .catch((requestError) => setError(requestError.response?.status === 404 ? "This product could not be found." : "Unable to load this product. Please try again."))
      .finally(() => setIsLoading(false));
  }, [idOrSlug]);

  if (isLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><CircleLoader className="text-clay" label="Loading product" /></div>;
  }

  if (error || !product) {
    return <section className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8"><h1 className="text-3xl font-extrabold">Product unavailable</h1><p className="mt-3 text-ink/65">{error || "This product could not be found."}</p></section>;
  }

  const images = product.images?.length ? product.images : [];

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8">
      <div>
        <div className="overflow-hidden rounded-lg bg-linen shadow-soft">
          {images[selectedImage]?.url ? <img className="h-full min-h-[420px] w-full object-cover" src={images[selectedImage].url} alt={product.name} /> : <div className="flex min-h-[420px] items-center justify-center text-sm font-semibold text-ink/50">No product image available</div>}
        </div>
        {images.length > 1 && <div className="mt-4 flex gap-3 overflow-x-auto pb-1">{images.map((image, index) => <button key={image.publicId || image.url} type="button" onClick={() => setSelectedImage(index)} className={`h-20 w-16 shrink-0 overflow-hidden rounded-md ring-2 ${selectedImage === index ? "ring-clay" : "ring-transparent"}`} aria-label={`View image ${index + 1} of ${product.name}`}><img className="h-full w-full object-cover" src={image.url} alt="" /></button>)}</div>}
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
