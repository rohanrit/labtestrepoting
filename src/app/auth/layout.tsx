import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect if logged in
  if (session) {
    redirect("/dashboard");
  }

  // No Navbar here — just auth content and back button
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Link
        href="/"
        className="mt-6 inline-block rounded-md bg-gray-800 text-white px-4 py-2 hover:bg-gray-700 transition"
      >
        ← Back to Home
      </Link>
      <div className="w-full max-w-md">{children}</div>


    </div>
  );
}
