import { useEffect, useState } from "react";
import {
  ShoppingCart,
  ClipboardList,
  Heart,
  Store,
  ArrowRight,
  Package,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const links = [
  { label: "Dashboard", path: "/buyer/dashboard" },
  { label: "Marketplace", path: "/marketplace" },
  { label: "Cart", path: "/buyer/cart" },
  { label: "Orders", path: "/buyer/orders" },
  { label: "Profile", path: "/buyer/profile" },
];

const actions = [
  { title: "Browse Marketplace", path: "/marketplace", icon: Store },
  { title: "My Orders", path: "/buyer/orders", icon: ClipboardList },
  { title: "Wishlist", path: "/buyer/wishlist", icon: Heart },
  { title: "View Cart", path: "/buyer/cart", icon: ShoppingCart },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalOrders: 0,
    cartItems: 0,
    wishlistItems: 0,
    totalSuppliers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Good Morning");

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");

    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch orders
      const ordersRes = await api.get("/orders/buyer");
      const orders = ordersRes.data.orders || [];
      setRecentOrders(orders.slice(0, 3));
      
      // Fetch cart
      const cartRes = await api.get("/cart");
      const cart = cartRes.data.cart || [];
      
      // Fetch wishlist
      const wishlistRes = await api.get("/wishlist");
      const wishlist = wishlistRes.data.wishlist || [];
      
      // Fetch suppliers (you may need a separate endpoint)
      // For now, we'll use a placeholder
      const suppliersCount = 0;

      setStats({
        totalOrders: orders.length,
        cartItems: cart.reduce((acc, item) => acc + (item.quantity || 0), 0),
        wishlistItems: wishlist.length,
        totalSuppliers: suppliersCount || 0,
      });
    } catch (err) {
      console.log("Failed to load dashboard data:", err);
      // Use mock data if API fails
      setStats({
        totalOrders: 0,
        cartItems: 0,
        wishlistItems: 0,
        totalSuppliers: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ClipboardList,
      color: "from-indigo-600 to-violet-600",
      bgColor: "bg-indigo-50",
      textColor: "text-indigo-600",
    },
    {
      title: "Cart Items",
      value: stats.cartItems,
      icon: ShoppingCart,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Wishlist",
      value: stats.wishlistItems,
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      textColor: "text-pink-600",
    },
    {
      title: "Suppliers",
      value: stats.totalSuppliers,
      icon: Store,
      color: "from-emerald-500 to-green-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
  ];

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "packed": return "bg-purple-100 text-purple-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "accepted": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <DashboardLayout links={links}>
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={links}>
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {greeting}, {user?.name || "User"} 👋
          </h1>
        </div>
        <p className="mt-2 text-gray-500">
          Welcome back to TextileHub. Here's an overview of your account.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-6 mt-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              className={`${item.bgColor} rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{item.title}</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">
                    {item.value}
                  </h2>
                </div>
                <div className={`p-3 rounded-xl ${item.textColor} bg-white/60`}>
                  <Icon size={22} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders & Quick Actions */}
      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList size={20} className="text-indigo-600" />
              Recent Orders
            </h2>
            <Link
              to="/buyer/orders"
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View All
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">No orders yet</p>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-1 mt-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                Start shopping <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/buyer/orders`}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Order #{order._id?.slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items?.length || 0} items • ₹{order.totalAmount || 0}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status || "Pending"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" />
            Quick Actions
          </h2>

          <div className="space-y-3">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={item.path}
                    className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-indigo-50 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition">
                        <Icon size={18} />
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-indigo-700 transition">
                        {item.title}
                      </span>
                    </div>
                    <ArrowRight size={18} className="text-gray-400 group-hover:text-indigo-600 transition" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Empty State (Only show if no orders and no cart items) */}
      {stats.totalOrders === 0 && stats.cartItems === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center"
        >
          <div className="flex justify-center mb-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076478.png"
              alt="Empty"
              className="w-32 h-32 object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-700">No Orders Yet</h2>
          <p className="text-gray-500 mt-2">
            Start exploring premium textile products from verified suppliers.
          </p>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
          >
            Browse Marketplace
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      )}
    </DashboardLayout>
  );
}