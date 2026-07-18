import { ArrowRight, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import CircleLoader from "../components/CircleLoader";
import { useAuth } from "../context/AuthContext";

// Login page gives returning customers a clear, polished sign-in experience.
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const input = "mt-2 min-h-12 w-full rounded-xl border border-linen bg-white px-4 text-sm outline-none transition placeholder:text-ink/35 focus:border-[#b77900] focus:ring-4 focus:ring-[#ffd94a]/20";

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    try { await login(form.email, form.password); navigate("/account"); }
    catch { setError("We could not sign you in. Check your email and password, then try again."); }
    finally { setSaving(false); }
  };

  return <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-5xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
    <aside className="hidden rounded-3xl bg-ink p-10 text-white shadow-soft lg:block"><p className="text-xs font-extrabold uppercase tracking-[0.22em] text-[#ffd94a]">Froyal Amity Store</p><h1 className="mt-5 text-5xl font-extrabold leading-tight">Good to see you again.</h1><p className="mt-5 max-w-sm leading-7 text-white/70">Sign in to keep your favourite finds, delivery details and order updates together.</p><div className="mt-12 flex items-center gap-3 text-sm font-semibold text-white/80"><span className="grid h-10 w-10 place-items-center rounded-full bg-[#ffd94a] text-ink"><ShieldCheck size={19} /></span> Secure account access</div></aside>
    <div className="rounded-3xl bg-white p-6 shadow-soft ring-1 ring-black/5 sm:p-10"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#9b7400]">Welcome back</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Sign in to your account</h2><p className="mt-3 text-sm leading-6 text-ink/60">Enter your details to continue shopping and manage your orders.</p><form onSubmit={submit} className="mt-8 space-y-5"><label className="block text-sm font-bold text-ink/75">Email address<div className="relative"><Mail size={17} className="pointer-events-none absolute left-4 top-5 text-ink/40" /><input required value={form.email} className={`${input} pl-11`} placeholder="you@example.com" type="email" autoComplete="email" onChange={(event) => setForm({ ...form, email: event.target.value })} /></div></label><label className="block text-sm font-bold text-ink/75">Password<div className="relative"><LockKeyhole size={17} className="pointer-events-none absolute left-4 top-5 text-ink/40" /><input required value={form.password} className={`${input} pl-11`} placeholder="Enter your password" type="password" autoComplete="current-password" onChange={(event) => setForm({ ...form, password: event.target.value })} /></div></label>{error && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}<Button type="submit" disabled={saving} className="w-full !bg-ink hover:!bg-[#b77900]">{saving ? <><CircleLoader className="mr-2" label="Signing in" />Signing in…</> : <>Sign in <ArrowRight size={17} /></>}</Button></form><p className="mt-7 text-center text-sm text-ink/60">New to Froyal Amity? <Link className="font-extrabold text-[#9b7400] hover:text-ink" to="/register">Create an account</Link></p></div>
  </section>;
};
export default Login;
