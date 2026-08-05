import { Link } from "react-router-dom";
import { Eye, Star, Store, ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const products = [
  {
    id: 1,
    name: "Premium Cotton",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800",
    price: "₹220/m",
    supplier: "ABC Textiles",
    category: "Cotton",
    rating: 4.8,
    reviews: 120,
  },
  {
    id: 2,
    name: "Blue Denim",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800",
    price: "₹350/m",
    supplier: "Denim House",
    category: "Denim",
    rating: 4.7,
    reviews: 95,
  },
  {
    id: 3,
    name: "Luxury Silk",
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
    price: "₹720/m",
    supplier: "Silk World",
    category: "Silk",
    rating: 4.9,
    reviews: 85,
  },
  {
    id: 4,
    name: "Linen Fabric",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800",
    price: "₹280/m",
    supplier: "Natural Fabrics",
    category: "Linen",
    rating: 4.6,
    reviews: 70,
  },
];

export default function FeaturedProducts() {
  return (
    <section id="products" className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            Featured
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">
            Featured Fabrics
          </h2>
          <p className="text-gray-600 mt-2">
            Premium textiles from verified suppliers.
          </p>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {products.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <span className="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {item.category}
                </span>

                {/* Quick view overlay */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Link
                    to={`/product/${item.id}`}
                    className="bg-white text-indigo-600 p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Eye size={18} />
                  </Link>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1.5">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < Math.floor(item.rating) ? "currentColor" : "none"}
                        className={i < Math.floor(item.rating) ? "text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-700 ml-1">
                    {item.rating}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({item.reviews})
                  </span>
                </div>

                {/* Supplier */}
                <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500">
                  <Store size={13} />
                  {item.supplier}
                </div>

                {/* Price & Action */}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="font-bold text-indigo-600 text-lg">
                    {item.price}
                  </span>

                  <Link
                    to={`/product/${item.id}`}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <Eye size={15} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Link
            to="/marketplace"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:-translate-y-1 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md"
          >
            View Marketplace
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}