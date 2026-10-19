import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./layouts/Navbar";
import Footer from "./layouts/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentVerify from "./pages/PaymentVerify";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOrderDetails from "./pages/admin/AdminOrderDetails";
import AdminBlogs from "./pages/admin/AdminBlogs";
import AdminAdvertisements from "./pages/admin/AdminAdvertisements";
import { RequireAdmin, RequireAuth } from "./components/RouteGuards";

// App defines all public and admin routes in one easy-to-scan place.
const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return <div className="flex min-h-screen flex-col bg-pearl text-ink">
    <Navbar />
    <main className="flex-1">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:idOrSlug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
        <Route path="/payment/verify" element={<RequireAuth><PaymentVerify /></RequireAuth>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<RequireAuth><Account /></RequireAuth>} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="/admin/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
        <Route path="/admin/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
        <Route path="/admin/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
        <Route path="/admin/orders/:id" element={<RequireAdmin><AdminOrderDetails /></RequireAdmin>}
/>
        <Route path="/admin/blogs" element={<RequireAdmin><AdminBlogs /></RequireAdmin>} />
        <Route path="/admin/advertisements" element={<RequireAdmin><AdminAdvertisements /></RequireAdmin>} />
        <Route path="*" element={<section className="mx-auto max-w-7xl px-4 py-20"><h1 className="text-4xl font-extrabold">Page not found</h1><p className="mt-3 text-ink/60">The page you requested does not exist.</p></section>} />
      </Routes>
    </main>
    {!isAdminRoute && <Footer />}
  </div>;
};

export default App;
