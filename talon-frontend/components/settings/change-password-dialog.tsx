"use client";

import { useState, type FormEvent } from "react";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChangePassword } from "@/hooks/queries/use-settings";
import { toFormErrors } from "@/lib/api/form-errors";

const FIELDS = ["currentPassword", "newPassword"] as const;

function ChangePasswordForm() {
  const change = useChangePassword();
  const [mismatch, setMismatch] = useState(false);
  const errors = change.error ? toFormErrors(change.error, FIELDS) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const newPassword = String(data.get("newPassword"));

    if (newPassword !== String(data.get("confirmPassword"))) {
      setMismatch(true);
      return;
    }
    setMismatch(false);
    change.mutate({ currentPassword: String(data.get("currentPassword")), newPassword });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current password</Label>
        <Input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
        <FieldError message={errors?.fields.currentPassword} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        />
        <FieldError message={errors?.fields.newPassword} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          minLength={8}
          maxLength={128}
          required
        />
        <FieldError message={mismatch ? "Passwords don’t match." : undefined} />
      </div>
      <FormAlert message={errors?.general} />
      <DialogFooter>
        <Button type="submit" disabled={change.isPending || change.isSuccess}>
          {change.isPending ? "Updating…" : "Update password"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function ChangePasswordDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Change password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Change password</DialogTitle>
          <DialogDescription>You’ll be signed out on every device and asked to log in again.</DialogDescription>
        </DialogHeader>
        <ChangePasswordForm />
      </DialogContent>
    </Dialog>
  );
}
