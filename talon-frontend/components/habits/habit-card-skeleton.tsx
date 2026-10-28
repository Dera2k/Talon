import { Skeleton } from "@/components/ui/skeleton";

type HabitCardGridSkeletonProps = {
  count?: number;
  // Perch cards include the Grip/Slip row, so they're taller than list cards.
  tall?: boolean;
};

export function HabitCardGridSkeleton({ count = 4, tall = false }: HabitCardGridSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} className={tall ? "h-36 rounded-xl" : "h-28 rounded-xl"} />
      ))}
    </div>
  );
}
