import { getHabitColor, type HabitColorName } from "@/lib/habit-colors";
import { getIcon } from "@/lib/icons";

type HabitPreviewProps = {
  name: string;
  description: string;
  color: HabitColorName;
  icon: string;
};

export function HabitPreview({ name, description, color, icon }: HabitPreviewProps) {
  const Icon = getIcon(icon);
  const hex = getHabitColor(color);

  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card p-5">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${hex}22`, color: hex }}
      >
        {/* eslint-disable-next-line react-hooks/static-components */}
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg font-semibold">{name || "Your habit"}</p>
        <p className="truncate text-sm text-muted-foreground">
          {description || "Preview updates as you type."}
        </p>
      </div>
    </div>
  );
}
