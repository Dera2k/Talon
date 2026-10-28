import { HabitCardGridSkeleton } from "@/components/habits/habit-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export function HabitsListSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Skeleton className="h-9 w-48" />
      </div>
      <HabitCardGridSkeleton />
    </div>
  );
}
