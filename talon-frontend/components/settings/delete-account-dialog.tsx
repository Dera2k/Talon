"use client";

import type { FormEvent } from "react";
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
import { useDeleteAccount } from "@/hooks/queries/use-settings";
import { toFormErrors } from "@/lib/api/form-errors";

const FIELDS = ["password"] as const;

function DeleteAccountForm() {
  const remove = useDeleteAccount();
  const errors = remove.error ? toFormErrors(remove.error, FIELDS) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    remove.mutate({ password: String(data.get("password")) });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="password">Confirm password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
        <FieldError message={errors?.fields.password} />
      </div>
      <FormAlert message={errors?.general} />
      <DialogFooter>
        <Button
          variant="destructive"
          type="submit"
          disabled={remove.isPending || remove.isSuccess}
        >
          {remove.isPending ? "Deleting…" : "I understand, delete"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export function DeleteAccountDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="mt-4">
          Delete my account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display">Delete account?</DialogTitle>
          <DialogDescription>
            This schedules your account for deletion and signs you out immediately. Your data is
            permanently deleted after 30 days.
          </DialogDescription>
        </DialogHeader>
        <DeleteAccountForm />
      </DialogContent>
    </Dialog>
  );
}
