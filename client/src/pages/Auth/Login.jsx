import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await api.post("/auth/login", form);

      login(res.data.user, res.data.token);

      navigate(
        res.data.user.role === "supplier"
          ? "/supplier/dashboard"
          : "/buyer/dashboard"
      );
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
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
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-gray-700 hover:bg-white hover:shadow-lg transition-all duration-300 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        <span className="hidden sm:inline">Back to Home</span>
        <span className="sm:hidden">
          <Home size={18} />
        </span>
      </motion.button>

      {/* Login Form */}
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
          Welcome Back
        </h2>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Login to continue to TextileHub
        </p>

        <div className="relative mb-4">
          <Mail
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
            required
          />
        </div>

        <div className="relative mb-2">
          <Lock
            size={18}
            className="absolute left-4 top-3.5 text-gray-400"
          />

          <input
            type={show ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl pl-11 pr-11 py-3 outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
            required
          />

          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 transition"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Forgot Password Link */}
        <div className="text-right mb-6">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Forgot Password?
          </Link>
        </div>

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
              Logging in...
            </div>
          ) : (
            "Login"
          )}
        </button>

        <p className="text-center text-sm mt-6 text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition"
          >
            Register
          </Link>
        </p>

        {/* Back to Home link at bottom (mobile friendly) */}
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

      {/* Optional: Brand watermark */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
        TextileHub • AI Marketplace
      </div>
    </div>
  );
}