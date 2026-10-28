import type { Metadata } from "next";
import { EditHabitView } from "@/components/habits/edit-habit-view";

export const metadata: Metadata = { title: "Edit habit" };

export default async function EditHabitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditHabitView id={id} />;
}
