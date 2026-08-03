import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 64)",
        "--header-height": "calc(var(--spacing) * 14)",
      } as React.CSSProperties}
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="flex flex-col flex-1 min-h-screen">
        <SiteHeader />
        <TooltipProvider>
          <div className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
            {children}
          </div>
        </TooltipProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
