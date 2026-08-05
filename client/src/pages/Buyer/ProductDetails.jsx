import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../services/api";
import {
  ShoppingCart,
  Heart,
  Package,
  Palette,
  Truck,
  Store,
  ArrowLeft,
  CheckCircle,
  Share2,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${id}`);
      setProduct(res.data.product);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    try {
      await api.post("/cart", {
        productId: product._id,
        quantity: quantity,
      });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.log(err);
      alert("Unable to add to cart");
    }
  };

  const addToWishlist = async () => {
    try {
      await api.post("/wishlist", {
        productId: product._id,
      });
      setIsWishlisted(true);
      setTimeout(() => setIsWishlisted(false), 3000);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-10 w-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Product not found</h2>
          <Link to="/marketplace" className="text-indigo-600 hover:underline mt-2 inline-block">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Back Button */}
      <Link
        to="/marketplace"
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600 transition mb-6"
      >
        <ArrowLeft size={16} />
        Back to Marketplace
      </Link>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4"
        >
          <img
            src={product.image || "https://via.placeholder.com/600x600"}
            alt={product.name}
            className="w-full h-[400px] lg:h-[500px] object-cover rounded-xl"
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Category Badge */}
          <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
            {product.category || "Textile"}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            {product.name}
          </h1>

          <p className="text-gray-600 leading-7 mt-4 text-sm">
            {product.description || "Premium quality textile product."}
          </p>

          {/* Price */}
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-indigo-600">
              ₹{product.price}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Per Unit</p>
          </div>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                -
              </button>
              <span className="w-10 text-center font-medium text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Package size={18} className="text-indigo-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Stock</h3>
              <p className="text-sm text-gray-600">{product.stock || 0} units</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Truck size={18} className="text-green-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">MOQ</h3>
              <p className="text-sm text-gray-600">{product.moq || 1}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Palette size={18} className="text-pink-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Colors</h3>
              <p className="text-sm text-gray-600">
                {product.colors?.join(", ") || "N/A"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <Store size={18} className="text-orange-600 mb-2" />
              <h3 className="font-semibold text-sm text-gray-900">Supplier</h3>
              <p className="text-sm text-gray-600">
                {product.supplier?.businessName || product.supplier?.name || "Verified"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={addToCart}
              disabled={product.stock === 0}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${
                product.stock > 0
                  ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={18} />
              {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>

            <button
              onClick={addToWishlist}
              className={`px-5 py-3 rounded-xl border transition-all ${
                isWishlisted
                  ? "bg-pink-50 border-pink-200 text-pink-600"
                  : "border-gray-200 text-gray-600 hover:border-pink-300 hover:text-pink-600"
              }`}
            >
              <Heart size={18} className={isWishlisted ? "fill-pink-500" : ""} />
            </button>
          </div>

          {/* Added to Cart Success */}
          {addedToCart && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg text-sm"
            >
              <CheckCircle size={16} />
              Added to cart successfully!
            </motion.div>
          )}

          {isWishlisted && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 flex items-center gap-2 text-pink-600 bg-pink-50 px-4 py-2 rounded-lg text-sm"
            >
              <Heart size={16} className="fill-pink-500" />
              Added to wishlist!
            </motion.div>
          )}
        </motion.div>

      </div>

      {/* Description Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-8"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Product Description
        </h2>
        <p className="text-gray-600 leading-7 text-sm">
          {product.description || "No description available for this product."}
        </p>
      </motion.div>

    </div>
  );
}