"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import type { FormEvent } from "react";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toFormErrors } from "@/lib/api/form-errors";
import { safeNextPath } from "@/lib/auth/redirect";
import { signIn } from "@/lib/auth/session";

const FIELDS = ["email", "password"] as const;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNextPath(params.get("next"));
  const justReset = params.get("reset") === "1";

  const login = useMutation({
    mutationFn: signIn,
    onSuccess: () => router.replace(next),
  });

  const errors = login.error ? toFormErrors(login.error, FIELDS) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    login.mutate({ email: String(data.get("email")), password: String(data.get("password")) });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {justReset && !errors && (
        <p
          role="status"
          className="rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm text-foreground"
        >
          Password updated. Log in with your new password.
        </p>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <FieldError message={errors?.fields.email} />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link
            href="/forgot-password"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Forgot?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
        <FieldError message={errors?.fields.password} />
      </div>
      <FormAlert message={errors?.general} />
      <Button type="submit" className="w-full" disabled={login.isPending || login.isSuccess}>
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
