import type { ComponentType } from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  label: string;
  value: string;
  icon: ComponentType<{ className?: string }>;
  tint: string;
  sub?: string;
  variant?: "perch" | "analytics";
};

const VARIANTS = {
  perch: {
    card: "rounded-xl",
    label: "text-[10px] tracking-[0.18em]",
    icon: "h-3 w-3",
    value: "num mt-3 font-display text-3xl font-semibold",
  },
  analytics: {
    card: "rounded-2xl",
    label: "text-xs tracking-wide",
    icon: "h-3.5 w-3.5",
    value: "mt-3 font-display text-3xl font-semibold",
  },
} as const;

export function StatCard({ label, value, icon: Icon, tint, sub, variant = "perch" }: StatCardProps) {
  const v = VARIANTS[variant];

  return (
    <div className={cn("border bg-card p-5", v.card)}>
      <div className={cn("flex items-center gap-2 uppercase text-muted-foreground", v.label)}>
        <Icon className={cn(v.icon, tint)} />
        {label}
      </div>
      <p className={v.value}>{value}</p>
      {sub && <p className="mt-1 truncate text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}
