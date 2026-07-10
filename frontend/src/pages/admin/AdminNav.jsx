import { NavLink } from "react-router-dom";

// Shared admin navigation keeps dashboard pages easy to move between.
const AdminNav = () => {
  const links = [
    ["Dashboard", "/admin"],
    ["Products", "/admin/products"],
    ["Orders", "/admin/orders"],
    ["Users", "/admin/users"]
  ];

  return (
    <div className="mb-8 flex gap-2 overflow-x-auto rounded-lg bg-white p-2 shadow-soft ring-1 ring-black/5">
      {links.map(([label, path]) => (
        <NavLink key={path} to={path} end className={({ isActive }) => `rounded-full px-4 py-2 text-sm font-bold ${isActive ? "bg-ink text-white" : "text-ink/60 hover:bg-pearl"}`}>
          {label}
        </NavLink>
      ))}
    </div>
  );
};

export default AdminNav;
