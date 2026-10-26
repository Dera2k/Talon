export function GripRateCard({ rate }: { rate: number }) {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Grip rate</div>
      <div className="mt-3 flex items-end justify-between">
        <p className="num font-display text-3xl font-semibold">{rate}%</p>
        <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">today</p>
      </div>
      <div className="mt-3 h-1 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}
