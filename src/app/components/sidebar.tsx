'use client'

import React from 'react'
import Logout from './logout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = () => {
  const pathname = usePathname()

  const linkClass = (hrefs: string | string[]) => {
    const isActive = Array.isArray(hrefs)
      ? hrefs.includes(pathname)
      : pathname === hrefs

    return `px-3 py-2 rounded border border-gray-700 transition ${isActive ? 'bg-gray-700 font-semibold border-gray-700' : 'text-white hover:bg-gray-900'
      }`
  }

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
          className={linkClass(['/dashboard/heamatologyreport', '/dashboard/heamatologyreport/add'])}
        >
          Heamatology Reports
        </Link>
        <Link
          href="/dashboard/chemistryreport"
          className={linkClass(['/dashboard/chemistryreport', '/dashboard/chemistryreport/add'])}
        >
          Chemistry Reports
        </Link>
        <Link
          href="/dashboard/profile"
          className={linkClass('/dashboard/profile')}
        >
          User Profile
        </Link>
        <Link
          href="/dashboard/horses"
          className={linkClass('/dashboard/horses')}
        >
          Horse List
        </Link>
        <Logout />
      </nav>
    </aside>
  )
}

export default Sidebar