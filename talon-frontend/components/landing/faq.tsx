const QUESTIONS = [
  {
    q: "How does the grip actually work?",
    a: "Your grip breaks when you slip or let a due day pass unlogged. A day that’s still pending never counts against you.",
  },
  { q: "Timezones?", a: "Everything’s local. Midnight is your midnight. Reminders too." },
  {
    q: "What’s the Roost?",
    a: "The archive. Mastered habits move there — history intact, reminders off.",
  },
  {
    q: "Can I log yesterday?",
    a: "Yes. You can log today and the seven days before it. Logging a day again overwrites it.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-b border-border/60">
      <div className="mx-auto max-w-4xl px-4 py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
          § 04 — Questions
        </p>
        <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">FAQ.</h2>
        <dl className="mt-12 divide-y divide-border/60 border-y border-border/60">
          {QUESTIONS.map((f) => (
            <div key={f.q} className="grid gap-2 py-6 md:grid-cols-[1fr,2fr] md:gap-8">
              <dt className="font-display text-lg font-semibold">{f.q}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
