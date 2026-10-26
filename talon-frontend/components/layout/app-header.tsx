"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getPageTitle } from "@/lib/nav";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur">
      <SidebarTrigger className="-ml-1" />
      <div className="h-4 w-px bg-border" />
      <h1 className="font-display text-sm font-medium tracking-wide text-muted-foreground">
        {getPageTitle(pathname)}
      </h1>
      <div className="ml-auto flex items-center gap-2">
        <Button size="sm" asChild>
          <Link href="/app/habits/new">
            <Plus className="mr-1 h-4 w-4" /> New habit
          </Link>
        </Button>
      </div>
    </header>
  );
}
