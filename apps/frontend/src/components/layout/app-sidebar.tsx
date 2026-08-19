"use client";

import { BriefcaseBusiness, LayoutDashboard, Users, UserSearch } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { CurrentUser } from "@/types/auth";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Positions",
    href: "/positions",
    icon: BriefcaseBusiness,
  },
  {
    label: "Applicants",
    href: "/applicants",
    icon: UserSearch,
  },
  {
    label: "Users",
    href: "/users",
    icon: Users,
    adminOnly: true,
  },
];

export function AppSidebar({ user }: { user: CurrentUser }) {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) => !item.adminOnly || user.role === "ADMIN");

  return (
    <aside className="border-b bg-sidebar text-sidebar-foreground md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="flex min-h-16 flex-col justify-center border-b px-4 py-3 md:px-5">
        <Link href="/dashboard" className="text-base font-semibold tracking-tight">
          Recruitment Platform
        </Link>
        <p className="truncate text-xs text-muted-foreground">{user.companyName}</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto p-3 md:flex-col md:gap-1.5 md:overflow-visible md:p-4">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm",
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
