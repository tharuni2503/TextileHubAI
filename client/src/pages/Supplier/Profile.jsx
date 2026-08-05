import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import buyerLinks from "../../data/buyerLinks";
import supplierLinks from "../../data/supplierLinks";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Phone,
  Building2,
  Save,
  Camera,
  Loader2,
  CheckCircle,
  Store,
  Briefcase,
} from "lucide-react";

export default function Profile() {
  const { user: authUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    businessName: "",
    email: "",
    role: "buyer",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Determine which links to use based on user role
  const userLinks = authUser?.role === "supplier" ? supplierLinks : buyerLinks;

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/profile");
      const userData = res.data.user || {};
      setForm({
        name: userData.name || "",
        phone: userData.phone || "",
        businessName: userData.businessName || "",
        email: userData.email || "",
        role: userData.role || "buyer",
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to load profile");
      // Set default values if API fails
      setForm({
        name: authUser?.name || "",
        phone: "",
        businessName: "",
        email: authUser?.email || "",
        role: authUser?.role || "buyer",
      });
    } finally {
      setLoading(false);
    }
  };

  const update = async () => {
    // Validate
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.phone.trim() || form.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      setSaving(true);
      setSuccess(false);
      
      await api.put("/user/profile", {
        name: form.name,
        phone: form.phone,
        businessName: form.businessName,
      });
      
      setSuccess(true);
      toast.success("Profile updated successfully!");
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <DashboardLayout links={userLinks}>
        <div className="flex items-center justify-center py-20">
          <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout links={userLinks}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User size={22} className="text-indigo-600" />
            My Profile
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your personal and business information
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-6">
              <User size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full ml-auto">Active</span>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <User size={15} className="text-indigo-600" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  placeholder="Enter your full name"
                  value={form.name || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Mail size={15} className="text-indigo-600" />
                  Email Address
                </label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  value={form.email || ""}
                  disabled
                />
                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Phone size={15} className="text-indigo-600" />
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  name="phone"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  placeholder="Enter phone number"
                  value={form.phone || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Business Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  {form.role === "supplier" ? (
                    <Store size={15} className="text-indigo-600" />
                  ) : (
                    <Building2 size={15} className="text-indigo-600" />
                  )}
                  Business Name
                </label>
                <input
                  name="businessName"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  placeholder="Enter your business name"
                  value={form.businessName || ""}
                  onChange={handleChange}
                />
              </div>

              {/* Role Display */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                  <Briefcase size={15} className="text-indigo-600" />
                  Role
                </label>
                <div className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm bg-gray-50 text-gray-500 cursor-not-allowed capitalize">
                  {form.role || "Buyer"}
                </div>
              </div>
            </div>

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2.5 rounded-lg text-sm border border-green-200"
              >
                <CheckCircle size={16} />
                Profile updated successfully!
              </motion.div>
            )}

            {/* Save Button */}
            <button
              onClick={update}
              disabled={saving}
              className={`mt-6 flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                saving
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {saving ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Save Changes
                </>
              )}
            </button>
          </motion.div>

          {/* Profile Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center">
              <div className="relative inline-block">
                <div className="w-28 h-28 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center text-4xl font-bold shadow-md mx-auto">
                  {getInitials(form.name)}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                  <Camera size={14} className="text-gray-600" />
                </button>
              </div>

              <h3 className="mt-4 font-bold text-gray-900 text-lg">
                {form.name || "User"}
              </h3>
              <p className="text-sm text-gray-500">{form.email || "No email"}</p>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm py-1.5">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {form.role || "Buyer"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-1.5">
                  <span className="text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Active
                  </span>
                </div>
                {form.businessName && (
                  <div className="flex items-center justify-between text-sm py-1.5">
                    <span className="text-gray-500">Business</span>
                    <span className="font-medium text-gray-900 text-sm truncate max-w-[120px]">
                      {form.businessName}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                  Member since {new Date().toLocaleDateString()}
                </p>
              </div>

              {/* Quick action buttons */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
                {form.role === "supplier" ? (
                  <>
                    <button 
                      onClick={() => window.location.href = "/supplier/dashboard"}
                      className="w-full py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => window.location.href = "/supplier/products"}
                      className="w-full py-2 rounded-lg bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition"
                    >
                      Manage Products
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => window.location.href = "/buyer/dashboard"}
                      className="w-full py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                    >
                      Go to Dashboard
                    </button>
                    <button 
                      onClick={() => window.location.href = "/marketplace"}
                      className="w-full py-2 rounded-lg bg-indigo-50 text-sm font-medium text-indigo-600 hover:bg-indigo-100 transition"
                    >
                      Browse Marketplace
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </DashboardLayout>
  );
}