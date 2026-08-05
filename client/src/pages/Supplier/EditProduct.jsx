import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import supplierLinks from "../../data/supplierLinks";
import toast from "react-hot-toast";
import {
  Package,
  Plus,
  Image,
  Tag,
  FileText,
  IndianRupee,
  Layers,
  Palette,
  Sparkles,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    moq: "",
    colors: "",
    image: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price || parseFloat(form.price) <= 0) newErrors.price = "Valid price is required";
    if (!form.stock || parseInt(form.stock) < 0) newErrors.stock = "Valid stock quantity is required";
    if (!form.moq || parseInt(form.moq) < 1) newErrors.moq = "MOQ must be at least 1";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        moq: parseInt(form.moq),
        colors: form.colors ? form.colors.split(",").map(c => c.trim()).filter(Boolean) : [],
      };

      await api.post("/products", productData);

      toast.success("Product Added Successfully! 🎉");
      navigate("/supplier/products");
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "Cotton", "Silk", "Denim", "Linen", "Wool", "Polyester", "Upholstery", "Custom"
  ];

  return (
    <DashboardLayout links={supplierLinks}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Plus size={22} className="text-indigo-600" />
              Add New Product
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Add a new product to your inventory
            </p>
          </div>
          <span className="text-sm bg-green-100 text-green-700 px-3 py-1.5 rounded-full font-medium">
            <Package size={14} className="inline mr-1" />
            New Product
          </span>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 max-w-3xl"
        >
          <div className="grid md:grid-cols-2 gap-5">

            {/* Product Name */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Tag size={15} className="text-indigo-600" />
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                placeholder="Enter product name"
                value={form.name}
                onChange={handleChange}
                className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition`}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Tag size={15} className="text-indigo-600" />
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full border ${errors.category ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white`}
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.category}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <IndianRupee size={15} className="text-indigo-600" />
                Price <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                placeholder="0.00"
                value={form.price}
                onChange={handleChange}
                className={`w-full border ${errors.price ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition`}
                step="0.01"
              />
              {errors.price && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.price}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Layers size={15} className="text-indigo-600" />
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                name="stock"
                type="number"
                placeholder="Quantity"
                value={form.stock}
                onChange={handleChange}
                className={`w-full border ${errors.stock ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition`}
                min="0"
              />
              {errors.stock && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.stock}
                </p>
              )}
            </div>

            {/* MOQ */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Package size={15} className="text-indigo-600" />
                MOQ <span className="text-red-500">*</span>
              </label>
              <input
                name="moq"
                type="number"
                placeholder="1"
                value={form.moq}
                onChange={handleChange}
                className={`w-full border ${errors.moq ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition`}
                min="1"
              />
              {errors.moq && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.moq}
                </p>
              )}
            </div>

            {/* Colors */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Palette size={15} className="text-indigo-600" />
                Colors
              </label>
              <input
                name="colors"
                placeholder="White, Blue, Black"
                value={form.colors}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
              <p className="text-xs text-gray-400 mt-1">Separate colors with commas</p>
            </div>

            {/* Image URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <Image size={15} className="text-indigo-600" />
                Image URL
              </label>
              <input
                name="image"
                placeholder="https://example.com/image.jpg"
                value={form.image}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1.5">
                <FileText size={15} className="text-indigo-600" />
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                placeholder="Describe your product in detail..."
                rows="4"
                value={form.description}
                onChange={handleChange}
                className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-200'} rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition resize-none`}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.description}
                </p>
              )}
            </div>

          </div>

          {/* Image Preview */}
          {form.image && (
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview</p>
              <div className="relative inline-block">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-32 h-32 rounded-xl object-cover border border-gray-200"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/128";
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setForm({ ...form, image: "" });
                  }}
                  className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-md"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Product
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate("/supplier/products")}
              className="px-6 py-3 rounded-xl border border-gray-200 text-gray-700 font-medium text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

        </motion.form>

      </div>
    </DashboardLayout>
  );
}