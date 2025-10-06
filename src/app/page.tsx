// app/page.tsx
import Link from "next/link";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-1 items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to My App 🚀</h1>
        <p className="text-gray-600 max-w-md mb-8">
          This is the public home page. Explore features or log in to access your dashboard.
        </p>

        <div className="flex gap-4">
          <Link
            href="/auth/signin"
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign In
          </Link>

          <Link
            href="/auth/signup"
            className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
          >
            Sign Up
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
