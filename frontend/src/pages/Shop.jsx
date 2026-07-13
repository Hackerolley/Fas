import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { demoProducts } from "../data/demoProducts";

// Shop page fetches API products but gracefully falls back to local demo data.
const Shop = () => {
  const [products, setProducts] = useState(demoProducts);
  const [category, setCategory] = useState("All");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    api.get("/products").then(({ data }) => setProducts(data.products || data)).catch(() => setProducts(demoProducts));
  }, []);

  const categories = ["All", ...new Set(products.map((product) => product.category))];
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = category === "All" || product.category === category;
      const matchesKeyword = product.name.toLowerCase().includes(keyword.toLowerCase());
      return matchesCategory && matchesKeyword;
    });
  }, [category, keyword, products]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeader eyebrow="Catalog" title="Shop the full edit" text="Search, filter, and add pieces to your cart from a responsive product grid." />
      <div className="mt-10 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-soft ring-1 ring-black/5 md:flex-row md:items-center md:justify-between">
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          className="min-h-11 rounded-full border border-linen px-4 text-sm outline-none focus:border-clay"
          placeholder="Search products"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => setCategory(item)}
              className={`min-h-10 rounded-full px-4 text-sm font-semibold ${category === item ? "bg-ink text-white" : "bg-pearl text-ink hover:bg-linen"}`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-8 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
        {filteredProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Shop;
