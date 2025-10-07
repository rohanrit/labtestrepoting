import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

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
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
