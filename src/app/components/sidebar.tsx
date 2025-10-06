import React from 'react'
import Logout from './logout'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Dashboard</h2>

        <nav className="flex flex-col gap-3">
          <Link
            href="/"
            className="px-3 py-2 rounded border border-gray-300 text-white hover:bg-gray-700 transition"
          >
            🏠 Home
          </Link>
          <Logout/>
        </nav>
      </aside>
  )
}

export default Sidebar