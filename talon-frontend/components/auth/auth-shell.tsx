import Link from "next/link";
import type { ReactNode } from "react";
import { TalonLogo } from "@/components/brand/talon-logo";
import { TalonMark } from "@/components/brand/talon-mark";

type AuthShellProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="grid min-h-dvh bg-background lg:grid-cols-2">
      <main className="flex flex-col justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="inline-flex">
            <TalonLogo className="h-10 w-auto" />
          </Link>
          <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.22em] text-primary">
            § Access
          </p>
          <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </div>
      </main>

      <aside className="relative hidden overflow-hidden border-l border-border bg-card bg-scan p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex h-12 w-12 items-center justify-center rounded-lg border border-primary/40 bg-primary/10 text-primary">
          <TalonMark className="h-6 w-6" />
        </div>
        <figure className="relative">
          <blockquote className="font-display text-3xl font-semibold leading-tight tracking-tight">
            “Twenty-seven mornings. Missed one Tuesday. The claw stayed shut.”
          </blockquote>
          <figcaption className="mt-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Maya · gripping since June
          </figcaption>
        </figure>
      </aside>
    </div>
  );
}
