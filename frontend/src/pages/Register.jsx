import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

// Register page creates a customer account through the backend.
const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    try {
      await register(form.name, form.email, form.password);
      navigate("/account");
    } catch {
      setError("Registration failed. Confirm the backend is running and the email is unused.");
    }
  };

  return (
    <section className="mx-auto max-w-md px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold">Create account</h1>
      <form onSubmit={submit} className="mt-8 space-y-4 rounded-lg bg-white p-6 shadow-soft ring-1 ring-black/5">
        <input className="min-h-11 w-full rounded-lg border border-linen px-3 outline-none focus:border-clay" placeholder="Full name" onChange={(event) => setForm({ ...form, name: event.target.value })} />
        <input className="min-h-11 w-full rounded-lg border border-linen px-3 outline-none focus:border-clay" placeholder="Email" type="email" onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input className="min-h-11 w-full rounded-lg border border-linen px-3 outline-none focus:border-clay" placeholder="Password" type="password" onChange={(event) => setForm({ ...form, password: event.target.value })} />
        <Button type="submit" className="w-full">Register</Button>
        {error && <p className="text-sm font-semibold text-clay">{error}</p>}
        <p className="text-sm text-ink/60">Already joined? <Link className="font-bold text-ink" to="/login">Login</Link></p>
      </form>
    </section>
  );
};

export default Register;
