import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Home,
  Store,
  ShoppingBag,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const handleChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate password length
    if (form.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      await api.post("/auth/register", form);

      alert("Registration Successful! 🎉 Please login to continue.");
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Registration Failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-4 relative">

      {/* Back to Home Button - Top Left */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 group z-10"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">
          <Home size={18} />
        </span>
      </motion.button>

      {/* Register Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: .5 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 relative"
      >

        {/* Logo/Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg">
            <span className="text-2xl font-bold text-white">T</span>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center text-gray-900">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mt-2 mb-8">
          Join TextileHub Marketplace
        </p>

        {/* Name */}
        <div className="relative mb-4">
          <User
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Email */}
        <div className="relative mb-4">
          <Mail
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>

        {/* Password */}
        <div className="relative mb-4">
          <Lock
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Password (min 6 characters)"
            value={form.password}
            onChange={handleChange}
            required
            minLength="6"
            className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 transition"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Role Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 block mb-2">
            I want to join as
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "buyer" })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                form.role === "buyer"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <ShoppingBag size={18} />
              <span>Buyer</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: "supplier" })}
              className={`flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all ${
                form.role === "supplier"
                  ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 hover:border-gray-300 text-gray-600"
              }`}
            >
              <Store size={18} />
              <span>Supplier</span>
            </button>
          </div>
        </div>

        {/* Hidden select for form submission */}
        <input type="hidden" name="role" value={form.role} />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:-translate-y-0.5"
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating Account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
          >
            Login
          </Link>
        </p>

        {/* Back to Home link at bottom */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <Link
            to="/"
            className="text-sm text-gray-500 hover:text-indigo-600 transition inline-flex items-center gap-1.5"
          >
            <Home size={14} />
            Back to Home
          </Link>
        </div>

      </motion.form>

      {/* Brand Watermark */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
        TextileHub • AI Marketplace
      </div>
    </div>
  );
}