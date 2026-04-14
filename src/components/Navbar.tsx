"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path ? "btn btn-primary btn-sm" : "btn btn-ghost btn-sm";

  return (
    <div className="navbar bg-base-200 shadow-sm px-4">
      <div className="navbar-start">
        <Link href="/" className="text-xl font-bold tracking-tight">
          🍼 BabyLog
        </Link>
      </div>
      <div className="navbar-end gap-2">
        <Link href="/" className={linkClass("/")}>
          Home
        </Link>
        <Link href="/log" className={linkClass("/log")}>
          New Log
        </Link>
        <Link href="/analytics" className={linkClass("/analytics")}>
          Analytics
        </Link>
      </div>
    </div>
  );
}
