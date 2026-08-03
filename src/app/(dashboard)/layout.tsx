import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

const geistSans = Geist({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const geistMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: "TransitOps",
    description: "Vehicle Telematics Dashboard",
};


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-full flex flex-col">
                
                    <SidebarProvider
                        style={
                            {
                                "--sidebar-width": "calc(var(--spacing) * 72)",
                                "--header-height": "calc(var(--spacing) * 12)",
                            } as React.CSSProperties
                        }
                    >
                        <AppSidebar variant="inset" />
                        <SidebarInset>
                            <SiteHeader />
                            <TooltipProvider>
                            {children}
                        </TooltipProvider>
                    </SidebarInset>
                </SidebarProvider>
            </body>
        </html>
    );
}
