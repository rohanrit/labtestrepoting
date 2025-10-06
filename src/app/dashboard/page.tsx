import { auth } from "@/lib/auth";
import { headers } from "next/headers";
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

        <section className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Upload a PDF</h2>
          <form
            action="#"
            method="post"
            encType="multipart/form-data"
            className="flex flex-col gap-4"
          >
            <input
              type="file"
              name="pdf"
              accept="application/pdf"
              className="border border-gray-300 rounded p-2"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Upload
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
