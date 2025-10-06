import Link from "next/link";
import Logout from "./logout";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const Navbar = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // required for server session
  });

  return (
    <nav className="flex items-center gap-4">
      <Link href="/">Home</Link>

      {!session ? (
        <>
          <Link href="/auth/signin">Signin</Link>
          <Link href="/auth/signup">Signup</Link>
        </>
      ) : (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Logout />
        </>
      )}
    </nav>
  );
};

export default Navbar;
