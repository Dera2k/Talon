import type { Metadata } from "next";
import { HabitDetail } from "@/components/habits/habit-detail";

export const metadata: Metadata = { title: "Habit" };

export default async function HabitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HabitDetail id={id} />;
}
