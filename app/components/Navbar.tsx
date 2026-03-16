"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutUser } from "@/app/actions/auth";

interface NavbarProps {
  user?: { name: string; role: string } | null;
}

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠" },
  { href: "/courses", label: "Courses", icon: "📚" },
];

const adminLinks = [{ href: "/admin/reviews", label: "Admin", icon: "⚙️" }];

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  const links = [
    ...navLinks,
    ...(user?.role === "ADMIN" ? adminLinks : []),
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl bg-slate-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-neon-500 flex items-center justify-center text-pitch-950 font-black text-base group-hover:scale-105 transition-transform">
              ⚽
            </div>
            <span className="font-black text-white text-lg hidden sm:block">
              Pro<span className="gradient-text">File</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {user &&
              links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive(link.href)
                      ? "bg-pitch-600/30 text-neon-400 border border-pitch-500/30"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{link.icon}</span>
                  {link.label}
                </Link>
              ))}
          </div>

          {/* Right: user + logout */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-pitch-600 border border-pitch-400/30 flex items-center justify-center text-sm font-bold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-300 hidden lg:block">
                    {user.name.split(" ")[0]}
                  </span>
                </div>
                <form action={logoutUser}>
                  <button
                    type="submit"
                    className="btn-outline text-xs px-3 py-2 rounded-lg font-semibold"
                  >
                    Sign Out
                  </button>
                </form>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="btn-outline text-sm px-4 py-2 rounded-lg font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="btn-neon text-sm px-4 py-2 rounded-xl"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            {user && (
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                {mobileOpen ? (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && user && (
          <div className="md:hidden border-t border-white/5 py-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  isActive(link.href)
                    ? "bg-pitch-600/30 text-neon-400"
                    : "text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.icon} {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
