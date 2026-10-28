import type { Metadata } from "next";
import { Begin } from "@/components/landing/begin";
import { Faq } from "@/components/landing/faq";
import { Hero } from "@/components/landing/hero";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { Mechanics } from "@/components/landing/mechanics";
import { Ritual } from "@/components/landing/ritual";

export const metadata: Metadata = {
  title: "Talon — grip your habits, hold the line",
  description:
    "A quiet, edgy habit tracker. Grip your day, protect your streak. No guilt, no gamified fluff — just the branch, and your claws around it.",
};

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="h-px w-full bg-primary/40" />
      <LandingHeader />
      <main>
        <Hero />
        <Ritual />
        <Mechanics />
        <Begin />
        <Faq />
      </main>
      <LandingFooter />
    </div>
  );
}
