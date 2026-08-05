import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, ShoppingCart, Heart, Star, Store } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAdded, setShowAdded] = useState(false);

  // Safe access to product properties
  const productId = product?._id || product?.id || "";
  const productName = typeof product?.name === 'string' ? product.name : "Product";
  const productPrice = product?.price || 0;
  const productImage = product?.image || "https://via.placeholder.com/300";
  const productSupplier = typeof product?.supplier === 'string' ? product.supplier : "Verified Supplier";
  const productStock = product?.stock || 0;
  const productRating = product?.rating || 4.8;
  const productReviews = product?.reviews || 120;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      if (isWishlisted) {
        await api.delete(`/wishlist/${productId}`);
        setIsWishlisted(false);
      } else {
        await api.post("/wishlist", { productId });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.log("Wishlist error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.post("/cart", { productId, quantity: 1 });
      setShowAdded(true);
      setTimeout(() => setShowAdded(false), 2000);
    } catch (err) {
      console.log("Cart error:", err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
    >
      {/* Image */}
      <Link to={`/product/${productId}`} className="relative block overflow-hidden">
        <img
          src={productImage}
          alt={productName}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          disabled={isLoading}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 shadow-md hover:scale-110 transition-all duration-300 backdrop-blur-sm z-10"
        >
          <Heart
            size={18}
            className={`transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600 hover:text-red-500"
            }`}
          />
        </button>

        {/* Stock Badge */}
        {productStock > 0 ? (
          <span className="absolute bottom-3 left-3 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow">
            {productStock} Left
          </span>
        ) : (
          <span className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow">
            Out of Stock
          </span>
        )}

        {/* Added to Cart Toast */}
        <AnimatePresence>
          {showAdded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 z-20"
            >
              <span className="text-green-400">✓</span>
              Added to Cart!
            </motion.div>
          )}
        </AnimatePresence>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Supplier */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Store size={13} />
          <span>{productSupplier}</span>
        </div>

        {/* Product Name */}
        <Link to={`/product/${productId}`}>
          <h3 className="mt-1.5 font-semibold text-gray-900 text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
            {productName}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1.5">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={13}
                className={i < Math.floor(productRating) ? "fill-yellow-400" : "text-gray-300"}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-gray-700">{productRating.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({productReviews} Reviews)</span>
        </div>

        {/* Price & Actions */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400">Price</p>
            <span className="text-lg font-bold text-indigo-600">₹{productPrice}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Link
              to={`/product/${productId}`}
              className="p-2 rounded-lg bg-gray-100 hover:bg-indigo-100 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Eye size={16} />
            </Link>
            <button
              onClick={handleAddToCart}
              disabled={productStock === 0}
              className={`p-2 rounded-lg transition-colors shadow-sm ${
                productStock > 0
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}