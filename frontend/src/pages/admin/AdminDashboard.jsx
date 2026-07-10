import { Package, ShoppingCart, Users, Wallet } from "lucide-react";
import AdminNav from "./AdminNav";
import StatCard from "../../components/StatCard";

// Admin dashboard shows operational summaries and quick context.
const AdminDashboard = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <AdminNav />
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-bold uppercase tracking-wide text-clay">Admin</p>
        <h1 className="text-4xl font-extrabold">Dashboard</h1>
      </div>
    </div>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard label="Revenue" value="$18.4k" hint="+12% this month" />
      <StatCard label="Orders" value="326" hint="42 processing" />
      <StatCard label="Products" value="84" hint="9 low stock" />
      <StatCard label="Customers" value="1.2k" hint="88 new" />
    </div>
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      {[
        [Wallet, "Payment setup", "Connect Stripe, PayPal, or your preferred gateway inside the order payment route."],
        [Package, "Inventory", "Product schemas already track stock, categories, featured items, reviews, and image metadata."],
        [ShoppingCart, "Fulfillment", "Admin routes can mark orders as delivered and list all customer orders."],
        [Users, "Access", "JWT auth and role-based admin middleware protect dashboard API endpoints."]
      ].map(([Icon, title, text]) => (
        <div key={title} className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
          <Icon className="text-moss" />
          <p className="mt-4 text-xl font-extrabold">{title}</p>
          <p className="mt-2 text-sm leading-6 text-ink/60">{text}</p>
        </div>
      ))}
    </div>
  </section>
);

export default AdminDashboard;
