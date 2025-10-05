"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Home, Utensils, Info, LogOut } from "lucide-react";
import Link from "next/link";


export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-5 left-5 z-50 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay (dark background when sidebar open) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-50 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-green-600">RecipeAI</h2>
          <button onClick={toggleSidebar}>
            <X className="text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-6 py-6 space-y-4">
          <Link
            href="#hero"
            className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
            onClick={toggleSidebar}
          >
            <Home size={20} /> Home
          </Link>
          <Link
            href="#features"
            className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
            onClick={toggleSidebar}
          >
            <Utensils size={20} /> Features
          </Link>
          <Link
            href="#about"
            className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
            onClick={toggleSidebar}
          >
            <Info size={20} /> About
          </Link>
          <button
            className="flex items-center gap-3 text-gray-700 hover:text-red-500 transition-colors"
            onClick={() => {
              alert("Logging out...");
              toggleSidebar();
            }}
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t text-sm text-gray-500">
          © 2025 RecipeAI
        </div>
      </motion.aside>
    </>
  );
}
