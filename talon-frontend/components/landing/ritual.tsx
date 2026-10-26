const STEPS = [
  { n: "01", t: "Perch", body: "Your day lands here. Habits laid out, quiet and legible. No noise." },
  {
    n: "02",
    t: "Grip",
    body: "One tap locks the claw. Slip, and the streak breaks — but a day still pending never counts against you.",
  },
  {
    n: "03",
    t: "Roost",
    body: "Habits that go automatic move to the Roost. Mastered. Off your mind.",
  },
];

export function Ritual() {
  return (
    <section id="how" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-4 py-24">
        <div className="grid gap-16 md:grid-cols-[1fr,2fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
              § 01 — Ritual
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Three moves.
              <br />
              That’s the app.
            </h2>
          </div>
          <div className="grid gap-px bg-border/60 md:grid-cols-3">
            {STEPS.map((f) => (
              <div key={f.n} className="flex flex-col gap-6 bg-card p-6">
                <span className="num text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {f.n}
                </span>
                <h3 className="font-display text-2xl font-semibold">{f.t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
