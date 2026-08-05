import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import supplierLinks from "../../data/supplierLinks";
import toast from "react-hot-toast";
import {
  PackageCheck,
  ShoppingBag,
  Package,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
  RefreshCw,
  User,
  IndianRupee,
  AlertCircle,
  ArrowUpDown,
} from "lucide-react";

export default function SupplierOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' or 'asc'

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/orders/supplier");
      // Sort orders by createdAt (most recent first)
      const sortedOrders = (res.data.orders || []).sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(sortedOrders);
    } catch (err) {
      console.log(err);
      setError("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = () => {
    const newSortOrder = sortOrder === "desc" ? "asc" : "desc";
    setSortOrder(newSortOrder);
    const sorted = [...orders].sort((a, b) => {
      if (newSortOrder === "desc") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
    setOrders(sorted);
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdating(id);
      setError(null);
      
      await api.patch(`/orders/${id}`, { status });
      
      // Refresh orders after status update
      await loadOrders();
      
      toast.success(`Order status updated to ${status}!`);
    } catch (err) {
      console.log(err);
      setError("Failed to update order status");
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  const statusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "shipped":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "packed":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "accepted":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const statusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "packed":
        return <Package size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getAvailableActions = (status) => {
    const statusFlow = {
      "Pending": ["Accepted", "Cancelled"],
      "Accepted": ["Packed", "Cancelled"],
      "Packed": ["Shipped", "Cancelled"],
      "Shipped": ["Delivered", "Cancelled"],
      "Delivered": [],
      "Cancelled": []
    };
    return statusFlow[status] || [];
  };

  const actionButtonColor = (action) => {
    switch (action) {
      case "Accepted":
        return "bg-emerald-600 hover:bg-emerald-700";
      case "Packed":
        return "bg-purple-600 hover:bg-purple-700";
      case "Shipped":
        return "bg-blue-600 hover:bg-blue-700";
      case "Delivered":
        return "bg-green-600 hover:bg-green-700";
      case "Cancelled":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-indigo-600 hover:bg-indigo-700";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <PackageCheck size={22} className="text-indigo-600" />
              Supplier Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track all your incoming orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSort}
              className="text-sm text-gray-600 hover:text-indigo-600 flex items-center gap-1.5 transition border border-gray-200 px-3 py-1.5 rounded-lg"
            >
              <ArrowUpDown size={14} />
              {sortOrder === "desc" ? "Newest First" : "Oldest First"}
            </button>
            <button
              onClick={loadOrders}
              className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium">
              {orders.length} Orders
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          >
            <AlertCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-12 text-center"
          >
            <div className="flex justify-center mb-4">
              <ShoppingBag size={56} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-700">No Orders Yet</h2>
            <p className="text-gray-500 mt-2">Orders from buyers will appear here.</p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 border-b border-gray-100 bg-gray-50/50">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-semibold text-gray-900">
                          Order #{order._id?.slice(-6) || "N/A"}
                        </h2>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <User size={13} className="text-indigo-500" />
                          {order.buyer?.name || "Unknown Buyer"}
                        </div>
                        <span className="text-xs text-gray-300">|</span>
                        <span className="text-xs text-gray-500">
                          {order.items?.length || 0} items
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor(order.status)}`}
                      >
                        {statusIcon(order.status)}
                        {order.status || "Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 space-y-3">
                    {order.items?.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 py-3 border-b border-gray-100 last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <Package size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 text-sm">
                              {item.product?.name || "Product"}
                            </h3>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity || 1}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-indigo-600 text-sm">
                          ₹{item.price || 0}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-5 border-t border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee size={14} className="text-gray-400" />
                        <span className="text-sm font-bold text-indigo-600">
                          ₹{order.totalAmount || 0}
                        </span>
                      </div>
                      {order.status?.toLowerCase() === "cancelled" && (
                        <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                          <XCircle size={12} />
                          Cancelled
                        </span>
                      )}
                      {order.status?.toLowerCase() === "delivered" && (
                        <span className="text-xs text-green-500 font-medium flex items-center gap-1">
                          <CheckCircle size={12} />
                          Delivered
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    {getAvailableActions(order.status).length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {getAvailableActions(order.status).map((action) => (
                          <button
                            key={action}
                            onClick={() => updateStatus(order._id, action)}
                            disabled={updating === order._id}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium text-white transition-all ${actionButtonColor(action)} disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md`}
                          >
                            {updating === order._id ? (
                              <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                            ) : (
                              action
                            )}
                          </button>
                        ))}
                      </div>
                    )}
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