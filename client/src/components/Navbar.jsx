import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingBag, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Categories", href: "#categories" },
  { name: "Products", href: "#products" },
  { name: "Why Us", href: "#about" },
  { name: "Reviews", href: "#testimonials" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="h-18 lg:h-20 flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
              <ShoppingBag className="text-white" size={20} />
            </div>
            <div>
              <h2 className="font-bold text-xl text-gray-900">
                TextileHub
              </h2>
              <p className="text-xs text-indigo-600 font-medium">
                AI Marketplace
              </p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((item) =>
              item.href.startsWith("#") ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition"
                >
                  {item.name}
                </Link>
              )
            )}
          </nav>

          {/* Right Side - Login & Register */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/login"
              className="text-lg font-medium text-gray-700 hover:text-indigo-600 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:-translate-y-0.5 text-white px-6 py-2.5 rounded-xl text-base font-semibold transition-all duration-300 shadow-md"
            >
              Register
            </Link>
          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {open ? <X size={24} className="text-indigo-600" /> : <Menu size={24} className="text-gray-700" />}
          </button>

        </div>

      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden bg-white border-t shadow-lg"
          >
            <div className="px-5 py-5 space-y-4">
              {navLinks.map((item) =>
                item.href.startsWith("#") ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-lg text-gray-700 font-medium hover:text-indigo-600 transition"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-lg text-gray-700 font-medium hover:text-indigo-600 transition"
                  >
                    {item.name}
                  </Link>
                )
              )}

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center border border-gray-300 rounded-xl py-3 text-lg font-medium text-gray-700 hover:border-indigo-600 hover:text-indigo-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="block text-center bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl py-3 text-lg font-medium shadow-md hover:shadow-lg transition"
                >
                  Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </header>
  );
}