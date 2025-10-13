"use client"
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Uncomment login redirect logic after integrating session check
  // const { data: session, isPending, error, refetch } = authClient.useSession();
  // useEffect(() => {
  //   if (session) redirect('/dashboard');
  // }, [session]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);         // Reset error state on new attempt
    setIsSubmitting(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/dashboard",
        rememberMe: true,
      });
      if (error) {
        setFormError(error.message || "Sign in failed. Please try again.");
      } else if (data?.redirect) {
        console.log(data.redirect);
        //redirect(data.redirect);
        redirect('/auth/signin');
      }
    } catch (err: any) {
      setFormError(err?.message || "Unexpected error.");
    } finally {
      setIsSubmitting(false);
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

        {/* Error message */}
        {formError && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-200 p-4">
          <h2 className='font-bold'>SIGNIN</h2>
          <input
            className="border border-gray-600 p-2"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />
          <input
            className="border border-gray-600 p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
          <button
            className="bg-black text-white p-2 cursor-pointer disabled:bg-gray-500"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Signin'}
          </button>
        </form>
        <div className="mt-3">
          <p>
            Not yet registered{" "}
            <Link
              href="/auth/signup"
              className="font-bold text-cyan-700 hover:text-gray-900 transition"
            >
              Sign Up
            </Link>{" "}
            now
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninPage;
