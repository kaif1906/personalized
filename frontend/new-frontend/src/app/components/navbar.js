"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react"; // 🍴 Icon for your brand

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        checkLoginStatus();
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      alert("Error during logout. Please try again.");
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2 group">
              {/* Animated Icon */}
              <motion.div
                whileHover={{ rotate: 20, scale: 1.2 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="bg-green-100 p-2 rounded-full"
              >
                <Utensils className="w-6 h-6 text-green-600" />
              </motion.div>

              {/* Brand Text */}
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-xl font-extrabold text-green-600 tracking-wide"
              >
                RecipeAI
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>

            <Link href="/recommender" className="text-gray-700 hover:text-green-600 transition-colors">
              Get Recommendations
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-green-600 transition-colors">
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
