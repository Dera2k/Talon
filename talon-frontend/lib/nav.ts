import {
  Archive,
  BarChart3,
  LayoutDashboard,
  ListChecks,
  Settings,
  type LucideIcon,
} from "lucide-react";

export const HABITS_PATH = "/app/habits";
export const ARCHIVED_HREF = `${HABITS_PATH}?tab=archived`;

type NavItem = { title: string; href: string; icon: LucideIcon };

export const NAV_ITEMS: NavItem[] = [
  { title: "Perch", href: "/app", icon: LayoutDashboard },
  { title: "Habits", href: HABITS_PATH, icon: ListChecks },
  { title: "Roost", href: ARCHIVED_HREF, icon: Archive },
  { title: "Analytics", href: "/app/analytics", icon: BarChart3 },
  { title: "Settings", href: "/app/settings", icon: Settings },
];

const PAGE_TITLES: Record<string, string> = {
  "/app": "The Perch",
  [HABITS_PATH]: "Habits",
  [`${HABITS_PATH}/new`]: "New habit",
  "/app/analytics": "Analytics",
  "/app/settings": "Settings",
};

export function getPageTitle(pathname: string): string {
  const exact = PAGE_TITLES[pathname];
  if (exact) return exact;
  if (pathname.startsWith(`${HABITS_PATH}/`)) {
    return pathname.endsWith("/edit") ? "Edit habit" : "Habit details";
  }
  return "Talon";
}

// Habits and Roost share a path, so the ?tab= value decides which one is active.
export function isNavActive(href: string, pathname: string, tab: string | null): boolean {
  const [path, query] = href.split("?");
  if (!path) return false;
  if (path === "/app") return pathname === "/app";
  if (path === HABITS_PATH) {
    const onArchivedList = pathname === HABITS_PATH && tab === "archived";
    return pathname.startsWith(HABITS_PATH) && (query === "tab=archived") === onArchivedList;
  }
  return pathname.startsWith(path);
}
