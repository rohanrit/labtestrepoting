'use client'

import React from 'react'
import Logout from './logout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()

  const linkClass = (href: string) =>
    `px-3 py-2 rounded border border-gray-700 transition ${
      pathname === href ? 'bg-gray-700 font-semibold border-gray-700' : 'text-white hover:bg-gray-900'
    }`

  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col p-6">
        <h2 className="text-xl font-bold mb-8">Dashboard</h2>

        <nav className="flex flex-col gap-3">
          <Link
            href="/"
            className={linkClass('/')}
          >
            🏠 Home
          </Link>
          <Link
            href="/dashboard"
            className={linkClass('/dashboard')}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/heamatologyreport"
            className={linkClass('/dashboard/heamatologyreport')}
          >
            Heamatology Reports
          </Link>
          <Link
            href="/dashboard/chemistryreport"
            className={linkClass('/dashboard/chemistryreport')}
          >
            Chemistry Reports
          </Link>
          <Logout/>
        </nav>
      </aside>
  )
}

export default Sidebar