"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginRequest } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Password required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginValues) => {
    setServerError("");
    try {
      const data = await loginRequest(values);
      login(data);
      router.push("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        setServerError(error.message);
      } else {
        setServerError("Unable to login right now.");
      }
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-900 focus:outline-none"
          placeholder="you@example.com"
        />
        {errors.email ? (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        ) : null}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-zinc-700">
          Password
        </label>
        <input
          type="password"
          {...register("password")}
          className="w-full rounded-lg border border-zinc-300 px-3 py-2 focus:border-zinc-900 focus:outline-none"
          placeholder="********"
        />
        {errors.password ? (
          <p className="mt-1 text-sm text-red-600">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {serverError ? (
        <p className="text-sm text-red-600">{serverError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition disabled:opacity-60"
      >
        {isSubmitting ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
