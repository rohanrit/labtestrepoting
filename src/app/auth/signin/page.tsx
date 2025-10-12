"use client";

import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SigninPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password } = formData;

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard", // role comes from session
      });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Signin failed:", err);
      alert("Signin failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="mx-auto max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <Link href="/" className="mb-4 inline-block text-gray-700 hover:text-gray-900">
          ← Back to Home
        </Link>

        <h2 className="text-2xl font-bold mb-2 text-center">Login</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="border border-gray-300 rounded-md p-2"
          />
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="border border-gray-300 rounded-md p-2"
          />

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold text-blue-600 hover:text-blue-800">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
