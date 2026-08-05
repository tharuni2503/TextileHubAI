import { BotMessageSquare, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function FloatingAI() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-5 right-5 z-50"
    >
      <Link
        to="/supplier/price-predictor"
        className="group flex items-center"
      >
        {/* Desktop Label */}
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 0, x: 0 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="hidden md:block mr-3 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 text-sm font-medium text-indigo-600 opacity-0 group-hover:opacity-100 transition-all duration-300"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-600" />
            AI Assistant
          </span>
        </motion.span>

        {/* Floating Button */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ 
            repeat: Infinity, 
            duration: 2.5,
            ease: "easeInOut"
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative h-12 w-12 md:h-14 md:w-14 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg hover:shadow-indigo-400/30 flex items-center justify-center text-white shadow-xl transition-all duration-300"
        >
          <BotMessageSquare size={22} className="md:size-[26px]" />

          {/* Pulse dot */}
          <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-white animate-pulse"></span>

          {/* Ring pulse animation */}
          <span className="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-ping"></span>
        </motion.div>
      </Link>
    </motion.div>
  );
}