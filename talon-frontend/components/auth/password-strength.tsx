const LABELS = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
const COLORS = [
  "bg-destructive",
  "bg-destructive",
  "bg-warning",
  "bg-warning",
  "bg-success",
  "bg-success",
];

function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

export function PasswordStrength({ password }: { password: string }) {
  const score = scorePassword(password);

  return (
    <>
      <div className="flex gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i < score ? COLORS[score] : "bg-muted"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {password ? LABELS[score] : "12+ chars, upper/lower/number/symbol"}
      </p>
    </>
  );
}
