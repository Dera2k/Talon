import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function EmptyState({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-dashed bg-card/40 p-12 text-center text-sm text-muted-foreground",
        className,
      )}
    >
      {children}
    </div>
  );
}
