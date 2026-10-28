"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

export const WeekdayChartLazy = dynamic(
  () => import("@/components/analytics/weekday-chart").then((module) => module.WeekdayChart),
  { ssr: false, loading: () => <Skeleton className="h-64 w-full rounded-lg" /> },
);
