"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import type { FormEvent } from "react";
import { AuthShell } from "@/components/auth/auth-shell";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/endpoints/auth";
import { toFormErrors } from "@/lib/api/form-errors";

const FIELDS = ["email"] as const;

export function ForgotPasswordForm() {
  const forgot = useMutation({ mutationFn: authApi.forgotPassword });
  const errors = forgot.error ? toFormErrors(forgot.error, FIELDS) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    forgot.mutate({ email: String(data.get("email")) });
  }

  return (
    <AuthShell
      title="Reset your password"
      subtitle={
        forgot.isSuccess
          ? "Check your inbox for the reset link."
          : "We’ll email you a secure reset link."
      }
      footer={
        <Link href="/login" className="text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      {forgot.isSuccess ? (
        <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
          If an account exists for that email, a reset link is on its way. The link expires in 1
          hour.
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required />
            <FieldError message={errors?.fields.email} />
          </div>
          <FormAlert message={errors?.general} />
          <Button type="submit" className="w-full" disabled={forgot.isPending}>
            {forgot.isPending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
