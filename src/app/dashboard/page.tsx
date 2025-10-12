import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import PdfExtractorClient from "@/app/components/PdfExtractor";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  // Role comes from session
  const role = session.user?.role?.toUpperCase() || "USER";

  const renderDashboardByRole = () => {
    switch (role) {
      case "ADMIN":
        return (
          <section className="bg-white shadow rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Admin Dashboard</h2>
            <p>You can manage all users, doctors, and reports.</p>
          </section>
        );
      case "DOCTOR":
        return (
          <section className="bg-white shadow rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold">Doctor Dashboard</h2>
            <p>You can view and edit all reports.</p>
          </section>
        );
      default:
        return (
          <section className="bg-white shadow rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold">User Dashboard</h2>
            <p>Upload and manage your reports.</p>
            <PdfExtractorClient />
          </section>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <main className="flex-1 p-8 space-y-8">
        <section className="bg-white shadow rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-2">Welcome, {session.user?.name}</h1>
          <p className="text-gray-600">Role: {role.toLowerCase()}</p>
        </section>

        {renderDashboardByRole()}
      </main>
    </div>
  );
}
