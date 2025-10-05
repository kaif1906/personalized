"use client"; // required because we use hooks
import React, { useState } from "react";
import FeatureSection from "./components/FeatureSection";
import Sidebar from "./components/Sidebar";
import HowItWorksSection from "./components/HowItWorksSection";
import PopularRecipesSection from "./components/PopularRecipesSection";



export default function HomePage() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

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
      <section className="relative min-h-[70vh] sm:min-h-[75vh] md:min-h-[80vh] bg-[url('https://www.shutterstock.com/image-photo/healthy-fruits-vegetables-on-white-260nw-2474337763.jpg')] bg-cover bg-center flex flex-col items-center justify-center py-10 sm:py-14 md:py-20 px-4">
        {/* Optional overlay for readability */}
        <div className="absolute inset-0 bg-white/60"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center drop-shadow-lg">
              🍲 AI-Based Recipe Recommendation
            </h1>

            {/* Upload Form */}
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6 mb-12">
              <div className="p-4">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 items-center"
                >
                  {/* Prompt Input */}
                  <textarea
                    className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-green-400 text-gray-700 resize-none"
                    placeholder="Type your request... (e.g., Quick healthy breakfast)"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    rows="3"
                  />

                  {/* Image Upload */}
                  <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center">
                      <span className="text-gray-600 mb-2">
                        Upload ingredient image
                      </span>
                      <span className="text-sm text-gray-500">
                        or drag and drop
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>

                  {preview && (
                    <div className="relative w-full">
                      <img
                        src={preview}
                        alt="Ingredient preview"
                        className="w-32 h-32 object-cover rounded-xl mx-auto"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreview(null);
                          setImage(null);
                        }}
                        className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-4 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 disabled:opacity-50 transition-colors font-medium"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Generating...
                      </span>
                    ) : (
                      "Get Recipes"
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Recipes List */}
            {recipes.length > 0 && (
              <div className="w-full max-w-2xl mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Recommended Recipes
                </h2>
                <div className="grid gap-6">
                  {recipes.map((recipe, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      <h3 className="font-bold text-xl mb-3 text-gray-900">
                        {recipe.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {recipe.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      
      
      <PopularRecipesSection />
      <FeatureSection />
      <HowItWorksSection />
      

    </>
  );
}
