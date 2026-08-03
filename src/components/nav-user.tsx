"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import {
  EllipsisVerticalIcon,
  CircleUserRoundIcon,
  Building2Icon,
  BellIcon,
  LogOutIcon,
} from "lucide-react";

export function NavUser({
  user: fallbackUser,
}: {
  user?: {
    name: string;
    email: string;
    image?: string;
    avatar?: string;
  };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session } = useSession();

  const activeUser = session?.user || fallbackUser || {
    name: "Fleet Manager",
    email: "admin@transitops.com",
    image: undefined,
  };

  const userAvatar = ("image" in activeUser && activeUser.image) ? activeUser.image : (("avatar" in activeUser && activeUser.avatar) ? activeUser.avatar : undefined);

  const initials = activeUser.name
    ? activeUser.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "FO";

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err?.message || "Failed to log out.");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={userAvatar || undefined} alt={activeUser.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{activeUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{activeUser.email}</span>
                </div>
                <EllipsisVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            }
          />

          <DropdownMenuContent
            className="w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage src={userAvatar || undefined} alt={activeUser.name} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{activeUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">{activeUser.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem  className="cursor-pointer">
                <Link href="/dashboard/profile">
                  <CircleUserRoundIcon className="size-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Link href="/dashboard/organizations">
                  <Building2Icon className="size-4 mr-2" />
                  Organizations
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem  className="cursor-pointer">
                <Link href="/dashboard/notifications">
                  <BellIcon className="size-4 mr-2" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-rose-600 focus:text-rose-600">
              <LogOutIcon className="size-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
