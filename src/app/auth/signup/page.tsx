"use client";

import { authClient } from "@/lib/auth-client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const SignupPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState("USER"); // default role
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Read role from query param once
  useEffect(() => {
    const urlRole = searchParams.get("role");
    if (urlRole) {
      const normalized = urlRole.toUpperCase();
      if (["ADMIN", "DOCTOR", "USER"].includes(normalized)) {
        setRole(normalized);
      }
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { name, email, password } = formData;

    try {
      const { data, error } = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: "/dashboard",
        options: { role }, // send role to backend
      });

      if (error) {
        alert(error.message);
        return;
      }

      router.push("/auth/signin"); // redirect to login after signup
    } catch (err) {
      console.error("Signup failed:", err);
      alert("Signup failed. Please try again.");
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

        <h2 className="text-2xl font-bold mb-2 text-center">
          {role === "ADMIN"
            ? "Admin Signup"
            : role === "DOCTOR"
            ? "Doctor Signup"
            : "User Signup"}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-4">
          You are signing up as <strong>{role.toLowerCase()}</strong>
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="border border-gray-300 rounded-md p-2"
          />
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
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-semibold text-blue-600 hover:text-blue-800">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
