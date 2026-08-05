import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Boxes,
  ClipboardList,
  BarChart3,
  User,
  Heart,
  ShoppingCart,
  Package,
  Sparkles,
  Store,
  X,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const icons = {
  Dashboard: LayoutDashboard,
  Marketplace: ShoppingBag,
  Products: Boxes,
  "Add Product": PlusCircle,
  Inventory: Package,
  Orders: ClipboardList,
  Analytics: BarChart3,
  Profile: User,
  Wishlist: Heart,
  Cart: ShoppingCart,
  "AI Price": Sparkles,
};

function SidebarContent({ links, setSidebarOpen, user }) {
  return (
    <>
      {/* Logo */}
      <div className="px-5 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md">
              <Store size={18} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">TextileHub</h1>
              <p className="text-[10px] text-gray-500">Marketplace</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {links.map((item) => {
          const Icon = icons[item.label] || LayoutDashboard;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
            >
              {({ isActive }) => (
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`
                    relative
                    flex
                    items-center
                    gap-3
                    rounded-xl
                    px-3.5
                    py-2.5
                    transition-all
                    duration-200
                    text-sm
                    ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 hover:translate-x-1"
                    }
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r-full bg-white" />
                  )}

                  <Icon size={17} />

                  <span className="font-medium">{item.label}</span>
                </motion.div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Card */}
      <div className="p-4 border-t border-gray-200">
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 shadow-md p-4"
        >
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt={user.name}
                className="h-11 w-11 rounded-full object-cover border-2 border-indigo-100"
              />
            ) : (
              <div className="h-11 w-11 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
            )}

            <div className="overflow-hidden">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {user?.name || "Guest"}
              </h3>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role || "User"}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default function Sidebar({ links, sidebarOpen, setSidebarOpen }) {
  const { user } = useAuth();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 h-screen sticky top-0 flex-col bg-white/90 backdrop-blur-xl border-r border-gray-100 shadow-lg">
        <SidebarContent
          links={links}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25 }}
              className="fixed top-0 left-0 z-50 h-screen w-64 flex flex-col bg-white border-r border-gray-200 shadow-2xl lg:hidden"
            >
              <SidebarContent
                links={links}
                setSidebarOpen={setSidebarOpen}
                user={user}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}