"use client";

import * as React from "react";
import { ErrorState } from "@/components/shared/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Dashboard runtime error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Dashboard Failed to Load"
      description={error.message || "An unexpected error occurred while loading this dashboard section."}
      onRetry={reset}
    />
  );
}
