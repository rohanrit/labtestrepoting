"use client"
import { authClient } from '@/lib/auth-client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await authClient.signUp.email({
        name: name,
        email: email,
        password: password,
        callbackURL: "/dashboard",
    }, {
        onRequest: (ctx) => {
            //show loading
            console.log('Making the request...');
        },
        onSuccess: (ctx) => {
            //redirect to the dashboard or sign in page
            router.push('/dashboard');
        },
        onError: (ctx) => {
            // display the error message
            alert(ctx.error.message);
        },
    });
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-200 p-4 mx-auto">
        <h3>SignUp</h3>
        <input className="border border-gray-600 p-2" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <input className="border border-gray-600 p-2" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="border border-gray-600 p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="bg-black text-white p-2 cursor-pointer" type="submit">Signup</button>
      </form>
    </div>
  )
}

export default SignupPage