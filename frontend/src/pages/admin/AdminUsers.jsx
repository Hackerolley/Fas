import AdminNav from "./AdminNav";

// Admin users page previews role and customer management.
const AdminUsers = () => {
  const users = [
    ["Ava Monroe", "ava@example.com", "admin"],
    ["Noah Reed", "noah@example.com", "customer"],
    ["Lina Park", "lina@example.com", "customer"]
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AdminNav />
      <h1 className="text-4xl font-extrabold">Users</h1>
      <div className="thin-scrollbar mt-8 overflow-x-auto rounded-lg bg-white shadow-soft ring-1 ring-black/5">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-pearl text-ink/60">
            <tr><th className="p-4">Name</th><th>Email</th><th>Role</th></tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user[1]} className="border-t border-linen">
                <td className="p-4 font-bold">{user[0]}</td>
                <td>{user[1]}</td>
                <td><span className="rounded-full bg-pearl px-3 py-1 text-xs font-bold text-moss">{user[2]}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminUsers;
