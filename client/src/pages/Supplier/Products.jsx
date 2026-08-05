import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import supplierLinks from "../../data/supplierLinks";
import toast from "react-hot-toast";
import {
  Search,
  Pencil,
  Trash2,
  Plus,
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Filter,
  Grid,
  List,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [filterCategory, setFilterCategory] = useState("All");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products");
      setProducts(res.data.products || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;

    try {
      setDeleting(id);
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success("Product deleted successfully!");
    } catch (err) {
      console.log(err);
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
    }
  };

  // Get unique categories for filter
  const categories = ["All", ...new Set(products.map(p => p.category).filter(Boolean))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name?.toLowerCase().includes(search.toLowerCase()) || 
                         product.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === "All" || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (stock) => {
    if (stock > 10) return "bg-green-100 text-green-700 border-green-200";
    if (stock > 0 && stock <= 10) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  const getStatusText = (stock) => {
    if (stock > 10) return "In Stock";
    if (stock > 0 && stock <= 10) return "Low Stock";
    return "Out of Stock";
  };

  const getStatusIcon = (stock) => {
    if (stock > 10) return <CheckCircle size={14} />;
    if (stock > 0 && stock <= 10) return <AlertTriangle size={14} />;
    return <XCircle size={14} />;
  };

  if (loading) {
    return (
      <DashboardLayout links={supplierLinks}>
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={supplierLinks}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Package size={22} className="text-indigo-600" />
              My Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage all your textile products
            </p>
          </div>
          <Link
            to="/supplier/add-product"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:-translate-y-0.5 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-md"
          >
            <Plus size={18} />
            Add Product
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-indigo-300 transition shadow-sm">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or category..."
              className="w-full outline-none ml-3 text-sm bg-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm">
              <Filter size={16} className="text-gray-400 mr-2" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-transparent outline-none text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* View toggle */}
            <div className="flex bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 transition ${viewMode === "grid" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 transition ${viewMode === "list" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-gray-600"}`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-4">
          <span className="text-sm text-gray-500">
            Showing {filteredProducts.length} of {products.length} products
          </span>
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center"
          >
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">No Products Found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or add a new product.</p>
          </motion.div>
        ) : viewMode === "grid" ? (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                <div className="relative h-40 overflow-hidden bg-gray-100">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.stock)}`}>
                      {getStatusIcon(product.stock)}
                      {getStatusText(product.stock)}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">{product.category}</p>
                    </div>
                    <span className="text-sm font-bold text-indigo-600">₹{product.price}</span>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/supplier/edit-product/${product._id}`}
                        className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
                        <Pencil size={14} />
                      </Link>
                      <Link
                        to={`/product/${product._id}`}
                        className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                        target="_blank"
                      >
                        <Eye size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deleting === product._id}
                        className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Image</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3">
                        <img
                          src={product.image || "https://via.placeholder.com/50"}
                          alt={product.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      </td>
                      <td className="px-5 py-3 font-medium text-gray-900 text-sm">{product.name}</td>
                      <td className="px-5 py-3 text-sm text-gray-500">{product.category}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-indigo-600">₹{product.price}</td>
                      <td className="px-5 py-3 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(product.stock)}`}>
                          {getStatusIcon(product.stock)}
                          {getStatusText(product.stock)}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/supplier/edit-product/${product._id}`}
                            className="p-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <Pencil size={14} />
                          </Link>
                          <Link
                            to={`/product/${product._id}`}
                            className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                            target="_blank"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deleting === product._id}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition disabled:opacity-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}