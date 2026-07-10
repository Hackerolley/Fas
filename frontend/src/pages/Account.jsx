import { Link } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

// Account page gives customers a simple profile and order status area.
const Account = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="mx-auto max-w-xl px-4 py-12 text-center sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold">Account</h1>
        <p className="mt-4 text-ink/60">Login to view your profile and orders.</p>
        <Link to="/login"><Button className="mt-6">Login</Button></Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Your account</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-bold uppercase tracking-wide text-clay">Profile</p>
          <p className="mt-4 text-2xl font-extrabold">{user.name}</p>
          <p className="mt-1 text-ink/60">{user.email}</p>
          <p className="mt-4 rounded-full bg-pearl px-3 py-2 text-sm font-bold text-moss">{user.role}</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
          <p className="text-sm font-bold uppercase tracking-wide text-clay">Orders</p>
          <p className="mt-4 text-ink/60">Order history is ready to connect to `/api/orders/mine` once your MongoDB key is added.</p>
        </div>
      </div>
    </section>
  );
};

export default Account;
