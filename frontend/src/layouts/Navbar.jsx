import { Link, NavLink, useNavigate } from "react-router-dom";
import { ChevronDown, Grid2X2, LogOut, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// Navbar is responsive and exposes customer and admin navigation.
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { totals } = useCart();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;
  const links = useMemo(() => {
    const baseLinks = [
      ["Shop", "/shop"],
      ["About", "/about"],
      ["Blog", "/blog"],
      ["Home", "/"]
    ];
    return isAdmin ? [...baseLinks.slice(0, 3), ["Admin", "/admin"], baseLinks[3]] : baseLinks;
  }, [isAdmin]);
  useEffect(() => { api.get("/categories").then(({ data }) => setCategories(data)).catch(() => setCategories([])); }, []);
  const closeMenus = () => { setOpen(false); setCategoriesOpen(false); setProfileOpen(false); setSearchOpen(false); };
  const submitSearch = (event) => {
    event.preventDefault();
    const query = searchQuery.trim();
    navigate(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-pearl/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-normal text-ink">
          Froyal Amity Store
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <div className="relative" onMouseEnter={() => setCategoriesOpen(true)} onMouseLeave={() => setCategoriesOpen(false)}><button onClick={() => setCategoriesOpen((value) => !value)} onFocus={() => setCategoriesOpen(true)} aria-expanded={categoriesOpen} className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-ink/75 transition hover:bg-[#fff4cc] hover:text-ink">Categories <ChevronDown size={15} className={`transition ${categoriesOpen ? "rotate-180" : ""}`} /></button>{categoriesOpen && <div className="absolute left-0 top-11 z-50 w-[440px] rounded-2xl border border-ink/10 bg-white p-3 shadow-soft"><div className="mb-2 flex items-center gap-2 border-b border-ink/10 px-2 pb-3"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#fff4cc] text-[#9b7400]"><Grid2X2 size={16} /></span><div><p className="text-sm font-extrabold">Shop by category</p><p className="text-xs text-ink/55">Find exactly what you need</p></div></div><div className="grid grid-cols-2 gap-1">{categories.map((item) => <Link key={item._id} to={`/shop?category=${encodeURIComponent(item.name)}`} onClick={closeMenus} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-ink/70 transition hover:bg-[#fff4cc] hover:text-ink">{item.name}</Link>)}</div></div>}</div>
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `text-sm font-semibold ${isActive ? "text-clay" : "text-ink/70 hover:text-ink"}`}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => { setSearchOpen((value) => !value); setProfileOpen(false); }} className="rounded-full p-2 hover:bg-linen" aria-label="Search products" aria-expanded={searchOpen}>
            <Search size={20} />
          </button>
          <div className="relative"><button onClick={() => user ? setProfileOpen((value) => !value) : undefined} className="rounded-full p-2 hover:bg-linen" aria-label="Account"><UserRound size={20} /></button>{!user && <Link to="/login" className="absolute inset-0" aria-label="Sign in" />}{user && profileOpen && <div className="absolute right-0 top-11 z-50 w-52 rounded-xl border border-ink/10 bg-white p-2 shadow-soft"><Link to="/account" onClick={closeMenus} className="block rounded-lg px-3 py-2 text-sm font-bold hover:bg-pearl">My account</Link><button onClick={() => { logout(); closeMenus(); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-bold text-red-700 hover:bg-red-50"><LogOut size={16} /> Log out</button></div>}</div>
          <Link to="/cart" className="relative rounded-full p-2 hover:bg-linen" aria-label="Cart">
            <ShoppingBag size={20} />
            {totals.count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-clay px-1.5 text-xs font-bold text-white">{totals.count}</span>}
          </Link>
          <button onClick={() => setOpen(!open)} className="rounded-full p-2 hover:bg-linen md:hidden" aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {searchOpen && <div className="border-t border-ink/10 bg-white/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8"><form onSubmit={submitSearch} className="mx-auto flex max-w-7xl gap-2"><input autoFocus value={searchQuery} onChange={(event) => { const query = event.target.value; setSearchQuery(query); navigate(query.trim() ? `/shop?search=${encodeURIComponent(query)}` : "/shop"); }} placeholder="Search products…" aria-label="Search products" className="min-h-11 min-w-0 flex-1 rounded-full border border-linen bg-white px-4 text-sm outline-none focus:border-[#b77900]" /><button type="submit" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-bold text-white hover:bg-[#b77900]"><Search size={17} /> Search</button></form></div>}
      {open && (
        <div className="border-t border-ink/10 px-4 py-3 md:hidden">
          <div className="rounded-xl border border-ink/10 bg-white p-1">
            <button onClick={() => setCategoriesOpen((value) => !value)} aria-expanded={categoriesOpen} className="flex w-full items-center justify-between rounded-lg px-3 py-3 text-sm font-extrabold text-ink transition hover:bg-[#fff4cc]"> <span className="flex items-center gap-2"><Grid2X2 size={17} className="text-[#9b7400]" /> Categories</span><ChevronDown size={17} className={`transition ${categoriesOpen ? "rotate-180" : ""}`} /></button>
            {categoriesOpen && <div className="border-t border-ink/10 px-2 pb-2 pt-3"><p className="mb-2 px-1 text-xs font-bold uppercase tracking-wide text-ink/45">Shop by category</p><div className="grid grid-cols-2 gap-1">{categories.map((item) => <Link key={item._id} to={`/shop?category=${encodeURIComponent(item.name)}`} onClick={closeMenus} className="rounded-lg px-3 py-3 text-xs font-bold text-ink/70 transition hover:bg-[#fff4cc] hover:text-ink">{item.name}</Link>)}</div></div>}
          </div>
          {links.map(([label, path]) => (
            <Link key={path} to={path} onClick={closeMenus} className="block rounded-lg px-3 py-3 text-sm font-semibold hover:bg-linen">
              {label}
            </Link>
          ))}
          {user && <button onClick={() => { logout(); closeMenus(); }} className="mt-1 flex w-full items-center gap-2 rounded-lg bg-[#fff4cc] px-3 py-3 text-left text-sm font-bold text-ink"><LogOut size={16} /> Log out</button>}
        </div>
      )}
    </header>
  );
};

export default Navbar;
