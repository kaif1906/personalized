"use client";
import { motion } from "framer-motion";
import { Upload, Sparkles, Utensils } from "lucide-react";

const steps = [
  {
    icon: <Upload size={42} />,
    title: "Upload Ingredients",
    description: "Snap a photo or type your available ingredients for the AI to detect.",
  },
  {
    icon: <Sparkles size={42} />,
    title: "AI Generates Recipes",
    description: "Get personalized recipes instantly, tailored to your input.",
  },
  {
    icon: <Utensils size={42} />,
    title: "Cook & Enjoy",
    description: "Follow simple instructions and enjoy your delicious meal.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 py-16 px-6 mt-10 mb-10">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h3 className="text-4xl font-extrabold text-white">
          How It <span className="text-green-400">Works</span>
        </h3>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Cooking smarter is simple! Just follow these 3 easy steps and let AI do the hard work for you.
        </p>
      </motion.div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {steps.map((step, idx) => (
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
              className="flex justify-center mb-4 text-green-400"
            >
              {step.icon}
            </motion.div>

            {/* Title */}
            <h4 className="mt-2 text-xl font-semibold text-white">
              {step.title}
            </h4>

            {/* Description */}
            <p className="mt-2 text-gray-400 text-sm">{step.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
