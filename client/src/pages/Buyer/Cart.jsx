import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "../../layouts/DashboardLayout";
import buyerLinks from "../../data/buyerLinks";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { ShoppingBag, Trash2, ArrowRight, ShoppingCart } from "lucide-react";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [cart]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data.cart || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const sum = cart.reduce((acc, item) => {
      if (item.product) {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0);
    setTotal(sum);
  };

  const removeItem = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      setCart(cart.filter(item => item._id !== itemId));
    } catch (err) {
      console.log(err);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await api.put(`/cart/${itemId}`, { quantity: newQuantity });
      setCart(cart.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      ));
    } catch (err) {
      console.log(err);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
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
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left - Cart Items */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ShoppingCart size={22} className="text-indigo-600" />
              My Cart ({cart.filter(item => item.product).length})
            </h1>

            {cart.filter(item => item.product).length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center"
              >
                <div className="flex justify-center mb-4">
                  <ShoppingBag size={64} className="text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-700">Your Cart is Empty 🛒</h2>
                <p className="text-gray-500 mt-2">Add products to start shopping.</p>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition shadow-sm hover:shadow"
                >
                  Continue Shopping
                  <ArrowRight size={18} />
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {cart.filter(item => item.product).map((item, index) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex flex-col sm:flex-row justify-between gap-4 hover:shadow-md transition"
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.product.image || "https://via.placeholder.com/100"}
                          alt={item.product.name}
                          className="w-24 h-24 rounded-xl object-cover border border-gray-100"
                        />
                        <div className="flex-1">
                          <h2 className="font-semibold text-gray-900">
                            {item.product.name}
                          </h2>
                          <p className="text-indigo-600 font-bold mt-1">
                            ₹{item.product.price}
                          </p>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-sm"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition text-sm"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => removeItem(item._id)}
                        className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-xl text-sm font-medium transition self-start sm:self-center"
                      >
                        <Trash2 size={16} />
                        Remove
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right - Order Summary */}
          {cart.filter(item => item.product).length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:w-80 xl:w-96"
            >
              <div className="sticky top-20 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-5">
                  Order Summary
                </h2>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Items</span>
                    <span className="font-semibold text-gray-900">
                      {cart.filter(item => item.product).length}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery</span>
                    <span className="text-green-600 font-semibold">Free</span>
                  </div>

                  <hr className="border-gray-200" />

                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="text-indigo-600">₹{total}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="mt-5 w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Place Order
                </button>

                <Link
                  to="/marketplace"
                  className="mt-3 w-full block text-center rounded-xl border border-indigo-600 py-3 font-medium text-indigo-600 transition hover:bg-indigo-50"
                >
                  Continue Shopping
                </Link>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}