import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col flex-1 items-center justify-center text-center px-6">
        <h1 className="text-4xl font-bold mb-4">Welcome to Digital Lab (Heamatology) 🚀</h1>
        <p className="text-gray-600 max-w-md mb-3">
          Comprehensive horse hematology and chemistry test report detailing vital blood parameters, organ function, and overall health status—essential for diagnosis, treatment planning, and performance monitoring.
        </p>

        <div className="flex gap-4">
          <Link
            href="/auth/signin"
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Sign In
          </Link>

          <Link
            href="/dashboard"
            className="px-6 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700 transition"
          >
            Upload Report
          </Link>
        </div>
        <div className="mt-3">
          <p>Not yet registered <Link
            href="/auth/signup"
            className="font-bold text-cyan-700 hover:text-gray-900 transition"
          >
            Sign Up
          </Link> now</p>
        </div>
      </main>
    </div>
  );
}
