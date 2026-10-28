"use client";

import { iconOptions } from "@/lib/icons";
import { cn } from "@/lib/utils";

type IconPickerProps = { value: string; onChange: (icon: string) => void };

export function IconPicker({ value, onChange }: IconPickerProps) {
  return (
    <div role="group" aria-label="Icon" className="grid grid-cols-8 gap-2 sm:grid-cols-10">
      {iconOptions.map(({ value: name, icon: Icon }) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          aria-label={name}
          aria-pressed={value === name}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md border transition",
            value === name
              ? "border-primary bg-primary/15 text-foreground"
              : "border-border text-muted-foreground hover:border-primary/40",
          )}
        >
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
