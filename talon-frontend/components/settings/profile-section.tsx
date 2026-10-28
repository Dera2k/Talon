"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/settings/settings-section";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateProfile } from "@/hooks/queries/use-me";
import { toFormErrors } from "@/lib/api/form-errors";
import type { User } from "@/lib/api/types";

const FIELDS = ["firstName", "lastName"] as const;

export function ProfileSection({ user }: { user: User }) {
  const update = useUpdateProfile();
  const [firstName, setFirstName] = useState(user.firstName ?? "");
  const [lastName, setLastName] = useState(user.lastName ?? "");

  const errors = update.error ? toFormErrors(update.error, FIELDS) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate(
      { firstName: firstName.trim() || null, lastName: lastName.trim() || null },
      { onSuccess: () => toast.success("Profile updated") },
    );
  }

  return (
    <SettingsSection title="Profile">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="given-name"
            />
            <FieldError message={errors?.fields.firstName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="family-name"
            />
            <FieldError message={errors?.fields.lastName} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user.email} disabled />
        </div>
        <FormAlert message={errors?.general} />
        <div className="flex justify-end">
          <Button type="submit" disabled={update.isPending}>
            Save profile
          </Button>
        </div>
      </form>
    </SettingsSection>
  );
}
