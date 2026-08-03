import { LucideIcon } from "lucide-react";
import { AppRole, Permission } from "./auth";

export interface NavigationItem {
  title: string;
  href: string;
  icon: LucideIcon;
  permission?: Permission;
  roles?: AppRole[];
  badge?: string | number;
  children?: NavigationItem[];
}

export interface NavigationGroup {
  label: string;
  items: NavigationItem[];
}
