"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { TalonMark } from "@/components/brand/talon-mark";
import { LOGIN_PATH } from "@/lib/auth/constants";
import { useAuth } from "@/lib/auth/use-auth";

export function AuthGate({ children }: { children: ReactNode }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`${LOGIN_PATH}?next=${encodeURIComponent(pathname)}`);
    }
  }, [status, pathname, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background">
        <TalonMark className="h-8 w-8 animate-pulse text-primary" />
      </div>
    );
  }

  return children;
}
