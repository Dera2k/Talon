import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/app/providers";
import { AppShell } from "@/components/layout/app-shell";
import { AuthGate } from "@/components/layout/auth-gate";
import { AuthProvider } from "@/lib/auth/auth-provider";

export const metadata: Metadata = {
  title: { template: "%s — Talon", default: "Talon" },
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthProvider>
        <AuthGate>
          <AppShell>{children}</AppShell>
        </AuthGate>
      </AuthProvider>
    </Providers>
  );
}
