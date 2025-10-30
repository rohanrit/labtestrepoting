import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ 
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 p-8 space-y-8">
        <section className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">
            Welcome, {session.user?.name || "User"} 👋
          </h1>
          <p className="text-gray-600">
            This is your dashboard. You can manage your uploads and access your documents here.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Heamatology Reports Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Heamatology Reports</h3>
            <Link href="/dashboard/heamatologyreport/add" className="bg-blue-600 text-white p-2 rounded">Add Report</Link>
          </section>

          {/* Chemistry Reports Section */}
          <section className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Chemistry Reports</h3>
            <Link href="/dashboard/chemistryreport/add" className="bg-blue-600 text-white p-2 rounded">Add Report</Link>
          </section>
        </div>

      </main>
    </div>
  );
}
