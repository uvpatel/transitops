"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  TruckIcon,
  UserCheckIcon,
  MapPinIcon,
  NavigationIcon,
  WrenchIcon,
  FuelIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  HistoryIcon,
  UsersIcon,
  Building2Icon,
  BellIcon,
  SettingsIcon,
  Truck,
  PlusCircleIcon,
} from "lucide-react";
import { NavUser } from "@/components/nav-user";

const navigationGroups = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
      },
    ],
  },
  {
    label: "Fleet & Drivers",
    items: [
      {
        title: "Vehicles",
        url: "/dashboard/fleet",
        icon: TruckIcon,
      },
      {
        title: "Drivers",
        url: "/dashboard/drivers",
        icon: UserCheckIcon,
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Live Dispatch",
        url: "/dashboard/dispatch",
        icon: MapPinIcon,
      },
      {
        title: "Trips",
        url: "/dashboard/trips",
        icon: NavigationIcon,
      },
    ],
  },
  {
    label: "Maintenance & Expenses",
    items: [
      {
        title: "Maintenance",
        url: "/dashboard/maintenance",
        icon: WrenchIcon,
      },
      {
        title: "Fuel Logs",
        url: "/dashboard/fuel",
        icon: FuelIcon,
      },
      {
        title: "Expenses",
        url: "/dashboard/expenses",
        icon: ReceiptIcon,
      },
    ],
  },
  {
    label: "Compliance & Intelligence",
    items: [
      {
        title: "Compliance",
        url: "/dashboard/compliance",
        icon: ShieldCheckIcon,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3Icon,
      },
      {
        title: "Audit Logs",
        url: "/dashboard/audit",
        icon: HistoryIcon,
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Users & RBAC",
        url: "/dashboard/users",
        icon: UsersIcon,
      },
      {
        title: "Organizations",
        url: "/dashboard/organizations",
        icon: Building2Icon,
      },
      {
        title: "Notifications",
        url: "/dashboard/notifications",
        icon: BellIcon,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: SettingsIcon,
      },
    ],
  },
];

const mockUser = {
  name: "Fleet Manager",
  email: "admin@transitops.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-border/40" {...props}>
      <SidebarHeader className="border-b border-border/40 px-4 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="hover:bg-accent/50">
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                  <Truck className="size-5" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-base tracking-tight">TransitOps</span>
                  <span className="truncate text-xs text-muted-foreground font-medium">Fleet Operations</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-2 scrollbar-none">
        {navigationGroups.map((group, idx) => (
          <React.Fragment key={group.label}>
            {idx > 0 && <SidebarSeparator className="my-2" />}
            <SidebarGroup>
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 px-2 py-1">
                {group.label}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => {
                    const isActive = pathname === item.url || (item.url !== "/dashboard" && pathname.startsWith(item.url));
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          
                          tooltip={item.title}
                          isActive={isActive}
                          className={`transition-colors duration-150 ${
                            isActive
                              ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }`}
                        >
                          <Link href={item.url} className="flex items-center gap-3">
                            <Icon className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </React.Fragment>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-border/40 p-2">
        <NavUser user={mockUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
