"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);

    // You can integrate this with your backend API or a service like Formspree, EmailJS, etc.
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16 px-6">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-extrabold text-green-400">
          Contact <span className="text-white">Us</span>
        </h1>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Have questions, feedback, or ideas? We’d love to hear from you!
        </p>
      </motion.div>

      {/* Contact Form */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg mx-auto bg-gray-800/90 p-8 rounded-2xl shadow-lg border border-gray-700"
      >
        {submitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-green-400 font-semibold text-lg"
          >
            ✅ Thank you! Your message has been sent successfully.
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-300 font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-300 font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-gray-300 font-medium"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full mt-2 p-3 rounded-lg bg-gray-900 border border-gray-700 text-white focus:ring-2 focus:ring-green-400 focus:outline-none"
              ></textarea>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-500 text-white font-semibold py-3 rounded-lg hover:bg-green-600 transition"
            >
              Send Message
            </motion.button>
          </form>
        )}
      </motion.div>

      {/* Contact Info */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-16"
      >
        <h2 className="text-2xl font-semibold text-green-400 mb-4">
          Get in Touch
        </h2>
        <p className="text-gray-400">
          📧 Email:{" "}
          <a
            href="mailto:support@airecipes.com"
            className="text-green-400 hover:underline"
          >
            support@airecipes.com
          </a>
        </p>
        <p className="text-gray-400 mt-2">
          🌍 Address: 123 AI Street, Food City, India
        </p>
      </motion.div>
    </section>
  );
}
