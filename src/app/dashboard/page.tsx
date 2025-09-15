import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/[...nextauth]/route";
import DataTable from "@/app/components/DataTable";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "admin") {
    return <p>Access denied. Admins only.</p>;
  }

  // Fetch lab records including patient info as needed
  return (
    <main>
      <h1>Admin Dashboard</h1>
      <DataTable data={[]} />
    </main>
  );
}
