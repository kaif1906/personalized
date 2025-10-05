"use client";
import { motion } from "framer-motion";
import React from "react";

const features = [
  {
    icon: "📸",
    title: "Smart Image Recognition",
    description: "Upload an ingredient photo and let AI detect it instantly.",
  },
  {
    icon: "🤖",
    title: "AI Recipe Suggestions",
    description: "Receive 5 personalized recipes tailored to your ingredients.",
  },
  {
    icon: "⚡",
    title: "Quick & Easy",
    description: "Fast recommendations so you can start cooking right away.",
  },
  {
    icon: "🌍",
    title: "Healthy & Global",
    description: "Get dishes from multiple cuisines with healthy options.",
  },
];

export default function FeatureSection() {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-16 px-6 mt-10">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h3 className="text-4xl font-extrabold text-white">
          Our <span className="text-green-400">Features</span>
        </h3>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Smarter cooking with AI-powered recommendations, designed for speed, health, and simplicity.
        </p>
      </motion.div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            whileHover={{ scale: 1.08, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="relative group bg-gray-800/90 p-6 rounded-2xl shadow-lg border border-gray-700 text-center cursor-pointer"
          >
            {/* Glow background on hover */}
            <div className="absolute inset-0 rounded-2xl bg-green-400 opacity-0 group-hover:opacity-10 transition"></div>

            {/* Icon */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="text-5xl mb-4"
            >
              {feature.icon}
            </motion.div>

            {/* Title */}
            <h4 className="mt-2 text-xl font-semibold text-white">
              {feature.title}
            </h4>

            {/* Description */}
            <p className="mt-2 text-gray-400 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
