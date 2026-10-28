"use client";

import type { HabitFrequency } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const OPTIONS: { value: HabitFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
];

type FrequencyPickerProps = { value: HabitFrequency; onChange: (value: HabitFrequency) => void };

export function FrequencyPicker({ value, onChange }: FrequencyPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          aria-pressed={value === option.value}
          className={cn(
            "rounded-lg border p-3 text-sm transition",
            value === option.value
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:border-primary/40",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
