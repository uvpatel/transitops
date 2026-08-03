import { NavigationGroup } from "@/types/navigation";
import {
  LayoutDashboardIcon,
  BarChart3Icon,
  FileSpreadsheetIcon,
  TruckIcon,
  UserCheckIcon,
  NavigationIcon,
  MapPinIcon,
  WrenchIcon,
  FuelIcon,
  ShieldCheckIcon,
  ReceiptIcon,
  CheckSquareIcon,
  TrendingUpIcon,
  UsersIcon,
  ShieldIcon,
  HistoryIcon,
  Building2Icon,
  SettingsIcon,
  BellIcon,
  UserIcon,
} from "lucide-react";

export const navigationGroups: NavigationGroup[] = [
  {
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboardIcon,
        permission: "dashboard.view",
      },
      {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3Icon,
        permission: "analytics.view",
      },
      {
        title: "Reports",
        href: "/reports",
        icon: FileSpreadsheetIcon,
        permission: "reports.export",
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Fleet Vehicles",
        href: "/fleet",
        icon: TruckIcon,
        permission: "vehicles.read",
      },
      {
        title: "Driver Roster",
        href: "/drivers",
        icon: UserCheckIcon,
        permission: "drivers.read",
      },
      {
        title: "Trips & Logistics",
        href: "/trips",
        icon: NavigationIcon,
        permission: "trips.read",
      },
      {
        title: "Live Dispatch",
        href: "/dispatch",
        icon: MapPinIcon,
        permission: "dispatch.view",
      },
    ],
  },
  {
    label: "Asset Management",
    items: [
      {
        title: "Maintenance",
        href: "/maintenance",
        icon: WrenchIcon,
        permission: "maintenance.read",
      },
      {
        title: "Fuel Logs",
        href: "/fuel",
        icon: FuelIcon,
        permission: "fuel.read",
      },
      {
        title: "Compliance & Safety",
        href: "/compliance",
        icon: ShieldCheckIcon,
        permission: "compliance.read",
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        title: "Expenses & Claims",
        href: "/expenses",
        icon: ReceiptIcon,
        permission: "expenses.read",
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "Users & Accounts",
        href: "/users",
        icon: UsersIcon,
        permission: "users.read",
      },
      {
        title: "Roles & Permissions",
        href: "/roles",
        icon: ShieldIcon,
        permission: "roles.read",
      },
      {
        title: "Audit Logs",
        href: "/audit-logs",
        icon: HistoryIcon,
        permission: "audit.read",
      },
      {
        title: "Organization",
        href: "/organization",
        icon: Building2Icon,
        permission: "organization.read",
      },
      {
        title: "Settings",
        href: "/settings",
        icon: SettingsIcon,
        permission: "settings.read",
      },
    ],
  },
  {
    label: "Personal",
    items: [
      {
        title: "Notifications",
        href: "/notifications",
        icon: BellIcon,
      },
      {
        title: "Profile",
        href: "/profile",
        icon: UserIcon,
      },
    ],
  },
];
