"use client";

import { Archive, ArchiveRestore, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { TalonMark } from "@/components/brand/talon-mark";
import { GripSlipButtons } from "@/components/habits/grip-slip-buttons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArchiveHabit, useRestoreHabit } from "@/hooks/queries/use-habits";
import { toastApiError } from "@/lib/api/toast-error";
import type { DashboardHabit, Habit } from "@/lib/api/types";
import { formatSchedule } from "@/lib/format";
import { getHabitColor } from "@/lib/habit-colors";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

type CardHabit = Pick<
  Habit,
  "id" | "name" | "description" | "color" | "icon" | "frequency" | "weekdays" | "reminderTime"
>;

type HabitCardProps = {
  habit: CardHabit;
  status?: DashboardHabit["status"];
  streak?: number;
  archived?: boolean;
};

const COMPLETED_STYLES =
  "border-primary/50 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_20%,transparent),0_20px_60px_-30px_var(--primary)]";

export function HabitCard({ habit, status = null, streak = 0, archived = false }: HabitCardProps) {
  const archive = useArchiveHabit();
  const restore = useRestoreHabit();
  const Icon = getIcon(habit.icon);
  const color = getHabitColor(habit.color);
  const completed = status === "completed";

  const schedule = [formatSchedule(habit.frequency, habit.weekdays), habit.reminderTime]
    .filter(Boolean)
    .join(" · ");

  function handleArchive() {
    archive.mutate(habit.id, {
      onSuccess: () => toast.success("Habit archived"),
      onError: toastApiError,
    });
  }

  function handleRestore() {
    restore.mutate(habit.id, {
      onSuccess: () => toast.success("Habit restored"),
      onError: toastApiError,
    });
  }

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 rounded-xl border bg-card p-5 transition",
        completed ? COMPLETED_STYLES : "hover:border-primary/40",
      )}
    >
      {completed && (
        <span
          aria-hidden
          className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_12px_2px_var(--primary)]"
        />
      )}

      <div className="flex items-start gap-3">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border"
          style={{ borderColor: `${color}55`, backgroundColor: `${color}18`, color }}
        >
          {/* eslint-disable-next-line react-hooks/static-components */}
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/app/habits/${habit.id}`}
            className="block truncate font-display font-semibold hover:text-primary"
          >
            {habit.name}
          </Link>
          {habit.description && (
            <p className="line-clamp-1 text-sm text-muted-foreground">{habit.description}</p>
          )}
          <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            {schedule}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="-mr-2 -mt-1 h-8 w-8 shrink-0 text-muted-foreground"
              aria-label={`Options for ${habit.name}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/app/habits/${habit.id}/edit`}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </Link>
            </DropdownMenuItem>
            {archived ? (
              <DropdownMenuItem onSelect={handleRestore} disabled={restore.isPending}>
                <ArchiveRestore className="mr-2 h-4 w-4" /> Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onSelect={handleArchive} disabled={archive.isPending}>
                <Archive className="mr-2 h-4 w-4" /> Archive
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center justify-between border-t border-border/60 pt-4">
          <div className="flex items-center gap-2">
            <TalonMark className="h-4 w-4 text-primary" />
            <span className="num font-display text-lg font-semibold">{streak}</span>
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              grip streak
            </span>
          </div>
          <GripSlipButtons habitId={habit.id} habitName={habit.name} status={status} />
        </div>
    </div>
  );
}
