"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { PasswordStrength } from "@/components/auth/password-strength";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toFormErrors } from "@/lib/api/form-errors";
import { signUp } from "@/lib/auth/session";
import { getDeviceTimezone, getTimezoneOptions } from "@/lib/timezones";

const FIELDS = ["firstName", "lastName", "email", "password", "timezone"] as const;

export function RegisterForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [timezone, setTimezone] = useState("");
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    const device = getDeviceTimezone() || "UTC";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTimezones(getTimezoneOptions(device));
    setTimezone(device);
  }, []);

  const register = useMutation({
    mutationFn: signUp,
    onSuccess: () => router.replace("/app"),
  });

  const errors = register.error ? toFormErrors(register.error, FIELDS) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    register.mutate({
      firstName: String(data.get("firstName")),
      lastName: String(data.get("lastName")),
      email: String(data.get("email")),
      password,
      timezone,
    });
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="firstName">First name</Label>
          <Input id="firstName" name="firstName" autoComplete="given-name" required />
          <FieldError message={errors?.fields.firstName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last name</Label>
          <Input id="lastName" name="lastName" autoComplete="family-name" required />
          <FieldError message={errors?.fields.lastName} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError message={errors?.fields.email} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="timezone">Timezone</Label>
        <select
          id="timezone"
          value={timezone}
          onChange={(event) => setTimezone(event.target.value)}
          disabled={timezones.length === 0}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          {timezones.length === 0 && <option value="">Detecting…</option>}
          {timezones.map((tz) => (
            <option key={tz} value={tz}>
              {tz}
            </option>
          ))}
        </select>
        <FieldError message={errors?.fields.timezone} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={12}
          maxLength={128}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <PasswordStrength password={password} />
        <FieldError message={errors?.fields.password} />
      </div>
      <FormAlert message={errors?.general} />
      <Button
        type="submit"
        className="w-full"
        disabled={register.isPending || register.isSuccess || !timezone}
      >
        {register.isPending ? "Creating…" : "Create account"}
      </Button>
    </form>
  );
}
