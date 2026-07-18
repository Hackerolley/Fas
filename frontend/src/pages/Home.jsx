import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Truck, WalletCards } from "lucide-react";
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { demoProducts } from "../data/demoProducts";

// Home page introduces the brand and highlights featured products.
const Home = () => {
  const featured = demoProducts.filter((product) => product.featured);

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 opacity-55">
          <img
            className="h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1800&q=80"
            alt="Premium fashion editorial"
          />
        </div>
        <div className="relative mx-auto flex min-h-[76vh] max-w-7xl items-end px-4 pb-14 pt-24 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wide text-linen">New season edit</p>
            <h1 className="mt-4 text-5xl font-extrabold tracking-normal sm:text-7xl">Froyal Amity Store</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              Curated fashion, refined accessories, and home pieces designed for calm, beautiful living.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/shop">
                <Button className="bg-[#ffd94a] text-ink shadow-lg shadow-black/25 ring-2 ring-[#ffd94a]/70 hover:bg-[#ffea8a] hover:ring-white">
                  Shop collection <ArrowRight className="ml-2" size={18} />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="ghost" className="text-white ring-1 ring-white/30 hover:bg-white/10">
                  Our story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [Truck, "Fast delivery", "Free delivery over $150"],
            [ShieldCheck, "Quality checked", "Carefully sourced materials"],
            [WalletCards, "Secure checkout", "Ready for your payment provider"]
          ].map(([Icon, title, text]) => (
            <div key={title} className="rounded-lg bg-white p-5 shadow-soft ring-1 ring-black/5">
              <Icon className="text-moss" size={24} />
              <p className="mt-4 font-bold">{title}</p>
              <p className="mt-1 text-sm text-ink/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Featured" title="Quiet luxury, ready to ship" text="Explore customer favorites chosen for texture, utility, and lasting style." />
        <div className="mt-6 grid grid-cols-2 gap-2 sm:mt-10 sm:gap-6 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
