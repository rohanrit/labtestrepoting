import { options } from "./api/auth/[...nextauth]/options"
import { getServerSession } from "next-auth/next"
import UserCard from "../app/components/UserCard"
import Hero from "@/app/sections/Hero";
import Posts from "@/app/sections/Posts";

export default function Home() {
  return (
    <main id="main">
      <Hero/>
      <Posts/>
    </main>
  );
}
