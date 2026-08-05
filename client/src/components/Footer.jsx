import {
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 flex items-center justify-center shadow-md">
                <ShoppingBag className="text-white" size={18} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  TextileHub
                </h2>
                <p className="text-[10px] text-indigo-400 font-semibold">
                  Marketplace
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm text-gray-400 leading-relaxed">
              Connecting buyers and suppliers through an AI-powered textile marketplace.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">
              Quick Links
            </h3>

            <ul className="space-y-1.5 text-sm">
              <li><a href="#categories" className="text-gray-400 hover:text-indigo-400 transition">Categories</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-indigo-400 transition">Products</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-indigo-400 transition">About</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-indigo-400 transition">Reviews</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">
              Contact
            </h3>

            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5 text-gray-400">
                <Mail size={15} className="text-indigo-400" />
                support@textilehub.ai
              </div>

              <div className="flex items-center gap-2.5 text-gray-400">
                <Phone size={15} className="text-indigo-400" />
                +91 98765 43210
              </div>

              <div className="flex items-center gap-2.5 text-gray-400">
                <MapPin size={15} className="text-indigo-400" />
                Hyderabad, India
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">
              Follow Us
            </h3>

            <div className="flex gap-2.5">
              <a href="#" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all duration-300 hover:scale-105">
                <FaFacebookF size={14} />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:scale-105">
                <FaInstagram size={14} />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-sky-600 hover:text-white transition-all duration-300 hover:scale-105">
                <FaLinkedinIn size={14} />
              </a>
              <a href="#" className="p-2.5 rounded-lg bg-gray-800 text-gray-400 hover:bg-cyan-600 hover:text-white transition-all duration-300 hover:scale-105">
                <FaTwitter size={14} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 mt-8 pt-5 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} TextileHub • All Rights Reserved
        </div>

      </div>
    </footer>
  );
}