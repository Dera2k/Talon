"use client";

import { WEEKDAYS } from "@/lib/constants";
import { cn } from "@/lib/utils";

type WeekdayPickerProps = { value: number[]; onChange: (days: number[]) => void };

export function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  function toggle(day: number) {
    onChange(value.includes(day) ? value.filter((d) => d !== day) : [...value, day]);
  }

  return (
    <div role="group" aria-label="Days of the week" className="flex flex-wrap gap-2">
      {WEEKDAYS.map(({ value: day, label }) => (
        <button
          key={day}
          type="button"
          onClick={() => toggle(day)}
          aria-pressed={value.includes(day)}
          className={cn(
            "h-10 w-12 rounded-md border text-sm transition",
            value.includes(day)
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border hover:border-primary/40",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
