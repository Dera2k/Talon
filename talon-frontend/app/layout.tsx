import type { Metadata } from "next";
import type { ReactNode } from "react";
import { dmSans, jetbrainsMono, spaceGrotesk } from "@/lib/fonts";
import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talon — habit tracking that respects your streaks",
  description: "Talon is a quiet habit tracker. Grip your day, protect your streak.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "Talon — habit tracking that respects your streaks",
    description: "Track daily and weekly habits. Clear analytics. Made for consistency.",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}