"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🔴 validations
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match");
    }

    if (!formData.acceptTerms) {
      return setError("Please accept the terms and conditions");
    }

    if (!process.env.NEXT_PUBLIC_API_URL) {
      return setError("API URL not configured");
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      // ✅ SAFE JSON PARSE
      let data = null;
      const text = await response.text();

      try {
        data = text ? JSON.parse(text) : null;
      } catch (err) {
        console.error("JSON parse error:", err);
      }

      // ✅ success
      if (response.ok) {
        router.push("/login");
        return;
      }

      // ❌ backend error
      setError(data?.message || "Signup failed. Please try again.");
    } catch (err) {
      console.error("Signup error:", err);
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-lg">
        <h2 className="text-center text-3xl font-extrabold text-white">
          Sign up
        </h2>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-blue-400">
            Sign in here
          </Link>
        </p>

        {/* 🔴 error message */}
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-700 text-white"
          />

          <label className="flex items-center text-gray-400">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className="mr-2"
            />
            I accept the Terms and Conditions
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
