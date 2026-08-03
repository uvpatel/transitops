import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/providers/app-providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "TransitOps - Fleet Operations Platform",
  description: "Enterprise vehicle telemetry, driver safety scoring, and trip dispatching platform.",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
      suppressHydrationWarning
    >

      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
<AppProviders>{children}</AppProviders>
          </ThemeProvider>
        
      </body>
    </html>
  );
}
