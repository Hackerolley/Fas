import { useEffect, useState } from "react";
import AdminNav from "./AdminNav";
import Button from "../../components/Button";
import CircleLoader from "../../components/CircleLoader";
import api from "../../api/axios";
import { formatNaira } from "../../utils/currency";

const emptyProduct = {
  name: "",
  slug: "",
  brand: "",
  category: "",
  description: "",
  price: "",
  countInStock: "0",
  featured: false
  ,status: "active"
};

// Admin products page lets administrators create products using the protected API.
const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState("");
  const [form, setForm] = useState(emptyProduct);
  const [categories, setCategories] = useState([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [addedProductName, setAddedProductName] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    api.get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setError("Could not load product categories. Refresh and try again."))
      .finally(() => setIsCategoriesLoading(false));
  }, []);

  useEffect(() => {
    api.get("/products/admin/all")
      .then(({ data }) => setProducts(data))
      .catch(() => setProductsError("Could not load products from the database."))
      .finally(() => setIsProductsLoading(false));
  }, []);

  const closeModal = () => {
    if (isSaving) return;
    setIsModalOpen(false);
    setError("");
    setForm(emptyProduct);
    setImageFiles([]);
    setEditingProduct(null);
  };

  const openCreateModal = () => {
    setError("");
    setForm(emptyProduct);
    setImageFiles([]);
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setError("");
    setImageFiles([]);
    setEditingProduct(product);
    setForm({
      name: product.name,
      slug: product.slug || "",
      brand: product.brand,
      category: product.category,
      description: product.description,
      price: String(product.price),
      countInStock: String(product.countInStock),
      featured: Boolean(product.featured),
      status: product.status || "active"
    });
    setIsModalOpen(true);
  };

  const handleChange = ({ target }) => {
    const { name, value, type, checked } = target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSaving(true);

    try {
      if (!editingProduct && !imageFiles.length) {
        setError("Choose at least one product image to upload.");
        return;
      }

      const uploadedImages = await Promise.all(imageFiles.map(async (imageFile) => {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        const { data } = await api.post("/uploads/image", uploadData);
        return { url: data.url, publicId: data.publicId };
      }));

      const payload = {
        ...form,
        slug: form.slug || form.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        price: Number(form.price),
        countInStock: Number(form.countInStock),
        images: uploadedImages.length ? uploadedImages : editingProduct.images
      };

      const { data } = editingProduct
        ? await api.put(`/products/${editingProduct._id}`, payload)
        : await api.post("/products", payload);
      setProducts((current) => editingProduct
        ? current.map((product) => product._id === data._id ? data : product)
        : [data, ...current]);
      setIsModalOpen(false);
      setForm(emptyProduct);
      setImageFiles([]);
      if (!editingProduct) setAddedProductName(data.name);
      setEditingProduct(null);
    } catch (requestError) {
      setError(requestError.response?.data?.message || `Unable to ${editingProduct ? "update" : "add"} the product. Please try again.`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete ${product.name}? This cannot be undone.`)) return;
    setDeletingProductId(product._id);
    setProductsError("");
    try {
      await api.delete(`/products/${product._id}`);
      setProducts((current) => current.filter((item) => item._id !== product._id));
    } catch (requestError) {
      setProductsError(requestError.response?.data?.message || "Unable to delete this product.");
    } finally {
      setDeletingProductId("");
    }
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <AdminNav />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-4xl font-extrabold">Products</h1>
        <Button type="button" onClick={openCreateModal}>Add product</Button>
      </div>
      <div className="thin-scrollbar mt-8 overflow-x-auto rounded-lg bg-white shadow-soft ring-1 ring-black/5">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-pearl text-ink/60">
            <tr><th className="p-4">Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th className="p-4 text-right">Actions</th></tr>
          </thead>
          <tbody>
            {isProductsLoading && <tr><td colSpan="6" className="p-8 text-center"><CircleLoader className="text-clay" label="Loading products" /></td></tr>}
            {!isProductsLoading && productsError && <tr><td colSpan="6" className="p-8 text-center text-red-700">{productsError}</td></tr>}
            {!isProductsLoading && !productsError && products.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-ink/60">No products have been added yet.</td></tr>}
            {!isProductsLoading && products.map((product) => (
              <tr key={product._id} className="border-t border-linen">
                <td className="p-4 font-bold">{product.name}</td>
                <td>{product.category}</td>
                <td>{formatNaira(product.price)}</td>
                <td>{product.countInStock}</td>
                <td><span className={`rounded-full px-3 py-1 text-xs font-bold ${product.status === "archived" ? "bg-red-50 text-red-700" : product.status === "draft" ? "bg-pearl text-ink/60" : "bg-green-50 text-moss"}`}>{product.status || "active"}</span></td>
                <td className="p-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEditModal(product)} className="rounded-full px-3 py-1.5 text-xs font-bold text-ink ring-1 ring-linen hover:bg-pearl">Edit</button><button type="button" disabled={deletingProductId === product._id} onClick={() => handleDelete(product)} className="rounded-full px-3 py-1.5 text-xs font-bold text-red-700 ring-1 ring-red-200 hover:bg-red-50 disabled:opacity-60">{deletingProductId === product._id ? "Deleting…" : "Delete"}</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
          <form onSubmit={handleSubmit} className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div><h2 id="add-product-title" className="text-2xl font-extrabold">{editingProduct ? "Edit product" : "Add product"}</h2><p className="mt-1 text-sm text-ink/60">{editingProduct ? "Update product details or replace its images." : "Create a product for your storefront."}</p></div>
              <button type="button" onClick={closeModal} className="text-2xl leading-none text-ink/60 hover:text-ink" aria-label="Close add product form">&times;</button>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold sm:col-span-2">Name<input required name="name" value={form.name} onChange={handleChange} className="mt-1 w-full rounded-lg border border-linen px-3 py-2 font-normal" /></label>
              <label className="text-sm font-semibold">Brand<input required name="brand" value={form.brand} onChange={handleChange} className="mt-1 w-full rounded-lg border border-linen px-3 py-2 font-normal" /></label>
              <label className="text-sm font-semibold">Category<div className="relative mt-1"><select required disabled={isCategoriesLoading} name="category" value={form.category} onChange={handleChange} className="w-full rounded-lg border border-linen px-3 py-2 font-normal disabled:bg-pearl"><option value="">{isCategoriesLoading ? "Loading categories…" : "Select a category"}</option>{categories.map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}</select>{isCategoriesLoading && <CircleLoader className="pointer-events-none absolute right-3 top-2 text-ink/60" label="Loading categories" />}</div></label>
              <label className="text-sm font-semibold">Price<input required min="0" step="0.01" type="number" name="price" value={form.price} onChange={handleChange} className="mt-1 w-full rounded-lg border border-linen px-3 py-2 font-normal" /></label>
              <label className="text-sm font-semibold">Stock<input required min="0" type="number" name="countInStock" value={form.countInStock} onChange={handleChange} className="mt-1 w-full rounded-lg border border-linen px-3 py-2 font-normal" /></label>
              <label className="text-sm font-semibold sm:col-span-2">{editingProduct ? "Replace product images" : "Product images"}<input required={!editingProduct} multiple type="file" accept="image/*" onChange={(event) => setImageFiles(Array.from(event.target.files || []))} className="mt-1 block w-full text-sm font-normal file:mr-4 file:rounded-full file:border-0 file:bg-pearl file:px-4 file:py-2 file:font-semibold file:text-ink" />{imageFiles.length > 0 ? <span className="mt-1 block font-normal text-ink/60">{imageFiles.length} image{imageFiles.length === 1 ? "" : "s"} selected</span> : editingProduct && <span className="mt-1 block font-normal text-ink/60">Leave empty to keep the current images.</span>}</label>
              <label className="text-sm font-semibold sm:col-span-2">Description<textarea required name="description" value={form.description} onChange={handleChange} rows="3" className="mt-1 w-full rounded-lg border border-linen px-3 py-2 font-normal" /></label>
              <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Feature this product</label>
              <label className="text-sm font-semibold sm:col-span-2">Catalogue status<select name="status" value={form.status} onChange={handleChange} className="mt-1 w-full rounded-lg border border-linen px-3 py-2 font-normal"><option value="active">Active — visible to shoppers</option><option value="draft">Draft — hidden from shoppers</option><option value="archived">Archived — hidden from shoppers</option></select></label>
            </div>
            {error && <p className="mt-4 text-sm font-medium text-red-700" role="alert">{error}</p>}
            <div className="mt-6 flex justify-end gap-3"><Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button><Button type="submit" disabled={isSaving}>{isSaving ? <><CircleLoader className="mr-2" label="Saving product" />Saving product</> : editingProduct ? "Save changes" : "Add product"}</Button></div>
            {isSaving && <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/75" aria-hidden="true"><CircleLoader className="text-clay" label="Adding product" /></div>}
          </form>
        </div>
      )}

      {addedProductName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4" role="dialog" aria-modal="true" aria-labelledby="product-added-title">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-moss text-2xl font-bold text-white">✓</div>
            <h2 id="product-added-title" className="mt-5 text-2xl font-extrabold">Product added successfully</h2>
            <p className="mt-2 text-ink/65"><span className="font-semibold text-ink">{addedProductName}</span> is now in your product catalogue.</p>
            <Button className="mt-6" onClick={() => setAddedProductName("")}>Done</Button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AdminProducts;
