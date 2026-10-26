import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { TalonLogo } from "@/components/brand/talon-logo";
import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="border-b border-border/60">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <TalonLogo className="h-9 w-auto" />
        </Link>
        <nav className="hidden items-center gap-8 text-[13px] text-muted-foreground md:flex">
          <a href="#how" className="hover:text-foreground">
            How it grips
          </a>
          <a href="#faq" className="hover:text-foreground">
            FAQ
          </a>
        </nav>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">
              Start <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
