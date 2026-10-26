"use client";

import { useEffect } from "react";
import { QueryError } from "@/components/shared/query-error";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <QueryError onRetry={reset} />
    </div>
  );
}
