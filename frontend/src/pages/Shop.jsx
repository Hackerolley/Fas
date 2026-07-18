import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import { demoProducts } from "../data/demoProducts";
import PromoCarousel from "../components/PromoCarousel";

// Shop page fetches API products but gracefully falls back to local demo data.
const Shop = () => {
  const [products, setProducts] = useState(demoProducts);
  const [category, setCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data.products || data)).catch(() => setProducts(demoProducts));
  }, []);
  useEffect(() => {
    setCategory(searchParams.get("category") || "All");
    setKeyword(searchParams.get("search") || "");
  }, [searchParams]);
  useEffect(() => { api.get("/advertisements").then(({ data }) => setAdvertisements(data)).catch(() => setAdvertisements([])); }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const searchableText = [product.name, product.brand, product.category].filter(Boolean).join(" ").toLowerCase();
      const matchesKeyword = searchableText.includes(keyword.toLowerCase());
      return matchesCategory && matchesKeyword;
    });
  }, [category, keyword, products]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <PromoCarousel slides={advertisements} />
      <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Shop;
