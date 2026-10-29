import { TalonMark } from "@/components/brand/talon-mark";

export function LandingFooter() {
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 text-xs text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2">
          <TalonMark className="h-3.5 w-3.5 text-primary" />
          <span className="font-mono uppercase tracking-[0.22em]">© 2026 Talon</span>
        </div>
        <div className="flex gap-8 font-mono uppercase tracking-[0.22em]">
          <a href="/privacy" className="hover:text-foreground">
            Privacy
          </a>
          <a href="/terms" className="hover:text-foreground">
            Terms
          </a>
          <a href="#" className="hover:text-foreground">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
