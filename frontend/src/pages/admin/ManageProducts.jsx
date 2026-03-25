import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Pencil, Search } from "lucide-react";
import Swal from "sweetalert2";
import Loader from "../../components/common/Loader";
import api from "../../utils/api";
import { getImageUrl } from "../../utils/media";

const categories = [
  "Imitation Jewellery",
  "Bridal Jewellery for Rent",
  "Bridal Bangles",
  "Fancy Products",
  "Boutique Dresses",
  "Handbags",
  "Footwear",
  "Scarves",
  "Fashion Accessories",
  "Toys",
  "Gifts",
  "Hair Accessories",
  "Impon Jewellery",
  "Golden Covering Jewellery",
];

const emptyForm = {
  name: "",
  price: "",
  salePrice: "",
  description: "",
  category: categories[0],
  image: null,
  model3d: null,
  arType: "None",
  arImage: null,
  stock: "",
};

const editableFields = [
  "name",
  "price",
  "salePrice",
  "description",
  "category",
  "image",
  "model3d",
  "arType",
  "arImage",
  "stock",
];

const normalizeArType = (value) => {
  if (!value || value === "None") {
    return "None";
  }

  const normalized = String(value).toLowerCase();
  if (normalized === "earring" || normalized === "chain") {
    return normalized;
  }

  return "None";
};

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);
  const perPage = 6;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/products", { params: { limit: 100 } });
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleImageChange = (e) => setForm({ ...form, image: e.target.files[0] });
  const handleModel3dChange = (e) => setForm({ ...form, model3d: e.target.files[0] });
  const handleArImageChange = (e) => setForm({ ...form, arImage: e.target.files[0] });

  const buildFormData = (source) => {
    const formData = new FormData();
    editableFields.forEach((key) => {
      const value = source[key];
      if (value !== null && value !== "" && value !== undefined) {
        formData.append(key, value);
      }
    });
    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/products/add", buildFormData(form));
      Swal.fire({ icon: "success", title: "Success", text: "Product Added Successfully", confirmButtonColor: "#B76E79" });
      setForm(emptyForm);
      await fetchProducts();
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: error.response?.data?.message || "Error adding product", confirmButtonColor: "#B76E79" });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this product?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#B76E79",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    });

    if (result.isConfirmed) {
      await api.delete(`/products/${id}`);
      fetchProducts();
    }
  };

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const paginated = filtered.slice((page - 1) * perPage, page * perPage);
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));

  const openEditModal = (product) => {
    setEditingProduct({
      ...product,
      existingModel3d: product.model3d || "",
      arType: normalizeArType(product.arType),
      image: null,
      model3d: null,
      arImage: null,
    });
  };

  const updateEditing = (event) => {
    const { name, value, files } = event.target;
    setEditingProduct((current) => ({ ...current, [name]: files ? files[0] : value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSavingEdit(true);
    try {
      await api.post(`/products/${editingProduct._id}/update`, buildFormData(editingProduct));
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Product updated successfully",
        confirmButtonColor: "#B76E79",
      });
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Error updating product",
        confirmButtonColor: "#B76E79",
      });
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div className="manage-products animate-fade-in">
      <h2 className="page-title mb-lg">Manage Products</h2>

      <div className="content-grid">
        <div className="form-card">
          <div className="card-header border-bottom mb-md pb-sm"><h3>Add New Product</h3></div>
          <form onSubmit={handleSubmit} className="product-form">
            <div className="form-group"><label className="form-label">Product Name</label><input className="form-input" type="text" name="name" value={form.name} onChange={handleChange} required /></div>
            <div className="form-group"><label className="form-label">Upload Image</label><div className="input-with-icon"><ImageIcon className="icon" size={18} /><input className="form-input indent" type="file" name="image" accept="image/*" onChange={handleImageChange} required /></div></div>
            <div className="form-group"><label className="form-label">Upload 3D GLB Model (optional)</label><div className="input-with-icon"><ImageIcon className="icon" size={18} /><input className="form-input indent" type="file" name="model3d" accept=".glb,model/gltf-binary" onChange={handleModel3dChange} /></div></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Price</label><input className="form-input" type="number" name="price" value={form.price} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">Sale Price</label><input className="form-input" type="number" name="salePrice" value={form.salePrice} onChange={handleChange} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Stock</label><input className="form-input" type="number" name="stock" value={form.stock} onChange={handleChange} required /></div>
              <div className="form-group"><label className="form-label">AR Type</label><select className="form-input" name="arType" value={form.arType} onChange={handleChange}><option value="None">None</option><option value="earring">Earring</option><option value="chain">Chain</option></select></div>
            </div>
            <div className="form-group"><label className="form-label">Upload AR PNG</label><div className="input-with-icon"><ImageIcon className="icon" size={18} /><input className="form-input indent" type="file" name="arImage" accept="image/png" onChange={handleArImageChange} /></div></div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" name="description" value={form.description} onChange={handleChange} required rows="3" /></div>
            <div className="form-group"><label className="form-label">Category</label><select className="form-input" name="category" value={form.category} onChange={handleChange}>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select></div>
            <button type="submit" className="btn btn-primary full-width mt-md"><Plus size={18} /><span>Add Product</span></button>
          </form>
        </div>

        <div className="list-container">
          <div className="toolbar card mb-md">
            <div className="search-box"><Search size={16} /><input className="form-input" placeholder="Search product" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
            <select className="form-input" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
              <option value="All">All Categories</option>
              {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="table-card">
            {loading ? <Loader text="Loading inventory..." /> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Created Date</th>
                    <th className="action-column">Edit</th>
                    <th className="action-column">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product) => (
                    <tr key={product._id}>
                      <td><img className="table-image" src={getImageUrl(product.image)} alt={product.name} /></td>
                      <td>{product.name}</td>
                      <td>Rs.{product.salePrice || product.price}</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td className="action-cell"><button className="icon-action" onClick={() => openEditModal(product)}><Pencil size={16} /></button></td>
                      <td className="action-cell"><button className="icon-action delete" onClick={() => handleDelete(product._id)}><Trash2 size={16} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="pagination">
            <button className="btn btn-outline" disabled={page === 1} onClick={() => setPage((current) => current - 1)}>Prev</button>
            <span>Page {page} of {pages}</span>
            <button className="btn btn-outline" disabled={page === pages} onClick={() => setPage((current) => current + 1)}>Next</button>
          </div>
        </div>
      </div>

      {editingProduct ? (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3 className="mb-md">Edit Product</h3>
            <form onSubmit={handleUpdate} className="product-form">
              <input className="form-input" name="name" value={editingProduct.name} onChange={updateEditing} />
              <textarea className="form-input" name="description" value={editingProduct.description} onChange={updateEditing} rows="3" />
              <div className="form-row">
                <input className="form-input" type="number" name="price" value={editingProduct.price} onChange={updateEditing} />
                <input className="form-input" type="number" name="salePrice" value={editingProduct.salePrice || ""} onChange={updateEditing} />
              </div>
              <div className="form-row">
                <input className="form-input" type="number" name="stock" value={editingProduct.stock} onChange={updateEditing} />
                <select className="form-input" name="category" value={editingProduct.category} onChange={updateEditing}>{categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}</select>
              </div>
              <div className="form-row">
                <select className="form-input" name="arType" value={editingProduct.arType || "None"} onChange={updateEditing}>
                  <option value="None">None</option>
                  <option value="earring">Earring</option>
                  <option value="chain">Chain</option>
                </select>
                <input className="form-input" type="file" name="arImage" accept="image/png" onChange={updateEditing} />
              </div>
              <div className="form-group">
                <label className="form-label">3D GLB Model</label>
                {editingProduct.existingModel3d ? (
                  <div className="current-model-note">
                    Current 3D model available. Customers can use the 3D view on the product page.
                  </div>
                ) : (
                  <div className="current-model-note empty">
                    No 3D model is attached to this product yet.
                  </div>
                )}
                <input className="form-input" type="file" name="model3d" accept=".glb,model/gltf-binary" onChange={updateEditing} />
                <p className="field-hint">Upload a new GLB only if you want to replace the existing 3D model.</p>
              </div>
              <div className="actions">
                <button type="button" className="btn btn-outline" onClick={() => setEditingProduct(null)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={savingEdit}>{savingEdit ? "Saving..." : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      <style jsx>{`
        .manage-products { padding-bottom: 50px; }
        .content-grid { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }
        @media (max-width: 900px) { .content-grid { grid-template-columns: 1fr; } }
        .form-card, .table-card, .toolbar { background: white; padding: 25px; border-radius: var(--radius-card); box-shadow: var(--shadow-sm); }
        .form-card { height: fit-content; position: sticky; top: 20px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .input-with-icon, .search-box { position: relative; display: flex; align-items: center; gap: 10px; }
        .icon { position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-muted); pointer-events: none; }
        .form-input.indent { padding-left: 35px; }
        .toolbar { display: grid; grid-template-columns: 1fr 240px; gap: 16px; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td { padding: 12px 14px; border-bottom: 1px solid var(--border); text-align: left; }
        .admin-table .action-column { width: 86px; text-align: center; }
        .admin-table .action-cell { text-align: center; vertical-align: middle; padding-left: 10px; padding-right: 10px; }
        .table-image { width: 52px; height: 52px; object-fit: cover; border-radius: 12px; }
        .icon-action { border: none; background: rgba(183,110,121,0.08); color: var(--primary); width: 40px; height: 40px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; padding: 0; }
        .icon-action.delete { color: var(--danger); }
        .pagination { margin-top: 16px; display: flex; align-items: center; justify-content: space-between; }
        .modal-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.32); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-card { width: min(560px, calc(100% - 24px)); background: white; border-radius: var(--radius-card); box-shadow: var(--shadow-lg); padding: 24px; }
        .actions { display: flex; justify-content: flex-end; gap: 12px; }
        .current-model-note { margin-bottom: 10px; padding: 12px 14px; border-radius: 12px; background: rgba(183,110,121,0.1); color: var(--primary); font-size: 0.95rem; }
        .current-model-note.empty { background: rgba(148,163,184,0.12); color: var(--text-muted); }
        .field-hint { margin-top: 8px; font-size: 0.88rem; color: var(--text-muted); }
      `}</style>
    </div>
  );
};

export default ManageProducts;
