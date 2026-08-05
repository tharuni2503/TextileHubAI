import { useState } from "react";
import { motion } from "framer-motion";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout({
  children,
  links,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-indigo-50">

      {/* Sidebar */}
      <Sidebar
        links={links}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Topbar */}
        <Topbar setSidebarOpen={setSidebarOpen} />

        {/* Page */}
        <motion.main
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-10"
        >
          <div className="mx-auto max-w-7xl">

            {children}

          </div>
        </motion.main>

      </div>

    </div>
  );
}