"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginValues } from "@/lib/validation/login-schema";
import { signInWithPassword } from "@/app/admin/login/actions";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [formError, setFormError] = useState<string | null>(null);
  const [isGooglePending, setIsGooglePending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (values: LoginValues) => {
    setFormError(null);
    startTransition(async () => {
      const result = await signInWithPassword(values);
      if (result?.error) {
        setFormError(result.error);
      }
    });
  };

  const onGoogleSignIn = () => {
    setFormError(null);
    setIsGooglePending(true);
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <div className="w-full max-w-sm rounded-lg border border-border bg-surface p-6">
      <h1 className="text-h3 font-semibold text-text-primary">Admin Login</h1>
      <p className="mt-1 text-small text-text-secondary">
        Sign in to manage posts, categories, and your resume.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-6 flex flex-col gap-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email ? (
            <p className="text-tiny text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          {errors.password ? (
            <p className="text-tiny text-destructive">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        {formError ? (
          <p role="alert" className="text-small text-destructive">
            {formError}
          </p>
        ) : null}

        <Button type="submit" disabled={isPending} className="mt-1 w-full">
          {isPending ? "Signing in…" : "Log In"}
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-tiny text-text-secondary">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <Button
        type="button"
        variant="outline"
        disabled={isGooglePending}
        onClick={onGoogleSignIn}
        className="w-full"
      >
        <GoogleIcon />
        {isGooglePending ? "Redirecting…" : "Continue with Google"}
      </Button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" width="16" height="16" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.4 0 6.4 1.2 8.8 3.5l6.5-6.5C35.3 2.6 30 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.6 5.9C11.9 13 17.4 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.5 3-2.2 5.5-4.7 7.2l7.3 5.7c4.3-4 6.8-9.8 6.8-17.4z"
      />
      <path
        fill="#FBBC05"
        d="M10.1 19.1a14.5 14.5 0 0 0 0 9.8l-7.6 5.9a24 24 0 0 1 0-21.6l7.6 5.9z"
      />
      <path
        fill="#34A853"
        d="M24 48c6 0 11.3-2 15-5.4l-7.3-5.7c-2 1.4-4.6 2.2-7.7 2.2-6.6 0-12.1-4.5-14-10.6l-7.6 5.9C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}
