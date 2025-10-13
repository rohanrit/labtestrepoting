"use client";
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    // Optionally add input validation here and set error if needed
    try {
      const { data, error } = await authClient.signUp.email(
        {
          name,
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onRequest: (ctx) => {
            // Show loading indicator if desired
          },
          onSuccess: (ctx) => {
            router.push('/dashboard');
          },
          onError: (ctx) => {
            setError(ctx.error?.message || "Signup failed");
          },
        }
      );
      if (error) {
        setError(error.message || "Signup failed");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="mx-auto">
        <Link
          href="/"
          className="mt-6 mb-3 inline-block rounded-md bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition"
        >
          ← Back to Home
        </Link>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-200 p-4 min-w-[320px] w-80">
          <h2 className='font-bold'>SIGNUP</h2>
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded">
              {error}
            </div>
          )}
          <input
            className="border border-gray-600 p-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
          <input
            className="border border-gray-600 p-2"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            required
          />
          <input
            className="border border-gray-600 p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="new-password"
            required
          />
          <button className="bg-black text-white p-2 cursor-pointer" type="submit">
            Signup
          </button>
        </form>
        <div className="mt-3">
          <p>
            Already have an account?{' '}
            <Link
              href="/auth/signin"
              className="font-bold text-cyan-700 hover:text-gray-900 transition"
            >
              Sign In
            </Link>{' '}
            here
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
