"use client";

import { useEffect, useState } from "react";
import { TalonMark } from "@/components/brand/talon-mark";

const HABIT_NAMES = [
  "Morning workout", "Read 20 pages", "Evening walk", "Journal",
  "Weekly review", "Drink water", "Meditate", "Stretch", "No sugar", "Sleep 8h",
];

const BASE = [
  { k: "Grip streak", sub: "Morning workout", min: 1, max: 40, suffix: "" },
  { k: "Today", sub: "gripped", min: 1, max: 8, suffix: " / 8" },
  { k: "This week", sub: "hold rate", min: 60, max: 99, suffix: "%" },
];

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function PreviewStats() {
  const [values, setValues] = useState<number[] | null>(null);
  const [sub, setSub] = useState<string>("Morning workout");

  useEffect(() => {
    setValues(BASE.map((b) => rand(b.min, b.max)));
    setSub(HABIT_NAMES[rand(0, HABIT_NAMES.length - 1)]!);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setValues(BASE.map((b) => rand(b.min, b.max)));
      setSub(HABIT_NAMES[rand(0, HABIT_NAMES.length - 1)]!);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mt-20 grid gap-px overflow-hidden rounded-lg border bg-border/60 md:grid-cols-3">
      {BASE.map((s, i) => (
        <div key={s.k} className="flex flex-col justify-between gap-8 bg-card p-6">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <span>{s.k}</span>
            <TalonMark className="h-3.5 w-3.5 text-primary" />
          </div>
          <div>
            <p className="num font-display text-5xl font-semibold tracking-tight">
              {values ? `${values[i]}${s.suffix}` : "—"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{i === 0 ? sub ?? s.sub : s.sub}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
