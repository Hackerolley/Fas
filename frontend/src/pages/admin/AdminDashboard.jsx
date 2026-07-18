import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, Wallet } from "lucide-react";
import AdminNav from "./AdminNav";
import StatCard from "../../components/StatCard";
import api from "../../api/axios";
import CircleLoader from "../../components/CircleLoader";

// Admin dashboard displays live operational summaries from database.
const AdminDashboard = () => {

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    products: 0,
    customers: 0
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {

    const fetchDashboardStats = async () => {

      try {

        const { data } = await api.get("/admin/stats");

        setStats(data);

      } catch (error) {

        console.error(
          "Error fetching dashboard stats:",
          error
        );

      } finally {

        setLoading(false);

      }

    };


    fetchDashboardStats();

  }, []);



  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <AdminNav />

        <div className="mt-10 flex justify-center"><CircleLoader className="text-clay" label="Loading dashboard" /></div>
      </section>
    );
  }



  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <AdminNav />

      <div className="flex items-end justify-between gap-4">

        <div>

          <p className="text-sm font-bold uppercase tracking-wide text-clay">
            Admin
          </p>

          <h1 className="text-4xl font-extrabold">
            Dashboard
          </h1>

        </div>

      </div>



      {/* Live Database Statistics */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <StatCard
          label="Revenue"
          value={`₦${stats.revenue.toLocaleString()}`}
          hint="Total sales"
        />


        <StatCard
          label="Orders"
          value={stats.orders}
          hint="Total orders"
        />


        <StatCard
          label="Products"
          value={stats.products}
          hint="Products available"
        />


        <StatCard
          label="Customers"
          value={stats.customers}
          hint="Registered users"
        />

      </div>



      <div className="mt-8 grid gap-6 lg:grid-cols-2">

        {[
          [
            Wallet,
            "Payment setup",
            "Connect Stripe, PayPal, or your preferred gateway inside the order payment route."
          ],

          [
            Package,
            "Inventory",
            "Product schemas already track stock, categories, featured items, reviews, and image metadata."
          ],

          [
            ShoppingCart,
            "Fulfillment",
            "Admin routes can mark orders as delivered and list all customer orders."
          ],

          [
            Users,
            "Access",
            "JWT auth and role-based admin middleware protect dashboard API endpoints."
          ]

        ].map(([Icon, title, text]) => (

          <div
            key={title}
            className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5"
          >

            <Icon className="text-moss" />

            <p className="mt-4 text-xl font-extrabold">
              {title}
            </p>

            <p className="mt-2 text-sm leading-6 text-ink/60">
              {text}
            </p>

          </div>

        ))}

      </div>


    </section>
  );
};


export default AdminDashboard;
