"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { HabitCard } from "@/components/habits/habit-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PageHeader } from "@/components/shared/page-header";
import { QueryError } from "@/components/shared/query-error";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useHabits } from "@/hooks/queries/use-habits";
import { cn } from "@/lib/utils";

type Tab = "active" | "archived";

const PAGE_SIZE = 20;

const TABS: { value: Tab; label: string; href: string }[] = [
  { value: "active", label: "Active", href: "/app/habits" },
  { value: "archived", label: "Archived", href: "/app/habits?tab=archived" },
];

export function HabitsList() {
  const tab: Tab = useSearchParams().get("tab") === "archived" ? "archived" : "active";
  return <HabitsListContent key={tab} tab={tab} />;
}

function HabitsListContent({ tab }: { tab: Tab }) {
  const [page, setPage] = useState(1);
  const habits = useHabits({
    page,
    limit: PAGE_SIZE,
    archived: tab === "archived" ? true : undefined,
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <PageHeader
        className="mb-6"
        title="Your habits"
        description="Everything you’re tracking."
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-md border p-1 text-sm">
              {TABS.map((item) => (
                <Link
                  key={item.value}
                  href={item.href}
                  aria-current={tab === item.value ? "page" : undefined}
                  className={cn(
                    "rounded px-3 py-1 transition",
                    tab === item.value
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <Button asChild size="sm">
              <Link href="/app/habits/new">
                <Plus className="mr-1 h-4 w-4" /> New
              </Link>
            </Button>
          </div>
        }
      />

      {habits.isPending ? (
        <div className="grid gap-4 md:grid-cols-2" aria-busy="true">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      ) : habits.isError ? (
        <QueryError message="Couldn’t load your habits." onRetry={() => void habits.refetch()} />
      ) : habits.data.items.length === 0 ? (
        <EmptyState>
          {tab === "active"
            ? "No active habits. Create one to get started."
            : "No archived habits."}
        </EmptyState>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {habits.data.items.map((habit) => (
              <HabitCard key={habit.id} habit={habit} archived={tab === "archived"} />
            ))}
          </div>
          {habits.data.meta.totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="num">
                {page} / {habits.data.meta.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= habits.data.meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
