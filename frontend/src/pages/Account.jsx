import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const emptyAddress = { fullName: "", address: "", city: "", postalCode: "", country: "", phone: "" };
const money = (value) => `$${Number(value || 0).toFixed(2)}`;

// Customer hub for profile, saved delivery details, notification consent, and orders.
const Account = () => {
  const { user, persistUser } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || "", email: user?.email || "", currentPassword: "", password: "", shippingAddress: user?.shippingAddress || emptyAddress, notificationPreferences: user?.notificationPreferences || { email: true, whatsapp: false, whatsappNumber: "" } });
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    api.get("/orders/mine").then(({ data }) => setOrders(data)).catch(() => setMessage("We could not load your orders. Please try again."));
  }, [user]);

  if (!user) return <section className="mx-auto max-w-xl px-4 py-16 text-center"><h1 className="text-3xl font-medium">Your account</h1><p className="mt-3 text-ink/60">Sign in to manage your profile and orders.</p><Link to="/login"><Button className="mt-6">Sign in</Button></Link></section>;

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setMessage("");
    try {
      const payload = { ...profile }; if (!payload.password) delete payload.password;
      const { data } = await api.put("/auth/profile", payload);
      persistUser(data); setProfile((current) => ({ ...current, currentPassword: "", password: "" })); setMessage("Your account details have been saved.");
    } catch (error) { setMessage(error.response?.data?.message || "Could not save your changes."); }
    finally { setSaving(false); }
  };
  const input = "mt-1.5 min-h-11 w-full rounded-xl border border-linen bg-white px-3 text-sm outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/10";

  return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="mb-8"><p className="text-xs font-medium uppercase tracking-[0.18em] text-clay">Account</p><h1 className="mt-2 text-3xl font-medium">Hello, {user.name.split(" ")[0]}</h1></div><div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_0.85fr]"><form onSubmit={save} className="space-y-6 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5 sm:p-7"><div><h2 className="text-xl font-medium">Profile & delivery</h2><p className="mt-1 text-sm text-ink/55">Keep these details ready for a faster checkout.</p></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm text-ink/70">Full name<input required className={input} value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label><label className="text-sm text-ink/70">Email<input required type="email" className={input} value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></label></div><div className="border-t border-linen pt-6"><h3 className="font-medium">Shipping address</h3><div className="mt-4 grid gap-4 sm:grid-cols-2">{Object.entries(profile.shippingAddress).map(([key, value]) => <label key={key} className={`text-sm capitalize text-ink/70 ${key === "address" ? "sm:col-span-2" : ""}`}>{key.replace(/([A-Z])/g, " $1")}<input className={input} value={value} onChange={(e) => setProfile({ ...profile, shippingAddress: { ...profile.shippingAddress, [key]: e.target.value } })} /></label>)}</div></div><div className="border-t border-linen pt-6"><h3 className="font-medium">Change password</h3><div className="mt-3 grid gap-4 sm:grid-cols-2"><label className="text-sm text-ink/70">Current password<input type="password" className={input} value={profile.currentPassword} onChange={(e) => setProfile({ ...profile, currentPassword: e.target.value })} /></label><label className="text-sm text-ink/70">New password<input minLength="6" type="password" className={input} value={profile.password} onChange={(e) => setProfile({ ...profile, password: e.target.value })} /></label></div></div><div className="border-t border-linen pt-6"><h3 className="font-medium">Order notifications</h3><div className="mt-3 space-y-3 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={profile.notificationPreferences.email} onChange={(e) => setProfile({ ...profile, notificationPreferences: { ...profile.notificationPreferences, email: e.target.checked } })} /> Email updates</label><label className="flex items-center gap-2"><input type="checkbox" checked={profile.notificationPreferences.whatsapp} onChange={(e) => setProfile({ ...profile, notificationPreferences: { ...profile.notificationPreferences, whatsapp: e.target.checked } })} /> WhatsApp updates</label>{profile.notificationPreferences.whatsapp && <input placeholder="WhatsApp number with country code, e.g. 234..." className={input} value={profile.notificationPreferences.whatsappNumber} onChange={(e) => setProfile({ ...profile, notificationPreferences: { ...profile.notificationPreferences, whatsappNumber: e.target.value } })} />}</div></div><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>{message && <p className="text-sm text-moss">{message}</p>}</form><aside className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-black/5 sm:p-7"><h2 className="text-xl font-medium">Order history</h2><div className="mt-5 space-y-3">{orders.length === 0 ? <p className="rounded-xl bg-pearl p-4 text-sm text-ink/60">You have not placed an order yet.</p> : orders.map((order) => <div key={order._id} className="rounded-xl border border-linen p-4"><div className="flex items-start justify-between gap-3"><div><p className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</p><p className="mt-1 text-xs text-ink/55">{new Date(order.createdAt).toLocaleDateString()}</p></div><span className="rounded-full bg-pearl px-2.5 py-1 text-xs capitalize text-moss">{order.status}</span></div><div className="mt-3 flex justify-between text-sm"><span>{order.orderItems.reduce((sum, item) => sum + item.qty, 0)} items</span><span className="font-medium">{money(order.totalPrice)}</span></div></div>)}</div></aside></div></section>;
};
export default Account;
