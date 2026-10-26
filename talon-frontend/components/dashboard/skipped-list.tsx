export function SkippedList({ habits }: { habits: { id: string; name: string }[] }) {
  if (habits.length === 0) return null;

  return (
    <details className="mt-6 rounded-xl border bg-card/40 p-4">
      <summary className="cursor-pointer text-sm text-muted-foreground">
        {habits.length} skipped today
      </summary>
      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
        {habits.map((habit) => (
          <li key={habit.id}>· {habit.name}</li>
        ))}
      </ul>
    </details>
  );
}
