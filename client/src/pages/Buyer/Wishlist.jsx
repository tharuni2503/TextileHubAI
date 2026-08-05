import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import buyerLinks from "../../data/buyerLinks";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      setLoading(true);
      const res = await api.get("/wishlist");
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const removeWishlist = async (id) => {
    try {
      await api.delete(`/wishlist/${id}`);
      setWishlist(wishlist.filter(item => item._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const addToCart = async (productId) => {
    try {
      await api.post("/cart", {
        productId,
        quantity: 1,
      });
      // Show success feedback
      alert("Added to Cart 🛒");
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <DashboardLayout links={buyerLinks}>
        <div className="flex items-center justify-center py-20">
          <div className="h-12 w-12 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={buyerLinks}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Heart size={22} className="text-pink-500" />
          My Wishlist ({wishlist.length})
        </h1>

        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center"
          >
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-pink-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700">Wishlist is Empty</h2>
            <p className="text-gray-500 mt-2">Save your favourite textile products here.</p>
            <Link
              to="/marketplace"
              className="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm hover:shadow"
            >
              Browse Products
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {wishlist.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={item.product?.image || "https://via.placeholder.com/400"}
                      alt={item.product?.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Category badge */}
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-medium px-3 py-1 rounded-full shadow">
                      {item.product?.category || "Textile"}
                    </span>
                  </div>

                  <div className="p-5">
                    <h2 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors">
                      {item.product?.name}
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      {item.product?.supplier || "Verified Supplier"}
                    </p>
                    <h3 className="text-xl font-bold text-indigo-600 mt-3">
                      ₹{item.product?.price}
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mt-5">
                      <button
                        onClick={() => addToCart(item.product._id)}
                        className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition shadow-sm hover:shadow"
                      >
                        <ShoppingCart size={16} />
                        Cart
                      </button>

                      <button
                        onClick={() => removeWishlist(item._id)}
                        className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-xl text-sm font-medium transition"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}