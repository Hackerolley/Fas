import AdminNav from "./AdminNav";

// Admin orders page displays a responsive fulfillment table.
const AdminOrders = () => {
  const orders = [
    ["LC-1042", "Amara Stone", "$248.00", "Paid", "Processing"],
    ["LC-1041", "Milan Cross", "$476.00", "Paid", "Shipped"],
    ["LC-1040", "June Carter", "$86.00", "Pending", "Processing"]
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AdminNav />
      <h1 className="text-4xl font-extrabold">Orders</h1>
      <div className="thin-scrollbar mt-8 overflow-x-auto rounded-lg bg-white shadow-soft ring-1 ring-black/5">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-pearl text-ink/60">
            <tr><th className="p-4">Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Fulfillment</th></tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order[0]} className="border-t border-linen">
                {order.map((cell) => <td key={cell} className="p-4">{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AdminOrders;
