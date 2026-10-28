import type { Metadata } from "next";
import { HabitForm } from "@/components/habits/habit-form";

export const metadata: Metadata = { title: "New habit" };

export default function NewHabitPage() {
  return <HabitForm />;
}
