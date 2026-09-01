"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { loginSchema, type LoginFormValues } from "@/lib/schemas/loginSchema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  // Already logged in and landed on /login anyway (e.g. via back button)? Bounce to /jobs.
  useEffect(() => {
    if (!loading && user) {
      router.replace("/jobs");
    }
  }, [loading, user, router]);

  async function onSubmit(values: LoginFormValues) {
    setFormError(null);
    try {
      await login(values.email, values.password);
      router.push("/jobs");
    } catch (err) {
      // apiFetch throws a plain Error with the backend's message attached —
      // e.g. "Invalid email or password", the same generic message for both
      // a bad email and a bad password.
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <div className="w-full max-w-90 bg-surface border border-line rounded-lg p-8">
        <div className="flex items-center justify-center gap-2 mb-1.5 font-heading font-extrabold text-[17px] text-ink-900">
          <span className="w-2.5 h-2.5 rounded-full bg-brand shadow-[0_0_0_4px_rgba(61,79,224,0.25)]" />
          JobTrack
        </div>
        <p className="text-center text-ink-500 text-[13px] mb-5">Sign in to manage jobs</p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3.5">
          <Input
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password")}
          />

          {formError && (
            <p className="text-status-cancelled-fg text-[12.5px]" role="alert">
              {formError}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
            {isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
}