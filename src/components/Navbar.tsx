"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "btn btn-primary btn-sm btn-stamp font-semibold"
      : "btn btn-ghost btn-sm font-semibold hover:bg-lavender-mid";

  return (
    <div className="pt-4 px-4 max-w-5xl mx-auto">
    <div
      className="navbar bg-white px-4 rounded-2xl"
      style={{ border: "2.5px solid #1a1a2e", boxShadow: "4px 4px 0 #1a1a2e" }}
    >
      <div className="navbar-start">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.75rem", fontWeight: 700, color: "#1a1a2e", letterSpacing: "0.02em" }}
        >
          <img src="/elly.png" alt="BabyLog mascot" className="h-8 w-auto" />
          Ella
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <Link href="/" className={linkClass("/")}
          style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem" }}>
          Home
        </Link>
        <Link href="/log" className={linkClass("/log")}
          style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem" }}>
          Log
        </Link>
        <Link href="/analytics" className={linkClass("/analytics")}
          style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1rem" }}>
          Analytics
        </Link>
      </div>
    </div>
    </div>
  );
}
