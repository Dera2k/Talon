import { api } from "@/lib/api/client";
import type { Dashboard } from "@/lib/api/types";

export const dashboardApi = {
  today: () => api.get<Dashboard>("/dashboard/today"),
};
