import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import supplierLinks from "../../data/supplierLinks";
import toast from "react-hot-toast";
import {
  TrendingUp,
  IndianRupee,
  Package,
  ShoppingCart,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  AlertCircle,
} from "lucide-react";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from API
      try {
        const res = await api.get(`/analytics/supplier?range=${timeRange}`);
        setAnalytics(res.data.analytics);
        return;
      } catch (apiError) {
        console.log("API not available, using mock data:", apiError);
        // Use mock data if API fails
        setAnalytics(getMockAnalytics());
        setError(null); // Clear error since we have mock data
        toast.info("Using demo data. Connect your backend for real analytics.");
      }
    } catch (err) {
      console.log(err);
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = () => ({
    totalRevenue: 125000,
    totalOrders: 45,
    totalProducts: 28,
    totalCustomers: 32,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    monthlyRevenue: [
      { month: "Jan", revenue: 15000 },
      { month: "Feb", revenue: 18000 },
      { month: "Mar", revenue: 22000 },
      { month: "Apr", revenue: 20000 },
      { month: "May", revenue: 25000 },
      { month: "Jun", revenue: 28000 },
    ],
    topProducts: [
      { name: "Premium Cotton Fabric", orders: 12, revenue: 26400 },
      { name: "Blue Denim", orders: 8, revenue: 28000 },
      { name: "Luxury Silk", orders: 6, revenue: 43200 },
      { name: "Linen Fabric", orders: 5, revenue: 14000 },
    ],
    orderStatus: [
      { status: "Pending", count: 5 },
      { status: "Accepted", count: 8 },
      { status: "Shipped", count: 12 },
      { status: "Delivered", count: 20 },
    ],
    recentActivity: [
      { action: "New Order #12345", time: "2 min ago" },
      { action: "Payment Received ₹5,000", time: "15 min ago" },
      { action: "Order Shipped #12340", time: "1 hour ago" },
      { action: "New Product Added", time: "3 hours ago" },
    ],
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Revenue",
      value: analytics ? formatCurrency(analytics.totalRevenue) : "₹0",
      icon: <IndianRupee size={22} />,
      color: "from-emerald-500 to-green-600",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
      growth: analytics?.revenueGrowth || 0,
    },
    {
      title: "Total Orders",
      value: analytics?.totalOrders || 0,
      icon: <ShoppingCart size={22} />,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      growth: analytics?.orderGrowth || 0,
    },
    {
      title: "Total Products",
      value: analytics?.totalProducts || 0,
      icon: <Package size={22} />,
      color: "from-purple-500 to-violet-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
      growth: 0,
    },
    {
      title: "Total Customers",
      value: analytics?.totalCustomers || 0,
      icon: <Users size={22} />,
      color: "from-orange-500 to-amber-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
      growth: 0,
    },
  ];

  const maxRevenue = Math.max(...(analytics?.monthlyRevenue || []).map(d => d.revenue || 0));

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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 size={22} className="text-indigo-600" />
              Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your business performance and insights
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["week", "month", "year"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                    timeRange === range
                      ? "bg-white text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {range.charAt(0).toUpperCase() + range.slice(1)}
                </button>
              ))}
            </div>
            <button
              onClick={loadAnalytics}
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition"
            >
              <RefreshCw size={18} className="text-gray-600" />
            </button>
            <button className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
              <Download size={18} />
            </button>
          </div>
        </div>

        {/* Info Message */}
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          Showing demo data. Connect your backend API for real analytics.
        </div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`${stat.bgColor} rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </h3>
                  {stat.growth > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <ArrowUp size={14} className="text-green-600" />
                      <span className="text-xs font-medium text-green-600">
                        {stat.growth}%
                      </span>
                      <span className="text-xs text-gray-400">vs last period</span>
                    </div>
                  )}
                </div>
                <div className={`p-2.5 rounded-xl ${stat.textColor} bg-white/60`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Revenue Chart & Order Status */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <LineChart size={20} className="text-indigo-600" />
                Revenue Overview
              </h2>
              <span className="text-xs text-gray-400">{timeRange}ly</span>
            </div>

            <div className="h-48 flex items-end gap-2">
              {(analytics?.monthlyRevenue || []).map((item, index) => {
                const height = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full max-w-12 rounded-lg bg-gradient-to-t from-indigo-600 to-violet-600 hover:opacity-80 transition-all duration-300"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <span className="text-[10px] text-gray-500">{item.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-400">Min: ₹0</span>
              <span className="text-xs text-gray-400">Max: {formatCurrency(maxRevenue)}</span>
            </div>
          </motion.div>

          {/* Order Status */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <PieChart size={20} className="text-indigo-600" />
              Order Status Distribution
            </h2>

            <div className="space-y-3">
              {(analytics?.orderStatus || []).map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-600 w-20">{item.status}</span>
                  <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        item.status === "Delivered" ? "bg-green-500" :
                        item.status === "Shipped" ? "bg-blue-500" :
                        item.status === "Accepted" ? "bg-emerald-500" :
                        item.status === "Pending" ? "bg-yellow-500" :
                        "bg-gray-500"
                      }`}
                      style={{ width: `${(item.count / (analytics?.totalOrders || 1)) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-700 w-10 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6"
        >
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-indigo-600" />
            Top Products
          </h2>

          {(analytics?.topProducts || []).length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No products data available</p>
          ) : (
            <div className="space-y-3">
              {(analytics?.topProducts || []).map((product, index) => (
                <div key={index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-bold text-gray-400 w-6">{index + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.orders} orders</p>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">{formatCurrency(product.revenue)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

      </div>
    </DashboardLayout>
  );
}