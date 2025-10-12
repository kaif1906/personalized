"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Utensils, ChevronDown, User, LogOut, Settings } from "lucide-react"; // Import new icons

// ----------------------------------------------------------------------
// User Profile Dropdown Component
// ----------------------------------------------------------------------

const ProfileDropdown = ({ userName, handleLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Hook to close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to extract initials from the full name
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
        aria-expanded={isOpen}
      >
        {/* User Avatar/Initials */}
        <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
          {getInitials(userName)}
        </div>
        
        {/* User Name (Visible on large screens) */}
        <span className="hidden lg:inline text-gray-700 font-medium">
          {userName.split(' ')[0]} {/* Display only the first name */}
        </span>
        
        {/* Dropdown Icon */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-20"
        >
          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
            
            {/* User Info Header */}
            <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100 font-semibold truncate">
                Logged in as: {userName}
            </div>

            {/* Profile Link (Example) */}
            <Link 
              href="/profile" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <User className="w-4 h-4 mr-2" />
              Your Profile
            </Link>

            {/* Settings Link (Example) */}
            <Link 
              href="/settings" 
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};


// ----------------------------------------------------------------------
// Main Navbar Component
// ----------------------------------------------------------------------

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("User"); // State for user's name
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const token = localStorage.getItem("token");
        const userJSON = localStorage.getItem("user"); // Get user info from localStorage
        
        setIsLoggedIn(!!token);

        if (token && userJSON) {
          const user = JSON.parse(userJSON);
          setUserName(user.name || "Logged In User");
        } else {
          setUserName("User");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();

    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "user") {
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
      localStorage.removeItem("user"); // Clear user info
      setIsLoggedIn(false);
      setUserName("User");
      router.push("/"); // Use router.push for Next.js navigation
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

          {/* Desktop Navigation & User Section */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-600 transition-colors">
              Home
            </Link>

            <Link href="/recommender" className="text-gray-700 hover:text-green-600 transition-colors">
              Get Recommendations
            </Link>

            {isLoggedIn ? (
              // New: User Profile Dropdown
              <ProfileDropdown 
                userName={userName} 
                handleLogout={handleLogout} 
              />
            ) : (
              // Existing: Login/Signup buttons
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