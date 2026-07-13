import { Link, NavLink } from "react-router-dom";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

// Navbar is responsive and exposes customer and admin navigation.
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { totals } = useCart();
  const { user, logout } = useAuth();
  const links = [
    ["Shop", "/shop"],
    ["About", "/about"],
    ["Blog", "/blog"],
    ["Admin", "/admin"],
    ["Home", "/"]
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-pearl/90 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-extrabold tracking-normal text-ink">
          Froyal Amity Store
        </Link>
        <div className="hidden items-center gap-7 md:flex">
          {links.map(([label, path]) => (
            <NavLink key={path} to={path} className={({ isActive }) => `text-sm font-semibold ${isActive ? "text-clay" : "text-ink/70 hover:text-ink"}`}>
              {label}
            </NavLink>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link to="/shop" className="rounded-full p-2 hover:bg-linen" aria-label="Search products">
            <Search size={20} />
          </Link>
          <Link to={user ? "/account" : "/login"} className="rounded-full p-2 hover:bg-linen" aria-label="Account">
            <UserRound size={20} />
          </Link>
          <Link to="/cart" className="relative rounded-full p-2 hover:bg-linen" aria-label="Cart">
            <ShoppingBag size={20} />
            {totals.count > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-clay px-1.5 text-xs font-bold text-white">{totals.count}</span>}
          </Link>
          {user && (
            <button onClick={logout} className="hidden rounded-full px-3 py-2 text-sm font-semibold text-ink/65 hover:bg-linen sm:block">
              Logout
            </button>
          )}
          <button onClick={() => setOpen(!open)} className="rounded-full p-2 hover:bg-linen md:hidden" aria-label="Toggle menu">
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>
      {open && (
        <div className="border-t border-ink/10 px-4 py-3 md:hidden">
          {links.map(([label, path]) => (
            <Link key={path} to={path} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold hover:bg-linen">
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
