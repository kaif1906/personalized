"use client"; // required because we use hooks
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FeatureSection from "../components/FeatureSection";
import Sidebar from "../components/Sidebar";
import HowItWorksSection from "../components/HowItWorksSection";
import PopularRecipesSection from "../components/PopularRecipesSection";
import Image from "next/image";

export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Ensure client-side rendering after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Check if user is logged in
  const isLoggedIn = () => {
    if (!isClient) return false;
    const token = localStorage.getItem('token');
    return !!token;
  };

  // Handle Get Started button click
  const handleGetStarted = () => {
    if (isLoggedIn()) {
      router.push('/recommender');
    } else {
      router.push('/login');
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image && !prompt) {
      alert("Please upload an ingredient image or enter a prompt.");
      return;
    }

    const formData = new FormData();
    formData.append("prompt", prompt);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/recipes", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch recipes");
      }

      const data = await res.json();
      setRecipes(data.recipes || []);

      // Clear form after successful submission
      setPrompt("");
      setImage(null);
      setPreview(null);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      alert("Something went wrong while generating recipes: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center text-center overflow-hidden">

        {/* Background Image (Optimized) */}
        <Image
          src="/images/pexels-photo-5202112.webp"
          alt="Healthy food ingredients"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        {/* White overlay for contrast */}
        <div className="absolute inset-0 bg-gray-600/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-3xl px-6 sm:px-8">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 drop-shadow-lg"
          >
            🍲 AI-Based Recipe Recommendation
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 text-lg sm:text-xl text-gray-700 leading-relaxed"
          >
            Discover smart, personalized recipes crafted by AI.  
            Simply provide your available ingredients, and our system will  
            recommend healthy and tasty dishes just for you.
          </motion.p>

          {/* Get Started Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10"
          >
            <button
              onClick={handleGetStarted}
              className="inline-block bg-green-500 hover:bg-green-600 text-black/70 font-semibold px-8 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
              suppressHydrationWarning
            >
              Get Started
            </button>
          </motion.div>
        </div>

        {/* Subtle glow effects */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.25, y: 0 }}
          transition={{ duration: 2, repeat: 1, repeatType: "reverse" }}
          className="absolute w-40 h-40 bg-green-400/20 rounded-full top-10 left-10 blur-xl"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 0.25, y: 0 }}
          transition={{ duration: 2, delay: 1, repeat: 1, repeatType: "reverse" }}
          className="absolute w-32 h-32 bg-yellow-400/20 rounded-full bottom-20 right-20 blur-xl"
        ></motion.div>
      </section>

      {/* Interactive Features Section */}
      <PopularRecipesSection />
      <FeatureSection />
      <HowItWorksSection />
    </>
  );
}
