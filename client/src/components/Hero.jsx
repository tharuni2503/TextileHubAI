import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Bot,
  Layers3,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroImage from "../assets/images/hero.jpg";

const features = [
  {
    icon: <ShieldCheck size={18} />,
    title: "Verified",
    subtitle: "Suppliers",
  },
  {
    icon: <Bot size={18} />,
    title: "AI",
    subtitle: "Recommendations",
  },
  {
    icon: <Layers3 size={18} />,
    title: "Multiple",
    subtitle: "Categories",
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-18 lg:pt-10 pb-1">

      <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl"/>

      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl"/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* LEFT */}

          <motion.div
            initial={{opacity:0,y:25}}
            animate={{opacity:1,y:0}}
            transition={{duration:.6}}
            className="text-center lg:text-left"
          >

            {/* Badge */}

            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2">

              <Sparkles
                size={15}
                className="text-indigo-600"
              />

              <span className="text-sm font-semibold text-indigo-700">

                AI Powered Textile Marketplace

              </span>

            </div>

            {/* Heading */}

            <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
  India's Smart
  <span className="block text-indigo-600">
    Textile Marketplace
  </span>
</h1>

            <p className="mt-5 text-gray-600 max-w-xl mx-auto lg:mx-0 text-lg leading-8">

              Discover premium fabrics, connect with verified suppliers,
              receive AI-powered recommendations and manage textile orders
              through one modern B2B marketplace.

            </p>

            {/* Buttons */}

            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">

              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700"
              >

                Explore Marketplace

                <ArrowRight size={18}/>

              </Link>

              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-indigo-600 hover:text-indigo-600"
              >

                Become Supplier

              </Link>

            </div>

            {/* Features */}

            <div className="mt-10 grid grid-cols-3 gap-4">

              {features.map((item)=>(
                <motion.div

                  whileHover={{y:-5}}

                  key={item.title}

                  className="rounded-2xl border bg-white p-4 shadow-sm"
                >

                  <div className="text-indigo-600">

                    {item.icon}

                  </div>

                  <h3 className="mt-2 font-bold">

                    {item.title}

                  </h3>

                  <p className="text-sm text-gray-500">

                    {item.subtitle}

                  </p>

                </motion.div>
              ))}

            </div>

          </motion.div>
                    {/* Right Image */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* Main Image */}

            <div className="overflow-hidden rounded-3xl shadow-2xl border border-gray-100">

              <img
                src={heroImage}
                alt="Textile Marketplace"
                className="w-full h-[360px] sm:h-[430px] lg:h-[500px] object-cover"
              />

            </div>

            {/* AI Card */}

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute bottom-5 left-5 hidden md:block bg-white rounded-2xl shadow-xl p-4 max-w-[240px]"
            >

              <div className="flex items-center gap-2">

                <Bot
                  size={18}
                  className="text-indigo-600"
                />

                <h3 className="font-semibold text-sm">

                  AI Recommendation

                </h3>

              </div>

              <p className="text-xs text-gray-500 mt-2">

                Best Match

              </p>

              <h4 className="font-bold mt-1">

                Premium Cotton Fabric

              </h4>

              <p className="text-indigo-600 font-semibold text-sm">

                ₹220 / Meter

              </p>

            </motion.div>

            {/* Verified Supplier */}

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
              }}
              className="absolute top-5 right-5 hidden md:flex items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg"
            >

              <ShieldCheck
                size={18}
                className="text-green-500"
              />

              <div>

                <h4 className="text-sm font-semibold">

                  Verified Supplier

                </h4>

                <p className="text-xs text-gray-500">

                  Trusted Business

                </p>

              </div>

            </motion.div>

            {/* Categories */}

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
              }}
            >
            </motion.div>

          </motion.div>

        </div>

      </div>

    </section>

  );
}