import {
  Shirt,
  Sofa,
  Scissors,
  Package,
  Sparkles,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const categories = [
  { name: "Cotton", icon: Shirt, count: "120+", color: "from-blue-500 to-cyan-400" },
  { name: "Silk", icon: Sparkles, count: "85+", color: "from-purple-500 to-pink-400" },
  { name: "Denim", icon: ShoppingBag, count: "95+", color: "from-indigo-600 to-blue-500" },
  { name: "Linen", icon: Package, count: "70+", color: "from-emerald-500 to-teal-400" },
  { name: "Upholstery", icon: Sofa, count: "60+", color: "from-orange-500 to-amber-400" },
  { name: "Custom", icon: Scissors, count: "40+", color: "from-rose-500 to-pink-400" },
];

export default function Categories() {
  return (
    <section
  id="categories"
  className="py-10 bg-gradient-to-b from-white to-gray-50"
>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-600 px-4 py-2 rounded-full text-sm font-semibold">
            <Sparkles size={16} />
            Categories
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
            Shop by Fabric
          </h2>

          <p className="mt-3 text-gray-600">
            Explore premium fabrics from trusted suppliers.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileHover={{ y: -6, scale: 1.03 }}
                className="group"
              >
                <Link
                  to="/marketplace"
                  className="block bg-white border rounded-xl p-4 text-center shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className={`mx-auto w-12 h-12 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon size={22} className="text-white" />
                  </div>

                  <h3 className="mt-3 font-semibold text-gray-900 text-sm">
                    {item.name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    {item.count} Products
                  </p>

                  {/* Decorative line */}
                  <div className={`mt-3 h-0.5 w-8 mx-auto rounded-full bg-gradient-to-r ${item.color} opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:w-12`} />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <Link
            to="/marketplace"
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:-translate-y-1 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md"
          >
            Explore Marketplace
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}