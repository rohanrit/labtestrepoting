'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image'

interface User {
  _id?: string;
  name: string;
  email: string;
  emailVerified?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User>({ name: '', email: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/user/get`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setUser(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/user/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, name: user.name }),
    });
    alert('Profile updated!');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start">
          <Image
            src="/user-circle.svg" // Use absolute path from public folder
            alt="User Avatar"
            width={128}
            height={128}
            className="rounded-full border-4 border-blue-500 shadow-md"
          />

          <div className="mt-6 md:mt-0 md:ml-8 text-center md:text-left">
            <div className="mb-2"><label className="text-2xl font-bold text-gray-800">Email: <input type="email" name="email" value={user.email} disabled /></label></div>
            <div className="mb-2"><label className="text-gray-600">Name: <input type="text" name="name" value={user.name} onChange={handleChange} /></label></div>
            {/* <div><button type="submit" className="bg-blue-600 text-white px-3 py-2 rounded">Update</button></div> */}
          </div>
        </div>
      </div>
    </form>
  );
}
