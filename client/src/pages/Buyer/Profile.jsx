import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import buyerLinks from "../../data/buyerLinks";
import { User, Mail, Phone, Building2, Save, Edit3, Camera } from "lucide-react";

export default function Profile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessName: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/user/profile");
      setForm(res.data.user || {});
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      setSaving(true);
      await api.put("/user/profile", form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.log(err);
      alert("Failed to update profile");
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
              <User size={22} className="text-indigo-600" />
              My Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your personal and business information
            </p>
          </div>
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
            Active
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-3xl"
        >

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white flex items-center justify-center text-3xl font-bold shadow-md">
                {form.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition">
                <Camera size={14} className="text-gray-600" />
              </button>
            </div>
            <h2 className="mt-3 font-semibold text-gray-900">{form.name || "User"}</h2>
            <p className="text-xs text-gray-500">{form.role || "Buyer"}</p>
          </div>

          {/* Form */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <User size={15} className="text-indigo-600" />
                Name
              </label>
              <input
                name="name"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Your name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Mail size={15} className="text-indigo-600" />
                Email
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                value={form.email || ""}
                disabled
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Phone size={15} className="text-indigo-600" />
                Phone
              </label>
              <input
                name="phone"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="Phone number"
              />
            </div>

            {/* Business Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Building2 size={15} className="text-indigo-600" />
                Business Name
              </label>
              <input
                name="businessName"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                value={form.businessName || ""}
                onChange={handleChange}
                placeholder="Your business name"
              />
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm"
            >
              <span className="text-green-500">✓</span>
              Profile updated successfully!
            </motion.div>
          )}

          {/* Save Button */}
          <button
            onClick={saveProfile}
            disabled={saving}
            className={`mt-5 flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              saving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5"
            }`}
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Changes"}
          </button>

        </motion.div>

      </div>
    </DashboardLayout>
  );
}