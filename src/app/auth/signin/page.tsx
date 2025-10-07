"use client"
import { authClient } from '@/lib/auth-client';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const SigninPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // const { 
  //       data: session, 
  //       isPending, //loading state
  //       error, //error object
  //       refetch //refetch the session
  // } = authClient.useSession();
  // useEffect(()=>{
  //   if(session){
  //     redirect('/dashboard');
  //   }
  // },[session])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
      rememberMe: true,
    }, {
      //callbacks
    });
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-200 p-4">
          <h2 className='font-bold'>SIGNIN</h2>
          <input className="border border-gray-600 p-2" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <input className="border border-gray-600 p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
          <button className="bg-black text-white p-2 cursor-pointer" type="submit">Signin</button>
        </form>
        <div className="mt-3">
          <p>Not yet registered <Link
            href="/auth/signup"
            className="font-bold text-cyan-700 hover:text-gray-900 transition"
          >
            Sign Up
          </Link> now</p>
        </div>
      </div>
    </div>
  )
}

export default SigninPage