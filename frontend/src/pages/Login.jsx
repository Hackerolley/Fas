import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

// Login page signs users into the backend and stores the JWT.
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/account");
    } catch {
      setError("Login failed. Check your email, password, and backend connection.");
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Welcome back</h1>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        <input className="min-h-11 w-full rounded-lg border border-linen px-3 outline-none focus:border-clay" placeholder="Email" type="email" onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="min-h-11 w-full rounded-lg border border-linen px-3 outline-none focus:border-clay" placeholder="Password" type="password" onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button type="submit" className="w-full">Login</Button>
        {error && <p className="text-sm font-semibold text-clay">{error}</p>}
        <p className="text-sm text-ink/60">No account? <Link className="font-bold text-ink" to="/register">Create one</Link></p>
      </form>
    </section>
  );
};

export default Login;
