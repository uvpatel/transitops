"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BadgeCheckIcon,
  BellIcon,
  Building2Icon,
  ChevronDownIcon,
  PlusIcon,
  SearchIcon,
  TruckIcon,
  UserPlusIcon,
  NavigationIcon,
  ReceiptIcon,
  WrenchIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "./toggler";

const pathMap: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/fleet": "Fleet Vehicles",
  "/dashboard/drivers": "Driver Roster",
  "/dashboard/dispatch": "Live Dispatch & Tracking",
  "/dashboard/trips": "Trips & Logistics",
  "/dashboard/maintenance": "Maintenance & Work Orders",
  "/dashboard/fuel": "Fuel Logs & Efficiency",
  "/dashboard/expenses": "Expenses & Claims",
  "/dashboard/compliance": "Compliance & Safety",
  "/dashboard/analytics": "Analytics & Intelligence",
  "/dashboard/audit": "Audit Logs",
  "/dashboard/users": "Users & Access Control",
  "/dashboard/organizations": "Organizations",
  "/dashboard/notifications": "Notifications Center",
  "/dashboard/settings": "System Settings",
  "/dashboard/profile": "User Profile",
};

export function SiteHeader() {
  const pathname = usePathname();
  const title = pathMap[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b bg-background/95 px-4 backdrop-blur transition-all lg:px-6">
      {/* Left section: Sidebar trigger & Title */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex items-center gap-2">
          <h1 className="text-sm font-semibold tracking-tight md:text-base">{title}</h1>
          <Badge variant="outline" className="hidden text-[10px] font-medium text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-400 sm:inline-flex">
            Live Telematics
          </Badge>
        </div>
      </div>

      {/* Right section: Search, Organization Switcher, Notifications, Quick Actions */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <SearchIcon className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vehicles, trips..."
            className="h-9 w-full bg-muted/50 pl-8 pr-4 text-xs focus:bg-background"
          />
        </div>

        {/* Organization Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="sm" className="h-9 gap-1.5 px-2.5 text-xs font-medium border border-border/50">
                <Building2Icon className="size-3.5 text-primary" />
                <span className="hidden sm:inline-block max-w-[100px] truncate">TransitOps Global</span>
                <ChevronDownIcon className="size-3 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">Select Organization</DropdownMenuLabel>
              <DropdownMenuItem className="gap-2 font-medium">
                <Building2Icon className="size-4 text-primary" />
                <span>TransitOps Global</span>
                <BadgeCheckIcon className="ml-auto size-4 text-emerald-500" />
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-muted-foreground">
                <Building2Icon className="size-4" />
                <span>Apex Logistics LLC</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Link href="/dashboard/organizations" className="text-xs text-primary font-medium w-full">
                Manage Organizations →
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative size-9 text-muted-foreground hover:text-foreground">
          <BellIcon className="size-4" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-background" />
          <span className="sr-only">Notifications</span>
        </Button>
        <ModeToggle />

        {/* Quick Action Button */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button size="sm" className="h-9 gap-1.5 px-3 text-xs font-semibold shadow-sm">
                <PlusIcon className="size-4" />
                <span className="hidden sm:inline-block">Quick Action</span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs">Create New Record</DropdownMenuLabel>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/dashboard/trips" className="flex items-center gap-2 w-full">
                  <NavigationIcon className="size-2 text-blue-500" />
                  <span>Create Trip</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/dashboard/fleet" className="flex items-center gap-2 w-full">
                  <TruckIcon className="size-4 text-emerald-500" />
                  <span>Add Vehicle</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/dashboard/drivers" className="flex items-center gap-2 w-full">
                  <UserPlusIcon className="size-4 text-purple-500" />
                  <span>Register Driver</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/dashboard/expenses" className="flex items-center gap-2 w-full">
                  <ReceiptIcon className="size-4 text-amber-500" />
                  <span>File Expense</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/dashboard/maintenance" className="flex items-center gap-2 w-full">
                  <WrenchIcon className="size-4 text-rose-500" />
                  <span>Schedule Service</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
