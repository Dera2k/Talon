"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toFormErrors } from "@/lib/api/form-errors";
import { safeNextPath } from "@/lib/auth/redirect";
import { signIn } from "@/lib/auth/session";

const FIELDS = ["email", "password"] as const;

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        <FieldError message={errors?.fields.password} />
      </div>
      <FormAlert message={errors?.general} />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="w-full text-muted-foreground hover:text-foreground"
        disabled={login.isPending || login.isSuccess}
        onClick={() => login.mutate({ email: "test@test.com", password: "12345test" })}
      >
        ▸ Demo Talon
      </Button>
      <Button type="submit" className="w-full" disabled={login.isPending || login.isSuccess}>
        {login.isPending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
