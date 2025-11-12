"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

const links = [
  { href: "/signup", label: "Sign up" },
  { href: "/login", label: "Log in" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          RoleDash
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
          {links
            .filter((link) =>
              user ? link.href === "/dashboard" : link.href !== "/dashboard"
            )
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1 transition ${
                  pathname === link.href
                    ? "bg-zinc-900 text-white"
                    : "hover:bg-zinc-100"
                }`}
              >
                {link.label}
              </Link>
            ))}
          {user ? (
            <button
              onClick={handleLogout}
              className="rounded-md bg-red-600 px-3 py-1 text-white transition hover:bg-red-500"
            >
              Logout
            </button>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
