import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import supplierLinks from "../../data/supplierLinks";
import BarChart from "../../components/charts/BarChart";
import PieChart from "../../components/charts/PieChart";
import {
  Package,
  ShoppingCart,
  IndianRupee,
  Clock3,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Boxes,
  TrendingUp,
  Users,
  RefreshCw,
} from "lucide-react";

export default function SupplierDashboard() {
  const [dashboard, setDashboard] = useState({});
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/dashboard/supplier");
      setDashboard(res.data.dashboard || {});
      setRecentOrders(res.data.recentOrders || []);
    } catch (err) {
      console.log(err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: "Products",
      value: dashboard.totalProducts || 0,
      color: "from-blue-500 to-indigo-600",
      icon: <Package size={24} />,
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      title: "Orders",
      value: dashboard.totalOrders || 0,
      color: "from-green-500 to-emerald-600",
      icon: <ShoppingCart size={24} />,
      bgColor: "bg-green-50",
      textColor: "text-green-600",
    },
    {
      title: "Revenue",
      value: `₹${dashboard.totalRevenue || 0}`,
      color: "from-purple-500 to-pink-600",
      icon: <IndianRupee size={24} />,
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      title: "Pending",
      value: dashboard.pendingOrders || 0,
      color: "from-yellow-500 to-orange-500",
      icon: <Clock3 size={24} />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-600",
    },
    {
      title: "Delivered",
      value: dashboard.deliveredOrders || 0,
      color: "from-emerald-500 to-green-700",
      icon: <CheckCircle size={24} />,
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      title: "Cancelled",
      value: dashboard.cancelledOrders || 0,
      color: "from-red-500 to-rose-600",
      icon: <XCircle size={24} />,
      bgColor: "bg-red-50",
      textColor: "text-red-600",
    },
    {
      title: "Low Stock",
      value: dashboard.lowStock || 0,
      color: "from-orange-500 to-red-500",
      icon: <AlertTriangle size={24} />,
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
    {
      title: "Out Of Stock",
      value: dashboard.outOfStock || 0,
      color: "from-gray-700 to-gray-900",
      icon: <Boxes size={24} />,
      bgColor: "bg-gray-50",
      textColor: "text-gray-600",
    },
  ];

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
              <TrendingUp size={22} className="text-indigo-600" />
              Supplier Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back! Here's an overview of your business.
            </p>
          </div>
          <button
            onClick={loadDashboard}
            className="text-sm text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
          >
            <XCircle size={16} />
            {error}
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {cards.slice(0, 4).map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`${card.bgColor} rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${card.textColor} bg-white/60`}>
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* More Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {cards.slice(4).map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ y: -4 }}
              className={`${card.bgColor} rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{card.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${card.textColor} bg-white/60`}>
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-600" />
              Sales Analytics
            </h2>
            <BarChart dashboard={dashboard} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={20} className="text-indigo-600" />
              Order Status
            </h2>
            <PieChart dashboard={dashboard} />
          </motion.div>
        </div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
        >
          <div className="flex justify-between items-center p-5 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Clock3 size={20} className="text-indigo-600" />
              Recent Orders
            </h2>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {recentOrders.length} Orders
            </span>
          </div>

          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Package size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-sm">No Orders Available</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Buyer
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {recentOrders.map((order, index) => (
                    <motion.tr
                      key={order._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                      className="hover:bg-indigo-50/50 transition-colors duration-200"
                    >
                      <td className="px-5 py-3.5 text-sm font-medium text-gray-900">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-gray-400" />
                          {order.buyer?.name || "Unknown"}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColor(order.status)}`}>
                          {statusIcon(order.status)}
                          {order.status || "Pending"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-indigo-600">
                        ₹{order.totalAmount || 0}
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}

// Helper functions for status styling
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
      return <CheckCircle size={12} />;
    case "cancelled":
      return <XCircle size={12} />;
    case "shipped":
      return <Package size={12} />;
    case "packed":
      return <Boxes size={12} />;
    case "pending":
      return <Clock3 size={12} />;
    case "accepted":
      return <CheckCircle size={12} />;
    default:
      return <Clock3 size={12} />;
  }
};