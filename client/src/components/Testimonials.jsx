import {
  Star,
  Quote,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const reviews = [
  {
    name: "Rahul Textiles",
    role: "Textile Manufacturer",
    review:
      "TextileHub AI helped us find trusted suppliers quickly. The platform is simple, fast and reliable.",
  },
  {
    name: "ABC Garments",
    role: "Garment Exporter",
    review:
      "AI recommendations made sourcing fabrics much easier and saved us valuable procurement time.",
  },
  {
    name: "Fashion House",
    role: "Fashion Brand",
    review:
      "Verified suppliers, clean interface and smooth ordering experience. Highly recommended.",
  },
];

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="py-16 bg-gradient-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Heading */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >

          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-600">

            <Sparkles size={16} />

            Testimonials

          </span>

          <h2 className="mt-4 text-3xl font-bold text-gray-900 md:text-4xl">

            Trusted by Textile Businesses

          </h2>

          <p className="mt-3 text-gray-600">

            Buyers and suppliers rely on TextileHub AI to discover quality fabrics and trusted partners.

          </p>

        </motion.div>

        {/* Cards */}

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {reviews.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -6 }}
              className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-md transition-all hover:shadow-xl"
            >

              {/* Quote */}

              <div className="absolute -top-4 left-6 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">

                <Quote size={18} />

              </div>

              {/* Stars */}

              <div className="mt-4 flex gap-1">

                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                ))}

              </div>

              {/* Review */}

              <p className="mt-4 text-sm leading-7 text-gray-600">

                "{item.review}"

              </p>

              {/* User */}

              <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-lg font-bold text-white">

                  {item.name.charAt(0)}

                </div>

                <div>

                  <h3 className="font-semibold text-gray-900">

                    {item.name}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {item.role}

                  </p>

                </div>

              </div>

            </motion.div>
          ))}

        </div>

        {/* CTA */}

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >

          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700"
          >

            Join Our Marketplace

            <ArrowRight
              size={18}
              className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-indigo-700"
            />

          </Link>

        </motion.div>

      </div>

    </section>

  );
}