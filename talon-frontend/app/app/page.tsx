import type { Metadata } from "next";
import { DashboardView } from "@/components/dashboard/dashboard-view";

export const metadata: Metadata = { title: "The Perch" };

export default function PerchPage() {
  return <DashboardView />;
}
