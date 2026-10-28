import Link from "next/link";

export default function HabitNotFound() {
  return (
    <div className="p-12 text-center text-sm text-muted-foreground">
      Habit not found.{" "}
      <Link href="/app/habits" className="text-primary hover:underline">
        Back to habits
      </Link>
    </div>
  );
}
