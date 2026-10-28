import type { Metadata } from "next";
import { Suspense } from "react";
import { HabitsList } from "@/components/habits/habits-list";

export const metadata: Metadata = { title: "All habits" };

export default function HabitsPage() {
  return (
    <Suspense fallback={null}>
      <HabitsList />
    </Suspense>
  );
}
