"use client";

import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { SettingsSection } from "@/components/settings/settings-section";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUpdateSettings } from "@/hooks/queries/use-settings";
import { toFormErrors } from "@/lib/api/form-errors";
import { getTimezoneOptions } from "@/lib/timezones";

const FIELDS = ["timezone"] as const;

export function TimezoneSection({ timezone }: { timezone: string }) {
  const update = useUpdateSettings();
  const [value, setValue] = useState(timezone);
  const options = useMemo(() => getTimezoneOptions(timezone), [timezone]);

  const errors = update.error ? toFormErrors(update.error, FIELDS) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    update.mutate({ timezone: value }, { onSuccess: () => toast.success("Timezone updated") });
  }

  return (
    <SettingsSection title="Timezone">
      <form className="flex items-end gap-3" onSubmit={handleSubmit}>
        <div className="flex-1 space-y-2">
          <Label htmlFor="timezone">Local timezone</Label>
          <select
            id="timezone"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            {options.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Today and your reminders follow this timezone.
          </p>
          <FieldError message={errors?.fields.timezone} />
          <FormAlert message={errors?.general} />
        </div>
        <Button type="submit" disabled={update.isPending || value === timezone}>
          Update
        </Button>
      </form>
    </SettingsSection>
  );
}
