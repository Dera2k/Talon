"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/endpoints/auth";
import { toFormErrors } from "@/lib/api/form-errors";

const FIELDS = ["token", "newPassword"] as const;

export function ResetPasswordForm() {
  const router = useRouter();
  const token = useSearchParams().get("token");
  const [mismatch, setMismatch] = useState(false);

  const reset = useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: () => router.replace("/login?reset=1"),
  });

  const errors = reset.error ? toFormErrors(reset.error, FIELDS) : null;

  if (!token) {
    return (
      <div className="rounded-lg border bg-card p-6 text-sm text-muted-foreground">
        This reset link is missing its token.{" "}
        <Link href="/forgot-password" className="text-primary hover:underline">
          Request a new link
        </Link>
      </div>
    );
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword"));

    if (newPassword !== String(data.get("confirmPassword"))) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    reset.mutate({ token: token as string, newPassword });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
        />
        <FieldError message={errors?.fields.newPassword} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={12}
          maxLength={128}
          required
        />
        <FieldError message={mismatch ? "Passwords don’t match." : undefined} />
      </div>
      <FormAlert message={errors?.general ?? errors?.fields.token} />
      {reset.isError && (
        <p className="text-sm text-muted-foreground">
          <Link href="/forgot-password" className="text-primary hover:underline">
            Request a new reset link
          </Link>
        </p>
      )}
      <Button type="submit" className="w-full" disabled={reset.isPending || reset.isSuccess}>
        {reset.isPending ? "Updating…" : "Update password"}
      </Button>
    </form>
  );
}
