// Overwrite this file at /src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/app/components/AuthSessionProvider";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

// --- Import server session helper ---
import { getAuthSession } from "@/auth";
// ------------------------------------

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IK Regal Revelry - Event Planners",
  description: "Your Story, Our Stage.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch session safely on the server
  const session = await getAuthSession();

  return (
    <html lang="en" className="!scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} bg-brand-dark text-gray-200`}>
        <AuthSessionProvider session={session}>
          <Navbar />
          <main>
            {children}
          </main>
          <Footer />
        </AuthSessionProvider>
      </body>
    </html>
  );
}