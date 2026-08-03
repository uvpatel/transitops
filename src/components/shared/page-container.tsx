import * as React from "react";
import { cn } from "@/lib/utils";

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("space-y-6 max-w-7xl mx-auto w-full", className)}>{children}</div>;
}
