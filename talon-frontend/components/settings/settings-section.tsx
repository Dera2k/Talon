import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SettingsSectionProps = { title: string; children: ReactNode; tone?: "danger" };

export function SettingsSection({ title, children, tone }: SettingsSectionProps) {
  return (
    <section
      className={cn("rounded-2xl border bg-card p-6", tone === "danger" && "border-destructive/30")}
    >
      <h3 className="mb-4 font-display text-xl font-semibold">{title}</h3>
      {children}
    </section>
  );
}
