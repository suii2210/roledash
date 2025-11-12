import Link from "next/link";
import { LoginForm } from "@/components/forms/login-form";

export default function LoginPage() {
  return (
    <section className="grid gap-10 rounded-2xl bg-white p-10 shadow-sm md:grid-cols-2">
      <div>
        <h1 className="mt-2 text-3xl font-semibold text-zinc-900">
          Welcome back
        </h1>
        <p className="mt-6 text-sm text-zinc-500">
          Need an account?{" "}
          <Link href="/signup" className="text-indigo-600 underline">
            Create one
          </Link>
        </p>
      </div>
      <div>
        <LoginForm />
      </div>
    </section>
  );
}
