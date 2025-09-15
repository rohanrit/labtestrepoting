import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import DataTable from "@/components/DataTable";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return <p>Access Denied</p>;
  }

  // Fetch data from DB here (via Mongoose or your API)

  return (
    <main>
      <h1>Admin Dashboard</h1>
      <DataTable data={[]} />
    </main>
  );
}
