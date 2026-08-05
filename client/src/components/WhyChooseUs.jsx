import {
  ShieldCheck,
  Truck,
  Bot,
  BadgeCheck,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: <ShieldCheck size={24} />,
    title: "Verified Suppliers",
    desc: "Connect with trusted suppliers verified for quality and reliability.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: <Bot size={24} />,
    title: "AI Price Prediction",
    desc: "Estimate fabric prices using AI for smarter purchasing decisions.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: <Truck size={24} />,
    title: "Easy Order Tracking",
    desc: "Track every order and shipment from one centralized dashboard.",
    color: "from-green-500 to-emerald-600",
  },
  {
    icon: <BadgeCheck size={24} />,
    title: "Premium Quality",
    desc: "Source premium textile materials from verified manufacturers.",
    color: "from-orange-500 to-red-500",
  },
];

export default function WhyChooseUs() {
  return (
    <section id="about" className="py-12 bg-white">
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
            Why Choose Us
          </span>

          <h2 className="mt-4 text-3xl md:text-4xl font-bold text-gray-900">
            Why Businesses Choose Us
          </h2>

          <p className="mt-3 text-gray-600">
            TextileHub simplifies sourcing with trusted suppliers and AI-powered tools.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -4 }}
              className="group rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r ${item.color} text-white shadow-md transition duration-300 group-hover:scale-110 group-hover:rotate-3`}
              >
                {item.icon}
              </div>

              <h3 className="mt-4 font-semibold text-gray-900 text-sm">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                {item.desc}
              </p>

              {/* Decorative line */}
              <div className={`mt-4 h-0.5 w-8 rounded-full bg-gradient-to-r ${item.color} opacity-40 transition-all duration-300 group-hover:w-12 group-hover:opacity-100`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-10 grid grid-cols-3 gap-4 rounded-xl bg-gray-50 border border-gray-200 p-5"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-indigo-600">500+</h3>
            <p className="text-xs text-gray-500">Buyers</p>
          </div>
          <div className="text-center border-x border-gray-200">
            <h3 className="text-2xl font-bold text-violet-600">120+</h3>
            <p className="text-xs text-gray-500">Suppliers</p>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-purple-600">98%</h3>
            <p className="text-xs text-gray-500">Satisfaction</p>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-10 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-6 shadow-lg"
        >
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-white">
                Ready to Grow Your Business?
              </h2>
              <p className="text-sm text-indigo-100">
                Join thousands using AI to discover products and manage orders.
              </p>
            </div>

            <Link
              to="/register"
              className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-indigo-600 shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              Get Started
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  );
}