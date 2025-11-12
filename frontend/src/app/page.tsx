"use client";

import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function Home() {
  const { user } = useAuth();

  return (
    <section className="rounded-2xl bg-white p-10 shadow-sm">
      <p className="mb-3 text-sm uppercase tracking-wide text-indigo-600">
        Role-based starter
      </p>
      <h1 className="text-4xl font-semibold text-zinc-900">
        Ship a secure dashboard in minutes.
      </h1>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={user ? "/dashboard" : "/signup"}
          className="rounded-lg bg-zinc-900 px-6 py-3 text-white transition hover:bg-zinc-800"
        >
          {user ? "Go to dashboard" : "Create an account"}
        </Link>
        <Link
          href="/login"
          className="rounded-lg border border-zinc-300 px-6 py-3 text-zinc-700 transition hover:border-zinc-400"
        >
          {user ? "Switch account" : "I already have an account"}
        </Link>
      </div>
    </section>
  );
}
