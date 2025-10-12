"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const recipes = [
  {
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    title: "Avocado Toast",
    description: "A quick healthy snack packed with fiber and good fats.",
  },
  {
    img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&q=80",
    title: "Veggie Pasta",
    description: "Delicious pasta tossed with seasonal vegetables.",
  },
  {
    img: "https://images.unsplash.com/photo-1701579231378-3726490a407b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ✅ Shahi Paneer
    title: "Shahi Paneer",
    description: "A rich and creamy North Indian curry made with paneer in a spiced tomato-cashew gravy.",
  },
  {
    img: "https://images.unsplash.com/photo-1728910107534-e04e261768ae?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", // ✅ Butter Chicken
    title: "Butter Chicken",
    description: "Tender chicken simmered in a velvety tomato-butter sauce, a true Mughlai classic.",
  },
];




export default function PopularRecipesSection() {
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
          Popular <span className="text-green-400">Recipes</span>
        </h3>
        <p className="text-gray-400 mt-3 max-w-2xl mx-auto">
          Check out some trending AI-powered recipes loved by our users.
        </p>
      </motion.div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {recipes.map((recipe, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="relative group bg-gray-800/90 rounded-2xl shadow-lg border border-gray-700 overflow-hidden cursor-pointer"
          >
            {/* Image */}
            <div className="overflow-hidden rounded-t-2xl">
              <Image
                src={recipe.img}
                alt={recipe.title}
                width={600}
                height={400}
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>

            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-green-400 opacity-0 group-hover:opacity-10 transition"></div>

            {/* Content */}
            <div className="p-5 text-center">
              <h4 className="text-lg font-semibold text-white">
                {recipe.title}
              </h4>
              <p className="mt-2 text-gray-400 text-sm">
                {recipe.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
