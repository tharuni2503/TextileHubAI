import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import buyerLinks from "../../data/buyerLinks";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  MapPin,
  Phone,
  User,
  Building2,
  CreditCard,
  Truck,
  CheckCircle,
  ArrowLeft,
  Loader2,
} from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    landmark: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/cart");
      setCart(res.data.cart || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      if (item.product) {
        return acc + item.product.price * item.quantity;
      }
      return acc;
    }, 0);
  };

  const handleChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    // Validate address
    if (!address.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    if (!address.phone.trim() || address.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    if (!address.address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    if (!address.city.trim()) {
      toast.error("Please enter your city");
      return;
    }
    if (!address.pincode.trim() || address.pincode.length < 6) {
      toast.error("Please enter a valid pincode");
      return;
    }

    try {
      setPlacing(true);
      
      const orderData = {
        items: cart.map(item => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod: paymentMethod,
        totalAmount: calculateTotal(),
      };

      // The API clears the cart only after the order and stock reservation succeed.
      await api.post("/orders", orderData);
      setCart([]);
      toast.success("Order placed successfully!");
      navigate("/buyer/orders");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  const total = calculateTotal();

  if (loading) {
    return (
      <DashboardLayout links={buyerLinks}>
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <DashboardLayout links={buyerLinks}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold text-gray-700">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">Add some products to checkout</p>
            <Link
              to="/marketplace"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-white hover:bg-indigo-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={buyerLinks}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <CreditCard size={22} className="text-indigo-600" />
              Checkout
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Complete your order and confirm payment
            </p>
          </div>
          <Link
            to="/buyer/cart"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition"
          >
            <ArrowLeft size={16} />
            Back to Cart
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={placeOrder}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <User size={18} className="text-indigo-600" />
                Shipping Address
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <User size={14} className="text-indigo-600" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="fullName"
                    placeholder="Enter your full name"
                    value={address.fullName}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Phone size={14} className="text-indigo-600" />
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    placeholder="Enter phone number"
                    value={address.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin size={14} className="text-indigo-600" />
                    Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="address"
                    placeholder="Enter your address"
                    value={address.address}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <Building2 size={14} className="text-indigo-600" />
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="city"
                    placeholder="Enter your city"
                    value={address.city}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin size={14} className="text-indigo-600" />
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="pincode"
                    placeholder="Enter pincode"
                    value={address.pincode}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                    <MapPin size={14} className="text-indigo-600" />
                    Landmark (Optional)
                  </label>
                  <input
                    name="landmark"
                    placeholder="Nearby landmark"
                    value={address.landmark}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Payment Method</h3>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-sm">Cash on Delivery</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={paymentMethod === "Card"}
                      onChange={() => setPaymentMethod("Card")}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-sm">Card Payment</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="w-4 h-4 text-indigo-600 accent-indigo-600"
                    />
                    <span className="text-sm">UPI</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={placing || cart.length === 0}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                  placing || cart.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {placing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CheckCircle size={18} />
                    Place Order
                  </>
                )}
              </button>
            </motion.form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-24"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-indigo-600" />
                Order Summary
              </h2>

              <div className="space-y-3 max-h-60 overflow-y-auto">
                {cart.filter((item) => item.product).map((item) => (
                  <div key={item._id} className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <img
                      src={item.product?.image || "https://via.placeholder.com/50"}
                      alt={item.product?.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">
                      ₹{item.product?.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-semibold">₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery</span>
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                    FREE
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-indigo-600">₹{total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Truck size={16} className="text-indigo-600" />
                  <span>Estimated delivery: 3-5 business days</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}