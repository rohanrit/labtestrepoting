import type { Metadata } from "next";
import { Poppins, Noto_Sans } from "next/font/google";
import AuthProvider from "@/app/context/auth-provider";
import { useSession } from "next-auth/react";
import "./globals.css";

// Load fonts with desired subsets and weights
const poppins = Poppins({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-poppins" });
const notoSans = Noto_Sans({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-noto" });

export const metadata: Metadata = {
  title: "Lab Test Reporting",
  description: "Lab test reporting system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} ${notoSans.variable}`}>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
