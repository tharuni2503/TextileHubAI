import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import buyerLinks from "../../data/buyerLinks";
import { 
  PackageCheck, 
  ShoppingBag, 
  Package, 
  Clock, 
  Truck, 
  CheckCircle, 
  XCircle,
  X,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [showConfirm, setShowConfirm] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/orders/buyer");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.log(err);
      setOrders([]);
      setError("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      setCancelling(orderId);
      setError(null);
      
      // Try different possible endpoints
      let response;
      try {
        // Option 1: PUT /orders/:id/cancel (Most common)
        response = await api.put(`/orders/${orderId}/cancel`);
      } catch (err) {
        // If first endpoint fails, try alternative
        if (err.response?.status === 404) {
          try {
            // Option 2: POST /orders/:id/cancel
            response = await api.post(`/orders/${orderId}/cancel`);
          } catch (err2) {
            if (err2.response?.status === 404) {
              try {
                // Option 3: PUT /orders/cancel/:id
                response = await api.put(`/orders/cancel/${orderId}`);
              } catch (err3) {
                if (err3.response?.status === 404) {
                  try {
                    // Option 4: PATCH /orders/:id/status
                    response = await api.patch(`/orders/${orderId}/status`, { 
                      status: "cancelled" 
                    });
                  } catch (err4) {
                    throw err4;
                  }
                } else {
                  throw err3;
                }
              }
            } else {
              throw err2;
            }
          }
        } else {
          throw err;
        }
      }
      
      // Refresh orders after cancellation
      await loadOrders();
      setShowConfirm(null);
      
      // Show success message
      alert("Order cancelled successfully!");
    } catch (err) {
      console.log(err);
      setError("Failed to cancel order. Please try again or contact support.");
      
      // Show error in a more user-friendly way
      alert(err.response?.data?.message || "Failed to cancel order. Please try again.");
    } finally {
      setCancelling(null);
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
      case "processing":
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
      case "processing":
        return <Clock size={16} />;
      case "accepted":
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const canCancel = (status) => {
    const cancellable = ["processing", "packed", "shipped", "accepted"];
    return cancellable.includes(status?.toLowerCase());
  };

  if (loading) {
    return (
      <DashboardLayout links={buyerLinks}>
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
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
              <PackageCheck size={22} className="text-indigo-600" />
              My Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track all your textile purchases
            </p>
          </div>
          <div className="flex items-center gap-3">
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
            <AlertTriangle size={16} />
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
            <p className="text-gray-500 mt-2">Your placed orders will appear here.</p>
          </motion.div>
        ) : (
          <div className="space-y-5">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
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
                          {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.items?.length || 0} items
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColor(order.status)}`}
                      >
                        {statusIcon(order.status)}
                        {order.status || "Processing"}
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
                            <PackageCheck size={18} className="text-indigo-600" />
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
                      <div className="text-xs text-gray-500">
                        Order placed • {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </div>
                      {order.status?.toLowerCase() === "cancelled" && (
                        <span className="text-xs text-red-500 font-medium flex items-center gap-1">
                          <XCircle size={12} />
                          Cancelled
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">Total</span>
                      <span className="text-xl font-bold text-indigo-600">
                        ₹{order.totalAmount || 0}
                      </span>
                    </div>
                  </div>

                  {/* Cancel Button - Only show if order can be cancelled */}
                  {canCancel(order.status) && order.status?.toLowerCase() !== "cancelled" && (
                    <div className="px-5 pb-4 pt-0 -mt-2">
                      <button
                        onClick={() => setShowConfirm(order._id)}
                        disabled={cancelling === order._id}
                        className="flex items-center gap-1.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <X size={14} />
                        {cancelling === order._id ? "Cancelling..." : "Cancel Order"}
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Cancel Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowConfirm(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-red-100">
                    <AlertTriangle size={24} className="text-red-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                </div>

                <p className="text-gray-600 text-sm mb-6">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirm(null)}
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={() => cancelOrder(showConfirm)}
                    disabled={cancelling === showConfirm}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {cancelling === showConfirm ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </DashboardLayout>
  );
}