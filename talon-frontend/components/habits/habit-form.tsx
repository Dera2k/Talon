"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { ColorPicker } from "@/components/habits/color-picker";
import { FrequencyPicker } from "@/components/habits/frequency-picker";
import { HabitPreview } from "@/components/habits/habit-preview";
import { IconPicker } from "@/components/habits/icon-picker";
import { WeekdayPicker } from "@/components/habits/weekday-picker";
import { FieldError, FormAlert } from "@/components/shared/form-feedback";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateHabit, useUpdateHabit } from "@/hooks/queries/use-habits";
import { toFormErrors } from "@/lib/api/form-errors";
import type { CreateHabitInput, Habit, HabitFrequency } from "@/lib/api/types";
import { ALL_WEEKDAYS, DEFAULT_REMINDER_TIME, HABIT_LIMITS } from "@/lib/constants";
import { DEFAULT_HABIT_COLOR, type HabitColorName } from "@/lib/habit-colors";

const FIELDS = [
  "name",
  "description",
  "category",
  "reminderTime",
  "frequency",
  "weekdays",
  "color",
  "icon",
] as const;

const DEFAULT_ICON = "target";
const DEFAULT_WEEKLY_DAYS = [1];

export function HabitForm({ habit }: { habit?: Habit }) {
  const router = useRouter();
  const create = useCreateHabit();
  const update = useUpdateHabit(habit?.id ?? "");

  const [name, setName] = useState(habit?.name ?? "");
  const [description, setDescription] = useState(habit?.description ?? "");
  const [category, setCategory] = useState(habit?.category ?? "");
  const [reminderTime, setReminderTime] = useState(habit?.reminderTime ?? DEFAULT_REMINDER_TIME);
  const [frequency, setFrequency] = useState<HabitFrequency>(habit?.frequency ?? "daily");
  const [weekdays, setWeekdays] = useState<number[]>(
    habit?.frequency === "weekly" ? habit.weekdays : DEFAULT_WEEKLY_DAYS,
  );
  const [color, setColor] = useState<HabitColorName>(habit?.color ?? DEFAULT_HABIT_COLOR);
  const [icon, setIcon] = useState(habit?.icon ?? DEFAULT_ICON);
  const [weekdayError, setWeekdayError] = useState<string>();

  const error = habit ? update.error : create.error;
  const errors = error ? toFormErrors(error, FIELDS) : null;
  const busy = create.isPending || update.isPending || create.isSuccess || update.isSuccess;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (frequency === "weekly" && weekdays.length === 0) {
      setWeekdayError("Pick at least one day.");
      return;
    }
    setWeekdayError(undefined);

    const payload: CreateHabitInput = {
      name: name.trim(),
      description: description.trim() || null,
      category: category.trim() || null,
      reminderTime,
      frequency,
      weekdays: frequency === "daily" ? ALL_WEEKDAYS : weekdays,
      color,
      icon,
    };

    if (habit) {
      update.mutate(payload, {
        onSuccess: () => {
          toast.success("Habit updated");
          router.push(`/app/habits/${habit.id}`);
        },
      });
    } else {
      create.mutate(payload, {
        onSuccess: () => {
          toast.success("Habit created");
          router.push("/app/habits");
        },
      });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Link
        href="/app/habits"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to habits
      </Link>
      <h2 className="font-display text-3xl font-semibold tracking-tight">
        {habit ? "Edit habit" : "Create a habit"}
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Small, consistent, repeatable. That’s the whole trick.
      </p>

      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <HabitPreview name={name} description={description} color={color} icon={icon} />

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={HABIT_LIMITS.name}
            required
          />
          <FieldError message={errors?.fields.name} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={HABIT_LIMITS.description}
            rows={3}
          />
          <FieldError message={errors?.fields.description} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              maxLength={HABIT_LIMITS.category}
              placeholder="Health, Growth, Work…"
            />
            <FieldError message={errors?.fields.category} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Reminder time</Label>
            <div className="flex gap-2">
              <select
                className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
                value={reminderTime.split(":")[0] ?? "08"}
                onChange={(e) =>
                  setReminderTime(`${e.target.value}:${reminderTime.split(":")[1] ?? "00"}`)
                }
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="self-center text-muted-foreground">:</span>
              <select
                className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm"
                value={reminderTime.split(":")[1] ?? "00"}
                onChange={(e) =>
                  setReminderTime(`${reminderTime.split(":")[0] ?? "08"}:${e.target.value}`)
                }
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={String(i * 5).padStart(2, "0")}>
                    {String(i * 5).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
            <FieldError message={errors?.fields.reminderTime} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Frequency</Label>
          <FrequencyPicker value={frequency} onChange={setFrequency} />
          <FieldError message={errors?.fields.frequency} />
        </div>

        {frequency === "weekly" && (
          <div className="space-y-2">
            <Label>Days of the week</Label>
            <WeekdayPicker value={weekdays} onChange={setWeekdays} />
            <FieldError message={weekdayError ?? errors?.fields.weekdays} />
          </div>
        )}

        <div className="space-y-2">
          <Label>Color</Label>
          <ColorPicker value={color} onChange={setColor} />
          <FieldError message={errors?.fields.color} />
        </div>

        <div className="space-y-2">
          <Label>Icon</Label>
          <IconPicker value={icon} onChange={setIcon} />
          <FieldError message={errors?.fields.icon} />
        </div>

        <FormAlert message={errors?.general} />

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => router.push("/app/habits")}>
            Cancel
          </Button>
          <Button type="submit" disabled={busy}>
            {habit ? "Save changes" : "Create habit"}
          </Button>
        </div>
      </form>
    </div>
  );
}
