import { Link } from "react-router-dom";
import { Home, PackageSearch } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-violet-50 px-6 py-20">

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full rounded-3xl bg-white shadow-2xl border border-gray-100 p-10 text-center"
      >

        {/* Icon */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-indigo-100"
        >
          <PackageSearch
            size={42}
            className="text-indigo-600"
          />
        </motion.div>

        {/* 404 */}

        <h1 className="mt-8 text-7xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          404
        </h1>

        <h2 className="mt-3 text-3xl font-bold text-gray-900">
          Page Not Found
        </h2>

        <p className="mt-4 text-gray-600 leading-7">
          Sorry, we couldn't find the page you're looking for.
          It may have been moved or doesn't exist.
        </p>

        {/* Button */}

        <Link
          to="/"
          className="inline-flex items-center gap-2 mt-8 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700"
        >
          <Home size={18} />
          Back to Home
        </Link>

      </motion.div>

    </section>
  );
}