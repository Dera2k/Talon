"use client";

import { Archive, ArchiveRestore, Pencil } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useArchiveHabit, useRestoreHabit } from "@/hooks/queries/use-habits";
import { toastApiError } from "@/lib/api/toast-error";

type HabitActionsProps = { id: string; archived: boolean };

export function HabitActions({ id, archived }: HabitActionsProps) {
  const archive = useArchiveHabit();
  const restore = useRestoreHabit();

  function toggleArchive() {
    if (archived) {
      restore.mutate(id, { onSuccess: () => toast.success("Restored"), onError: toastApiError });
    } else {
      archive.mutate(id, { onSuccess: () => toast.success("Archived"), onError: toastApiError });
    }
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/app/habits/${id}/edit`}>
          <Pencil className="mr-1 h-4 w-4" /> Edit
        </Link>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={toggleArchive}
        disabled={archive.isPending || restore.isPending}
      >
        {archived ? (
          <ArchiveRestore className="mr-1 h-4 w-4" />
        ) : (
          <Archive className="mr-1 h-4 w-4" />
        )}
        {archived ? "Restore" : "Archive"}
      </Button>
    </div>
  );
}
