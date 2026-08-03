export interface KpiMetric {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  description?: string;
}

export interface ChartDataPoint {
  date: string;
  [key: string]: string | number;
}

export interface ActivityItem {
  id: string;
  title: string;
  timestamp: string;
  type: "trip" | "maintenance" | "compliance" | "expense" | "user";
  severity?: "info" | "warning" | "error" | "success";
}
