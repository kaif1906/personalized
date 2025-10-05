"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("mission");

  const tabs = {
    mission: {
      title: "Our Mission",
      content:
        "We aim to revolutionize the way people cook and eat. By combining AI with culinary creativity, we provide personalized recipe suggestions, helping you make healthier, smarter, and faster choices in the kitchen.",
    },
    team: {
      title: "Meet the Team",
      content:
        "Our team is a mix of food enthusiasts, AI engineers, and designers who share one vision: making cooking effortless and enjoyable. From brainstorming recipes to fine-tuning AI models, we bring tech and taste together.",
    },
    vision: {
      title: "Our Vision",
      content:
        "We believe AI can make nutrition accessible for everyone. Our vision is to build a global platform that helps people discover, cook, and enjoy meals that fit their lifestyle and culture.",
    },
  };

  const teamMembers = [
    {
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      name: "John Doe",
      role: "AI Engineer",
    },
    {
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      name: "Sarah Smith",
      role: "Product Designer",
    },
    {
      img: "https://randomuser.me/api/portraits/men/76.jpg",
      name: "David Lee",
      role: "Chef & Culinary Expert",
    },
  ];

  return (
    <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 min-h-screen py-16 px-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-5xl font-extrabold text-white mb-6">
          About <span className="text-green-400">Us</span>
        </h1>
        <p className="text-gray-400 text-lg">
          Learn more about our mission, team, and vision to transform cooking
          with AI.
        </p>
      </motion.div>

      {/* Tabs Section */}
      <div className="max-w-4xl mx-auto mt-12">
        <div className="flex justify-center gap-6 flex-wrap">
          {Object.keys(tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab
                  ? "bg-green-500 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {tabs[tab].title}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-gray-800/80 p-8 rounded-2xl shadow-lg border border-gray-700 text-center"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            {tabs[activeTab].title}
          </h2>
          <p className="text-gray-300">{tabs[activeTab].content}</p>
        </motion.div>
      </div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto mt-20"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-10">
          Our <span className="text-green-400">Team</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {teamMembers.map((member, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800/90 p-6 rounded-2xl shadow-lg border border-gray-700 text-center transition"
            >
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-green-400 mb-4">
                <Image
                  src={member.img}
                  alt={member.name}
                  width={100}
                  height={100}
                  className="object-cover"
                />
              </div>
              <h3 className="text-white font-semibold text-lg">
                {member.name}
              </h3>
              <p className="text-gray-400">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mt-20"
      >
        <h2 className="text-3xl font-bold text-white">
          Join Our <span className="text-green-400">Journey</span>
        </h2>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          We’re building the future of AI-powered cooking. If you’d like to
          contribute, collaborate, or just share your feedback — we’d love to
          hear from you!
        </p>

        <Link href="/ContactUs">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-6 px-8 py-3 bg-green-500 text-white font-semibold rounded-xl shadow hover:bg-green-600 transition"
          >
            Contact Us
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
