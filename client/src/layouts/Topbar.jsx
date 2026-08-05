import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Bell,
  LogOut,
  Menu,
  User,
  Settings,
  HelpCircle,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Package,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import toast from "react-hot-toast";

export default function Topbar({ setSidebarOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const notificationRef = useRef(null);

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? "Good Morning"
      : hour < 18
      ? "Good Afternoon"
      : "Good Evening";

  const username = user?.name || "User";
  const role = user?.role || "Buyer";

  // Load notifications
  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
      const unread = (res.data.notifications || []).filter(n => !n.read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.log("Failed to load notifications:", err);
      // If API fails, use mock data
      setNotifications(getMockNotifications());
    }
  };

  // Mock notifications for demo
  const getMockNotifications = () => {
    return [
      {
        _id: "1",
        title: "New Order Received",
        message: "Order #12345 has been placed by ABC Garments",
        type: "order",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      },
      {
        _id: "2",
        title: "Order Shipped",
        message: "Order #12340 has been shipped successfully",
        type: "shipped",
        read: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      },
      {
        _id: "3",
        title: "Payment Received",
        message: "Payment of ₹15,000 received for Order #12335",
        type: "payment",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      },
      {
        _id: "4",
        title: "New Supplier Joined",
        message: "Premium Textiles Ltd has joined the marketplace",
        type: "supplier",
        read: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      },
    ];
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.log("Failed to mark as read:", err);
      // Update locally anyway
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/mark-all-read");
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (err) {
      console.log("Failed to mark all as read:", err);
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification._id);
    // Navigate based on notification type
    if (notification.type === "order") {
      navigate("/buyer/orders");
    } else if (notification.type === "shipped") {
      navigate("/buyer/orders");
    } else if (notification.type === "payment") {
      navigate("/buyer/orders");
    }
    setShowNotifications(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "order":
        return <Package size={16} className="text-blue-500" />;
      case "shipped":
        return <Truck size={16} className="text-green-500" />;
      case "payment":
        return <CheckCircle size={16} className="text-emerald-500" />;
      case "cancelled":
        return <XCircle size={16} className="text-red-500" />;
      case "supplier":
        return <User size={16} className="text-purple-500" />;
      default:
        return <Bell size={16} className="text-gray-500" />;
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      navigate("/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200">
      <div className="flex items-center justify-between px-4 md:px-8 py-4">

        {/* Left */}
        <div className="flex items-center gap-4">

          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-indigo-50 transition"
          >
            <Menu size={20} />
          </button>

          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl md:text-3xl font-bold text-gray-900">
              {greeting},
              <span className="text-indigo-600"> {username}</span> 👋
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Welcome back to TextileHub
            </p>
          </motion.div>

        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification Bell */}
          <div className="relative" ref={notificationRef}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-sm flex items-center justify-center hover:bg-indigo-50 transition"
            >
              <Bell size={20} className="text-gray-700" />

              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[400px] overflow-y-auto bg-white rounded-2xl border border-gray-200 shadow-2xl z-50"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <div className="flex items-center gap-2">
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="p-1 rounded-lg hover:bg-gray-100 transition"
                      >
                        <X size={16} className="text-gray-500" />
                      </button>
                    </div>
                  </div>

                  {/* Notifications List */}
                  {notifications.length === 0 ? (
                    <div className="py-12 text-center">
                      <Bell size={32} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-sm text-gray-500">No notifications yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => handleNotificationClick(notification)}
                          className={`px-4 py-3 hover:bg-indigo-50/50 transition cursor-pointer ${
                            !notification.read ? "bg-indigo-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}>
                                  {notification.title}
                                </p>
                                {!notification.read && (
                                  <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0"></span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">
                                {getTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-2 border-t border-gray-100 text-center sticky bottom-0 bg-white rounded-b-2xl">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          navigate("/notifications");
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        View all notifications
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User */}
          <motion.div
            whileHover={{ y: -2 }}
            className="hidden sm:flex items-center gap-3"
          >
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={username}
                className="h-11 w-11 rounded-full object-cover border-2 border-indigo-100"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <h3 className="font-semibold text-gray-800">
                {username}
              </h3>

              <p className="text-xs text-gray-500 capitalize">
                {role}
              </p>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-4 py-2.5 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <LogOut size={18} />

            <span className="hidden md:block">
              Logout
            </span>
          </motion.button>

        </div>
      </div>
    </header>
  );
}