"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm";

  return (
    <div className="navbar bg-gradient-to-r from-primary/30 via-base-200 to-secondary/20 shadow-sm px-4 border-b border-base-300">
      <div className="navbar-start">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-base-content hover:text-primary transition-colors duration-200"
        >
          🍼 BabyLog
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
