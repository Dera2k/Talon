import type { Metadata } from "next";
import { Suspense } from "react";
import { HabitsList } from "@/components/habits/habits-list";
import { HabitsListSkeleton } from "@/components/habits/habits-list-skeleton";

export const metadata: Metadata = { title: "All habits" };

export default function HabitsPage() {
  return (
    <Suspense fallback={<HabitsListSkeleton />}>
      <HabitsList />
    </Suspense>
  );
}
