"use client";
import { motion } from "framer-motion";

export default function PrivacyPolicy() {
  return (
    <section className="min-h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16 px-6">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-green-400 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="text-gray-300 mb-6 text-center">
          Your privacy is important to us. This policy explains how we collect,
          use, and safeguard your information when using our AI Recipe
          Recommendation platform.
        </p>

        <div className="space-y-6 text-gray-400">
          <motion.div whileHover={{ scale: 1.02 }}>
            <h2 className="text-xl font-semibold text-green-300">
              1. Information We Collect
            </h2>
            <p>
              We may collect personal details such as your name, email, and
              uploaded ingredient images to provide personalized recipe
              recommendations.
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <h2 className="text-xl font-semibold text-green-300">
              2. How We Use Your Data
            </h2>
            <p>
              Your data is used only for generating recipes, improving AI
              models, and enhancing your experience. We do not sell or share
              your data with third parties.
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <h2 className="text-xl font-semibold text-green-300">
              3. Data Security
            </h2>
            <p>
              We implement industry-standard measures to keep your information
              safe and secure from unauthorized access.
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <h2 className="text-xl font-semibold text-green-300">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding our Privacy Policy, feel free
              to contact us at{" "}
              <span className="text-green-400">support@airecipes.com</span>.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
