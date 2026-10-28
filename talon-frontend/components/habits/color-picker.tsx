"use client";

import { HABIT_COLORS, HABIT_COLOR_NAMES, type HabitColorName } from "@/lib/habit-colors";
import { cn } from "@/lib/utils";

type ColorPickerProps = { value: HabitColorName; onChange: (color: HabitColorName) => void };

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {HABIT_COLOR_NAMES.map((name) => (
        <button
          key={name}
          type="button"
          onClick={() => onChange(name)}
          aria-label={`Color ${name}`}
          aria-pressed={value === name}
          className={cn(
            "h-8 w-8 rounded-full border-2 transition",
            value === name ? "scale-110 border-foreground" : "border-transparent",
          )}
          style={{ backgroundColor: HABIT_COLORS[name] }}
        />
      ))}
    </div>
  );
}
