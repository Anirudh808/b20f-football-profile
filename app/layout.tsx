import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: {
    default: "ProFile — Football Profile & Skills Platform",
    template: "%s | ProFile",
  },
  description:
    "Build your global football profile, level up your skills through micro-courses, and get discovered by scouts. For players aged 6–18.",
  keywords: ["football", "soccer", "player profile", "youth football", "skills training"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  let user = null;
  if (session) {
    const dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, role: true },
    });
    if (dbUser) {
      user = { name: dbUser.name, role: dbUser.role };
    }
  }

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Navbar user={user} />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </body>
    </html>
  );
}
