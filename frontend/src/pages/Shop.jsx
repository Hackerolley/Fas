import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import PromoCarousel from "../components/PromoCarousel";

// Shop catalogue is always sourced from the API; outages are visible rather than masked with fake stock.
const Shop = () => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const [advertisements, setAdvertisements] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: "24" });
    const category = searchParams.get("category");
    const keyword = searchParams.get("search");
    if (category) params.set("category", category);
    if (keyword) params.set("keyword", keyword);
    setLoading(true); setError("");
    api.get(`/products?${params}`, { signal: controller.signal })
      .then(({ data }) => setProducts(data.products || []))
      .catch((requestError) => { if (requestError.code !== "ERR_CANCELED") setError("We could not load the catalogue. Please refresh and try again."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [searchParams]);
  useEffect(() => { api.get("/advertisements").then(({ data }) => setAdvertisements(data)).catch(() => setAdvertisements([])); }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PromoCarousel slides={advertisements} />
      <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {loading && <p className="col-span-full py-12 text-center text-ink/60">Loading catalogue…</p>}
        {error && <p role="alert" className="col-span-full rounded-xl bg-red-50 p-4 text-center text-red-700">{error}</p>}
        {!loading && !error && products.length === 0 && <p className="col-span-full py-12 text-center text-ink/60">No products match your search.</p>}
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Shop;
