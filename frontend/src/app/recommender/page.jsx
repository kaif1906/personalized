"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { motion } from "framer-motion";
import { Loader2, Copy, CheckCircle, RefreshCcw, Upload, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY);

export default function App() {
  const [images, setImages] = useState([]);
  const [markdownResponse, setMarkdownResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Token checking effect
  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  // 📤 Upload images to backend
  const uploadFiles = (e) => {
    const files = [...e.target.files];
    if (!files.length) return;

    const fd = new FormData();
    for (let i = 0; i < files.length; i++) {
      fd.append("myfiles", files[i]);
    }

    setLoading(true);
    toast.loading("Uploading images...");

    fetch("${process.env.NEXT_PUBLIC_API_URL}/uploadfile", {
      method: "POST",
      body: fd,
    })
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss();
        if (!Array.isArray(data) || !data.length) {
          toast.error("No files returned from server!");
          setLoading(false);
          return;
        }

        const newImages = data.map((item) => ({
          publicUrl: item.publicUrl,
          geminiFile: item.geminiFile,
        }));

        console.log("Uploaded image URLs:", newImages);
        setImages(newImages);
        toast.success(`${newImages.length} images uploaded successfully!`);
      })
      .catch((err) => {
        console.error(err);
        toast.dismiss();
        toast.error("Upload failed!");
      })
      .finally(() => setLoading(false));
  };

  // 🤖 AI Recipe Generator — combines prompt + uploaded images
  const generateCombinedRecipe = async () => {
    if (!prompt.trim() && images.length === 0) {
      toast.error("Please enter a prompt or upload images!");
      return;
    }

    setLoading(true);
    toast.loading("Analyzing input and generating recipes...");

    try {
      const parts = [];

      if (images.length > 0) {
        images.forEach((img) => {
          parts.push({
            fileData: {
              mimeType: img.geminiFile.mimeType,
              fileUri: img.geminiFile.uri,
            },
          });
        });
      }

      parts.push({
        text: `
You are a professional culinary AI assistant.
Analyze the following user input and/or food images and create 4–5 recipe suggestions in Indian cooking style.
User prompt: "${prompt || "No specific prompt provided"}"

For each recipe, include:
- 🍽️ Recipe name
- 🧾 Short description
- 🧂 Main ingredients
- 🔪 Steps (brief)
- 💡 Optional variations
Present results beautifully in Markdown format.
      `,
      });

      const chatSession = model.startChat({
        generationConfig,
        history: [{ role: "user", parts }],
      });

      const result = await chatSession.sendMessage("Generate recipes");
      const text = result.response.text();
      setMarkdownResponse(text);
      toast.dismiss();
      toast.success("Recipes generated successfully!");
    } catch (err) {
      console.error("Gemini error:", err);
      toast.dismiss();
      toast.error("Failed to generate recipes!");
      setMarkdownResponse("⚠️ Error generating recipes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdownResponse);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetApp = () => {
    setImages([]);
    setMarkdownResponse("");
    setCopied(false);
    setPrompt("");
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin text-green-400 mx-auto mb-4" size={40} />
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-gray-100">
      <Toaster position="top-center" />
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto text-center pt-12"
      >
        <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-teal-500">
          🍳 What's My Recipe
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Describe your craving or upload food photos — AI will suggest recipes based on both!
        </p>

        {/* ✏️ Prompt Input */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <input
            type="text"
            placeholder="e.g. quick breakfast with eggs"
            className="px-4 py-3 w-full sm:w-96 rounded-xl bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <button
            onClick={generateCombinedRecipe}
            className="bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-xl font-medium shadow-md transition"
          >
            Get Recipes
          </button>
        </div>

        {/* 📤 Upload Section */}
        <motion.label
          whileHover={{ scale: 1.05 }}
          htmlFor="image-upload"
          className="flex flex-col items-center justify-center border-4 border-dashed border-green-400/40 rounded-3xl p-12 cursor-pointer bg-gray-800/40 shadow-md hover:shadow-lg transition"
        >
          <Upload size={48} className="text-green-400 mb-4" />
          <p className="text-gray-300 font-medium">
            Drag & Drop or Click to Upload Multiple Images
          </p>
        </motion.label>

        <input
          multiple
          accept="image/*"
          id="image-upload"
          type="file"
          className="hidden"
          onChange={uploadFiles}
        />

        {/* 🖼️ Image Gallery */}
        {images.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {images.map((img, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                className="relative w-32 h-32 overflow-hidden rounded-xl shadow-md border border-gray-700"
              >
                <img
                  src={img.publicUrl}
                  alt={`Uploaded ${index}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1 hover:bg-red-100"
                >
                  <X size={16} className="text-red-600" />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* 🔘 Action Buttons */}
        {(images.length > 0 || markdownResponse) && (
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={resetApp}
              className="flex items-center gap-2 bg-gray-700 text-gray-100 px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              <RefreshCcw size={18} /> Reset
            </button>

            {markdownResponse && (
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                {copied ? "Copied!" : "Copy Recipes"}
              </button>
            )}
          </div>
        )}

        {/* ⏳ Loader */}
        {loading && (
          <div className="flex justify-center items-center mt-10">
            <Loader2 className="animate-spin text-green-400" size={40} />
          </div>
        )}

        {/* 📝 Recipe Output */}
        {markdownResponse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-left mt-12 rounded-2xl shadow-lg p-6 bg-gradient-to-r from-gray-800 via-gray-900 to-black border border-gray-700 text-gray-100"
          >
            <MarkdownPreview
              source={markdownResponse}
              style={{
                backgroundColor: "transparent",
                fontSize: 16,
                lineHeight: 1.6,
                color: "#f3f4f6",
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
