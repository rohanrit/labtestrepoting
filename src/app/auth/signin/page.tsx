"use client"
import { authClient } from '@/lib/auth-client';
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-gray-200 p-4 mx-auto">
        <h3>SignIn</h3>
        <input className="border border-gray-600 p-2" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="border border-gray-600 p-2" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button className="bg-black text-white p-2 cursor-pointer" type="submit">Signin</button>
      </form>
    </div>
  )
}

export default SigninPage