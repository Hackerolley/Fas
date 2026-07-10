import AdminNav from "./AdminNav";
import Button from "../../components/Button";
import { demoProducts } from "../../data/demoProducts";

// Admin products page previews catalog management tables.
const AdminProducts = () => (
  <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <AdminNav />
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h1 className="text-4xl font-extrabold">Products</h1>
      <Button>Add product</Button>
    </div>
    <div className="thin-scrollbar mt-8 overflow-x-auto rounded-lg bg-white shadow-soft ring-1 ring-black/5">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="bg-pearl text-ink/60">
          <tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th></tr>
        </thead>
        <tbody>
          {demoProducts.map((product) => (
            <tr key={product._id} className="border-t border-linen">
              <td className="p-4 font-bold">{product.name}</td>
              <td>{product.category}</td>
              <td>${product.price}</td>
              <td>{product.countInStock}</td>
              <td><span className="rounded-full bg-pearl px-3 py-1 text-xs font-bold text-moss">{product.featured ? "Featured" : "Active"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default AdminProducts;
