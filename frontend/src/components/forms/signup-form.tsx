"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupRequest } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Min 6 characters"),
  role: z.enum(["USER", "ADMIN"]),
});

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "USER" },
  });

  const onSubmit = async (values: SignupValues) => {
    setServerError("");
    try {
      const data = await signupRequest(values);
      login(data);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unable to sign up right now.");
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-zinc-500">
          <span>Full name</span>
          <span className="text-zinc-400">Required</span>
        </div>
        <input
          type="text"
          {...register("name")}
          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="Jane Doe"
        />
        {errors.name ? (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        ) : null}
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-zinc-500">
          <span>Email</span>
          <span className="text-zinc-400">Work email preferred</span>
        </div>
        <input
          type="email"
          {...register("email")}
          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          placeholder="********"
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1">
        <label className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          Role
        </label>
        <select
          {...register("role")}
          className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-zinc-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
        {errors.role ? (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-red-600">{serverError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
