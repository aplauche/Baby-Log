"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "btn btn-primary btn-sm btn-stamp font-semibold"
      : "btn btn-ghost btn-sm font-semibold hover:bg-paper-dark";

  return (
    <div className="navbar bg-white border-b-2 border-dashed border-paper-darker shadow-none px-4"
         style={{ boxShadow: "0 2px 6px rgba(100,70,50,0.08)" }}>
      <div className="navbar-start">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ fontFamily: "var(--font-caveat), cursive", fontSize: "1.4rem", fontWeight: 700, color: "#3d2a2a", letterSpacing: "0.02em" }}
        >
          <span className="sticker text-lg">🍼</span>
          BabyLog
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <Link href="/" className={linkClass("/")}>
          Home
        </Link>
        <Link href="/log" className={linkClass("/log")}>
          Log
        </Link>
        <Link href="/analytics" className={linkClass("/analytics")}>
          Analytics
        </Link>
      </div>
    </div>
  );
}
