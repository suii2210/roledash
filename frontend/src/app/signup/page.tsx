import Link from "next/link";
import { SignupForm } from "@/components/forms/signup-form";

export default function SignupPage() {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-white p-10 shadow-xl ring-1 ring-zinc-100 md:grid md:grid-cols-[1.1fr,0.9fr] md:gap-12">
      <div className="pointer-events-none absolute inset-y-0 -left-10 hidden w-1/3 rounded-full bg-indigo-100 blur-3xl md:block" />
      <div className="relative">
        <h1 className="mt-4 text-4xl font-semibold text-zinc-900">
          Create your workspace
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Sign up, choose a role, and start exploring the dashboard tailored to
          your access level.
        </p>
        <p className="mt-6 text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-4"
          >
            Log in
          </Link>
        </p>
      </div>
      <div className="relative rounded-2xl border border-zinc-100 bg-white/80 p-6 shadow-lg">
        <div className="mb-6 border-b border-zinc-100 pb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">
            Signup form
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Complete the fields to get instant dashboard access.
          </p>
        </div>
        <SignupForm />
      </div>
    </section>
  );
}
