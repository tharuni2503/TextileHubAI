import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import ProductCard from "../../components/ProductCard";
import buyerLinks from "../../data/buyerLinks";
import {
  Search,
  Filter,
  Package,
  ShoppingBag,
  Store,
  RotateCcw,
} from "lucide-react";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState("");
  const [stock, setStock] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    loadProducts();
  }, [debouncedSearch, category, maxPrice, stock]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products", {
        params: { search: debouncedSearch, category, maxPrice, stock },
      });
      // Ensure products is always an array
      const productData = res.data?.products || [];
      setProducts(productData);
    } catch (err) {
      console.log(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
    setMaxPrice("");
    setStock("");
  };

  // Safe product count
  const productCount = Array.isArray(products) ? products.length : 0;

  return (
    <DashboardLayout links={buyerLinks}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Hero Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 shadow-lg mb-6"
        >
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />

          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Store size={14} />
              Trusted Marketplace
            </span>

            <h1 className="mt-3 text-2xl font-bold text-white">
              Textile Marketplace
            </h1>

            <p className="mt-1.5 max-w-2xl text-sm text-indigo-100">
              Discover premium textile products from verified suppliers.
            </p>

            <div className="mt-4 flex gap-6">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-indigo-200" />
                <div>
                  <h2 className="text-xl font-bold text-white">{productCount}</h2>
                  <p className="text-xs text-indigo-200">Products</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Package size={18} className="text-indigo-200" />
                <div>
                  <h2 className="text-xl font-bold text-white">100+</h2>
                  <p className="text-xs text-indigo-200">Suppliers</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="sticky top-20 z-10 rounded-xl bg-white border border-gray-200 p-3 shadow-sm mb-6"
        >
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <div className="flex items-center rounded-lg border border-gray-200 px-3 focus-within:ring-2 focus-within:ring-indigo-300">
              <Search size={15} className="text-gray-400" />
              <input
                className="w-full bg-transparent p-2 outline-none text-sm"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <select
              className="rounded-lg border border-gray-200 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All</option>
              <option>Cotton</option>
              <option>Silk</option>
              <option>Denim</option>
              <option>Linen</option>
              <option>Polyester</option>
              <option>Wool</option>
            </select>

            <input
              type="number"
              placeholder="Max Price"
              className="rounded-lg border border-gray-200 p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />

            <div className="flex items-center rounded-lg border border-gray-200 px-3 focus-within:ring-2 focus-within:ring-indigo-300">
              <Filter size={15} className="text-gray-400 mr-2" />
              <select
                className="w-full bg-transparent outline-none p-2 text-sm"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              >
                <option value="">All Stock</option>
                <option value="available">Available</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm p-2 transition shadow-sm"
            >
              <RotateCcw size={15} />
              Reset
            </button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
          </div>
        ) : productCount > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <motion.div
                key={product._id || product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-700">No products found</h3>
            <p className="text-sm text-gray-500">Try adjusting your filters</p>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}