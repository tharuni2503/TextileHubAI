import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import supplierLinks from "../../data/supplierLinks";
import toast from "react-hot-toast";
import {
  Sparkles,
  TrendingUp,
  IndianRupee,
  Ruler,
  Layers,
  Calendar,
  BarChart3,
  Zap,
  AlertCircle,
  Loader2,
  Brain,
  Shield,
} from "lucide-react";

export default function PricePredictor() {
  const [form, setForm] = useState({
    fabricType: "",
    material: "",
    gsm: "",
    quality: "Premium",
    demand: "Medium",
    season: "Summer",
  });

  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predictPrice = async () => {
    // Validate
    if (!form.fabricType.trim()) {
      toast.error("Please enter fabric type");
      return;
    }
    if (!form.material) {
      toast.error("Please select material");
      return;
    }
    if (!form.gsm || parseInt(form.gsm) <= 0) {
      toast.error("Please enter valid GSM");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setPrice(null);

      // Request the rule-based estimate from the API
      const res = await api.post("/ai/predict-price", form);
      
      setPrice(Number(res.data.predictedPrice));
      toast.success("Price estimate calculated.");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Price estimate failed. Please try again.");
      toast.error("Failed to estimate price");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear previous price when form changes
    if (price) setPrice(null);
    if (error) setError(null);
  };

  // Sample products for quick fill
  const sampleProducts = [
    { name: "Premium Cotton", material: "Cotton", gsm: "180", quality: "Premium", demand: "High", season: "Summer" },
    { name: "Luxury Silk", material: "Silk", gsm: "120", quality: "Luxury", demand: "Medium", season: "All Season" },
    { name: "Heavy Denim", material: "Denim", gsm: "350", quality: "Standard", demand: "High", season: "Winter" },
    { name: "Light Linen", material: "Linen", gsm: "200", quality: "Premium", demand: "Medium", season: "Summer" },
  ];

  const fillSample = (sample) => {
    setForm({
      fabricType: sample.name,
      material: sample.material,
      gsm: sample.gsm,
      quality: sample.quality,
      demand: sample.demand,
      season: sample.season,
    });
    setPrice(null);
    setError(null);
  };

  return (
    <DashboardLayout links={supplierLinks}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain size={22} className="text-indigo-600" />
            Fabric Price Estimator
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Get an indicative estimate from fabric specifications and pricing rules
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Enter Fabric Details</h2>
              <span className="text-xs bg-gradient-to-r from-indigo-100 to-violet-100 text-indigo-700 px-2 py-0.5 rounded-full ml-auto">Rule-based estimate</span>
            </div>

            {/* Sample Products */}
            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-2">Quick fill with examples:</p>
              <div className="flex flex-wrap gap-2">
                {sampleProducts.map((sample, idx) => (
                  <button
                    key={idx}
                    onClick={() => fillSample(sample)}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition text-gray-600 hover:text-indigo-600"
                  >
                    {sample.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {/* Fabric Type */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Layers size={15} className="text-indigo-600" />
                  Fabric Type <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="fabricType"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  placeholder="e.g., Cotton Fabric, Silk Blend"
                  value={form.fabricType}
                  onChange={handleChange}
                />
              </div>

              {/* Material */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Sparkles size={15} className="text-indigo-600" />
                  Material <span className="text-red-500">*</span>
                </label>
                <select
                  name="material"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
                  value={form.material}
                  onChange={handleChange}
                >
                  <option value="">Select Material</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Linen">Linen</option>
                  <option value="Silk">Silk</option>
                  <option value="Denim">Denim</option>
                  <option value="Polyester">Polyester</option>
                  <option value="Wool">Wool</option>
                  <option value="Viscose">Viscose</option>
                  <option value="Nylon">Nylon</option>
                </select>
              </div>

              {/* GSM */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Ruler size={15} className="text-indigo-600" />
                  GSM <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="gsm"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition"
                  placeholder="e.g., 200"
                  value={form.gsm}
                  onChange={handleChange}
                />
                <p className="text-xs text-gray-400 mt-1">Typical range: 100-500 GSM</p>
              </div>

              {/* Quality */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Shield size={15} className="text-indigo-600" />
                  Quality
                </label>
                <select
                  name="quality"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
                  value={form.quality}
                  onChange={handleChange}
                >
                  <option value="Standard">Standard</option>
                  <option value="Premium">Premium</option>
                  <option value="Luxury">Luxury</option>
                </select>
              </div>

              {/* Demand */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <BarChart3 size={15} className="text-indigo-600" />
                  Market Demand
                </label>
                <select
                  name="demand"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
                  value={form.demand}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                  <Calendar size={15} className="text-indigo-600" />
                  Season
                </label>
                <select
                  name="season"
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition bg-white"
                  value={form.season}
                  onChange={handleChange}
                >
                  <option value="Summer">Summer</option>
                  <option value="Winter">Winter</option>
                  <option value="Rainy">Rainy</option>
                  <option value="All Season">All Season</option>
                </select>
              </div>
            </div>

            {/* Predict Button */}
            <button
              onClick={predictPrice}
              disabled={loading}
              className={`mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                loading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain size={18} />
                  Estimate Price
                </>
              )}
            </button>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-4">
              <IndianRupee size={18} className="text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-900">Price Estimate</h2>
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full ml-auto">Indicative</span>
            </div>

            {loading ? (
              <div className="flex-1 flex items-center justify-center flex-col gap-4">
                <div className="h-16 w-16 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
                <p className="text-gray-500 text-sm">Analyzing fabric details...</p>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center">
                <AlertCircle size={48} className="text-red-300" />
                <p className="text-gray-600 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-indigo-600 text-sm font-medium hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : price ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 w-full border border-green-100">
                  <p className="text-sm text-gray-600 mb-2">Suggested Selling Price</p>
                  <p className="text-5xl font-bold text-green-700">
                    ₹{price}
                    <span className="text-lg font-normal text-gray-500 ml-1">/meter</span>
                  </p>

                </div>

                {/* Summary of inputs */}
                <div className="mt-4 grid grid-cols-3 gap-2 w-full">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">Quality</p>
                    <p className="text-sm font-medium">{form.quality}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">Demand</p>
                    <p className="text-sm font-medium">{form.demand}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-[10px] text-gray-400">GSM</p>
                    <p className="text-sm font-medium">{form.gsm}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-400 mt-4">
                  This indicative estimate uses predefined pricing rules. It is not a live market quote or a trained machine-learning prediction.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center flex-col gap-3 text-center">
                <div className="p-4 rounded-full bg-gradient-to-r from-indigo-100 to-violet-100">
                  <Brain size={32} className="text-indigo-400" />
                </div>
                <p className="text-gray-500 text-sm">
                  Fill in the fabric details and click <strong>"Estimate Price"</strong>
                </p>
                <p className="text-xs text-gray-400">
                  Your fabric details will be used to calculate an indicative estimate
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 grid grid-cols-1 sm:grid-cols-4 gap-4"
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-indigo-50">
                <Brain size={20} className="text-indigo-600" />
              </div>
            </div>
            <h4 className="font-semibold text-sm text-gray-900">Rule-based estimate</h4>
            <p className="text-xs text-gray-500">A transparent baseline from entered details</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-green-50">
                <TrendingUp size={20} className="text-green-600" />
              </div>
            </div>
            <h4 className="font-semibold text-sm text-gray-900">Market Analysis</h4>
            <p className="text-xs text-gray-500">Demand level influences the estimate</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-purple-50">
                <IndianRupee size={20} className="text-purple-600" />
              </div>
            </div>
            <h4 className="font-semibold text-sm text-gray-900">Smart Pricing</h4>
            <p className="text-xs text-gray-500">Optimize your pricing strategy</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <div className="flex justify-center mb-2">
              <div className="p-2 rounded-full bg-amber-50">
                <Shield size={20} className="text-amber-600" />
              </div>
            </div>
            <h4 className="font-semibold text-sm text-gray-900">Confidence Score</h4>
            <p className="text-xs text-gray-500">Know the accuracy of predictions</p>
          </div>
        </motion.div>

      </div>
    </DashboardLayout>
  );
}