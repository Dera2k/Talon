"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { TalonLogo } from "@/components/brand/talon-logo";
import { TalonMark } from "@/components/brand/talon-mark";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMe } from "@/hooks/queries/use-me";
import { useAuth } from "@/lib/auth/use-auth";
import { isNavActive, NAV_ITEMS } from "@/lib/nav";

function SidebarNav() {
  const pathname = usePathname();
  const tab = useSearchParams().get("tab");

  return (
    <SidebarMenu>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isNavActive(item.href, pathname, tab)}
              tooltip={item.title}
            >
              <Link href={item.href}>
                <Icon />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

function SidebarUser() {
  const { data: me } = useMe();
  if (!me) return null;

  const name = [me.firstName, me.lastName].filter(Boolean).join(" ") || me.email;
  const initials =
    (me.firstName?.[0] ?? me.email[0] ?? "").toUpperCase() +
    (me.lastName?.[0] ?? "").toUpperCase();

  return (
    <div className="flex items-center gap-3 p-2">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-primary/60 bg-primary/10 text-xs font-medium text-primary">
        {initials}
      </div>
      <div className="min-w-0 group-data-[collapsible=icon]:hidden">
        <p className="truncate text-sm font-medium">{name}</p>
        <p className="truncate text-xs text-muted-foreground">{me.email}</p>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { logout } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <Link href="/app" aria-label="Talon">
          <TalonLogo className="h-8 w-auto group-data-[collapsible=icon]:hidden" />
          <TalonMark className="hidden h-6 w-6 text-primary group-data-[collapsible=icon]:block" />
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Nest</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={null}>
              <SidebarNav />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Log out" onClick={() => void logout()}>
              <LogOut />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
